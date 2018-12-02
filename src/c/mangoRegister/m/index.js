/**
 * @fileOverview
 * @author dezhao
 */

require('./index.less');
require('@br/lib/zepto.min');

var API = require('@br/common/api');
var Event = require('@br/lib/events');
var Verifica = require('@br/lib/verifica');
var Toast = require('@br/common/toast/index');
var PasswordHash = require('@br/lib/passwordHash');
var sendImg = require('@br/common/sendImg/m');

var Tpl = require('./index.ejs');

//虾球appid为4,榕树appid为5;
var APPID={
    xiaqiuId:'4',
    rongshuId:'5'
};

function Register() {
    this.init.apply(this, arguments);
}

$.extend(Register.prototype, Event, {
    init: function (config) {
        this.el = config.el;
        this.userData = {
            appId: APPID.rongshuId,
            flag: '1',
            deviceId: 'mmmmm'
        }; 
        this.data = {
            buttonText: '注册',
            channel: 'rongshugw'
        };
        $.extend(this.data, config.data);

        this.render();
        this.phoneInput = this.el.find('.phone-num');
        this.identifyInput = this.el.find('.identify-num');
        this.passwordInput = this.el.find('.password');
        this.submitButton = this.el.find('.submit');
        this.flag = false;

        this.events();
        this.telFocus();//电话号码撤销按钮
    },

    render: function () {
        var _html = Tpl(this.data);
        this.el.html(_html);
    },

    events: function () {
        var self = this;
        this.el.find('.identify').on('click', function (event) {
            self.trigger('sendCodeClick');
            self.value =  self.phoneInput.val() || '';
            if (Verifica.isTel(self.value)) {
                self.initSend(self.value,function(data){
                    self.sendCode(data);
                });
            } else {
                new Toast('请填有效的手机号', 2000)
            }
        });

        this.el.find('.submit').on('click', function (event) {
            self.trigger('submitClick',self.phoneInput.val());
            self.submitRegister();
        });

        this.on('requestCode', function () {
            self.countDown();
            self.el.find('.identify').addClass('disabled');
        });

        this.el.find('.item').on('keyup','input',function(){
            if(self.phoneInput.val() && self.identifyInput.val() && self.passwordInput.val()){
                $('.requestCoupon').removeClass('disable')
            }else{
                 $('.requestCoupon').addClass('disable')
            }
        })
    },

    sendCode: function (data) {
        var self = this;
        API.call({
            url: API.sendCode,
            data: {
                "appId": this.userData.appId,
                "flag": this.userData.flag,
                "unionId": self.value,
                "token":data.token,
                "id":data.id
            },
            // dataType:'json',
            // type:'POST'
        }, function (res) {
            console.log(res)
            if (res.code == 0) {
                new Toast('验证码发送成功', 2000);
                self.trigger('requestCode', res);
            } else {
                new Toast(res.message, 2000);
            }
        }, function (error) {
            console.log(error);
            new Toast('网络繁忙', 2000);
        });
    },

    initSend: function (phone,callback) {
        if(this.sendImg){
            this.sendImg.refreshImgData({
                data:{
                    appId: this.userData.appId,
                    flag: this.userData.flag,
                    unionId: phone,
                }
            });
        }else{
            this.sendImg = new sendImg({
                data:{
                    appId: this.userData.appId,
                    flag: this.userData.flag,
                    unionId: phone,
                }
            });
            this.sendImg.on('sendSuccess',function(data){
                callback(data);
            })
        }
    },

    submitRegister: function () {
        var self = this;
        this.userData.unionId = this.phoneInput.val();
        this.userData.captcha = this.identifyInput.val();
        this.userData.password = this.passwordInput.val();
        if (!this.flag) {
            var checkItem = this.checkItem(this.userData.unionId, this.userData.captcha, this.userData.password);
            if (checkItem) {
                self.trigger('submit', this.userData.unionId);
                this.userData.password = PasswordHash(this.userData.password);
                self.data.mangoData.uuid = PasswordHash(this.userData.unionId.substring(5));
                // console.log(self.data.mangoData.uuid)
                var _data = $.extend({
                    channel: self.data.channel,
                    pchannel: self.data.pchannel,
                    ext: self.data.ext,
                    mangoData: JSON.stringify(self.data.mangoData)
                }, self.userData);
                API.call({
                    url: API.registerMango,
                    data: _data
                }, function (res) {
                    self.flag = false;
                    if (res.code == 0) {
                        self.trigger('register', $.extend({
                            phone: self.userData.unionId
                        }, res));
                    } else {
                        new Toast(res.message);
                    }
                }, function (error) {
                    self.flag = false;
                    console.log(error);
                })
            }
        } else {

        }
    },

    checkItem: function (user, identify, password) {
        if (user == '' || identify == '' || password == '') {
            new Toast('请填写全部信息', 2000);
            return false;
        } else if (!Verifica.isTel(user)) {
            new Toast('请填写有效手机号', 2000);
            return false;
        } else if (!Verifica.isPass(password)) {
            new Toast('请填写6-12位英文或数字', 2000);
            return false;
        }
        return true;
    },

    telFocus: function () {
        var self = this;
        this.phoneNum = this.phoneInput;
        this.delete = this.el.find('.requestPhone .delete');
        this.phoneInput.on('keyup', function () {
            var _val = $(this).val();
            var length = _val.length;
            if(self.data.isIdentifyDisable){
                if (length == 11) {
                    self.el.find('.identify').removeClass('identifyDisable');
                }else{
                    self.el.find('.identify').addClass('identifyDisable');
                }
            }
            if (_val != '') {
                self.delete.show();
            } else {
                self.delete.hide();
            }
        });
        this.phoneInput.on('focus',function(){
            var _val = $(this).val();
            if (_val != '') {
                self.delete.css('opacity','1')
            }
        })
        this.phoneInput.on('blur',function(){
            self.delete.css('opacity','0')
        })
        this.delete.on('click', function () {
            self.delete.hide();
            self.phoneNum.val('');
        });
    },

    countDown: function () { //验证码倒计时
        var self = this;
        var buttonIdentify = this.el.find('.identify');
        if (self.timer) {
            clearInterval(self.timer);
        } else {
            var count = 60;
            buttonIdentify.html('60s').attr('disabled', false);
            self.timer = setInterval(function () {
                if (count > 0) {
                    count--;
                    buttonIdentify.html(count + 's').attr('disabled', false);
                } else {
                    clearInterval(self.timer);
                    self.timer = null;
                    buttonIdentify.removeClass('disabled');
                    buttonIdentify.html('重新获取').removeAttr('disabled');
                }
            }, 1000);
        }

    }
});


module.exports = Register;