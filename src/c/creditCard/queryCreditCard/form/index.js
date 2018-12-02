require('./index.less');
var tpl = require('./index.ejs');
var Events = require('@br/lib/events');
var Verifica = require('@br/lib/verifica');
var API = require('@br/common/api');
var Toast = require('@br/common/toast/');
var API_SENDMSG = `${API.creditCardURL}cardSchedule/sendMsg.do`;
var API_GETIMG = `${API.creditCardURL}cardSchedule/getImg.do`;

var SUBMIT_DATA = {};

function Index() {
    this.init.apply(this, arguments);
}

$.extend(Index.prototype, Events,{
    init: function (config) {
        this.el = config.el;
        this.data = config.data;
        this.data.fields = this.data.fields.split(',');
        this.bankId = config.bankId;
        this.defineSubmitData(this.data.fields);
        this.render();
        this.event()
        this.initVue();
    },
    defineSubmitData:function (data) {
        var self = this;
        data.forEach(function (item) {
            if (item === 'idCard') {
                self.IsCheckIdCard = true;
            } else if (item === 'phone') {
                self.IsCheckPhone = true;
            } else if (item === 'imgCode') {
                self.IsCheckImgCode = true;
            } else if (item === 'msgCode') {
                self.IsCheckMsgCode = true;
            } else if (item === 'name') {
                self.IsCheckoutName = true;
            }
        })
    },
    render: function () {
        var _html = tpl(this.data);
        this.el.html(_html);
    },

    event:function(){
        var self = this;
        this.el.on('tap','.queryBtn',function(e){
            console.log(SUBMIT_DATA)
            if(!$(this).hasClass('disabled')){
                self.trigger('submit', SUBMIT_DATA);
            }

            //mock
            // self.trigger('submit', {
            //     idCard: '1',
            //     imgCode: '1',
            //     msgCode: '1',
            //     name: '1',
            //     phone: '1'
            // });
            e.stopPropagation();
        }); 
    },
    initVue: function () {
        var self = this;
        this.myVue = new Vue({
            el: '#fromwarp',
            data: {
                subData: {
                    'name': {
                        'lable': '',
                        'isErr': false,
                        'isOk': true
                    },//姓名
                    'idcard': {
                        'lable': '',
                        'isErr': false,
                        'isOk': true
                    },//身份证号
                    'phone': {
                        'lable': '',
                        'isErr': false,
                        'isOk': false
                    },//电话号码
                    'sendCode': {
                        'lable': '',
                        'isErr': false,
                        'isOk': true
                    },//验证码
                    'sendImgCode': {
                        'lable': '',
                        'isErr': false,
                        'isOk': true
                    },//验证码
                }
            },
            methods: {
                inputBlur: function (key, order, msg) {
                    if (this.subData[key].lable != '' && !Verifica[order](this.subData[key].lable)) {
                        this.subData[key].isErr = true;
                        this.subData[key].isOk = false;
                        new Toast(msg, 2000);
                    } else {
                        if (this.subData[key].lable != '') {
                            this.subData[key].isOk = true;
                        }
                    }
                },
                inputCheck: function (key, order) {
                    this.subData[key].isErr = false;
                    if (Verifica[order](this.subData[key].lable)) {
                        this.subData[key].isOk = true;
                    } else {
                        this.subData[key].isOk = false;
                    }
                },
                sendCode: function () {
                    if (!$('.sendCodeBtn').hasClass('disabled') && !this.subData.phone.isErr && this.subData.phone.isOk) {
                        self.sendCodeFunction(this.subData.phone.lable);//发送验证码
                    }
                },
                sendImgCode: function () {
                    self.getImgCodeFunction();//获取图片验证码
                },
                checkFun: function (name, val) {
                    if (val === 'radio') {
                        // console.log(this.subData[name])
                        if (this.subData[name].isCheck == 1) {
                            this.subData[name].isCheck = 0;
                        } else {
                            this.subData[name].isCheck = 1;
                        }
                    } else {
                        this.subData[name].isCheck = val;
                    }
                },
            },
            watch: {
                subData: {
                    handler: function (val, oldVal) {
                        if (Verifica.isNameEZ(val.name.lable)) {//请勿删除这段代码 输入法直接粘贴汉字的情况只有这里才能检测到
                            val.name.isErr = false;
                            val.name.isOk = true;
                        } else {
                            val.name.isOk = false;
                        }
                        self.checkAlldata(val);
                    },
                    deep: true
                }
            }
        });
    }, checkAlldata: function (val) {
        var self = this;
        var flog = 1;


        // console.log(self.IsCheckIdCard, self.IsCheckPhone, self.IsCheckImgCode, self.IsCheckMsgCode, self.IsCheckoutName)
        if (self.IsCheckoutName){
            if (val.name.lable != '' && !val.name.isErr && val.name.isOk) {//姓名
                SUBMIT_DATA.name = val.name.lable;
            } else {
                flog = 0;
                //return false;
            }
        }
        
        if (self.IsCheckIdCard) {
            if (self.IsCheckIdCard && val.idcard.lable != '' && !val.idcard.isErr && val.idcard.isOk) {//身份证号
                SUBMIT_DATA.idCard = val.idcard.lable;
            } else {
                flog = 0;
                //return false;
            };
        }
        if (self.IsCheckPhone) {
            if (self.IsCheckPhone && val.phone.lable != '' && !val.phone.isErr && val.phone.isOk) {//手机号
                SUBMIT_DATA.phone = val.phone.lable;
            } else {
                flog = 0;
                //return false;
            }
        }
        if (self.IsCheckMsgCode) {
            if (self.IsCheckMsgCode && val.sendCode.lable != '' && !val.sendCode.isErr && val.sendCode.isOk) {//验证码
                SUBMIT_DATA.msgCode = val.sendCode.lable;
            } else {
                flog = 0;
                //return false;
            }
        }
        if (self.IsCheckImgCode) {
            if (self.IsCheckImgCode && val.sendImgCode.lable != '' && !val.sendImgCode.isErr && val.sendImgCode.isOk) {//验证码
                SUBMIT_DATA.imgCode = val.sendImgCode.lable;
            } else {
                flog = 0;
                //return false;
            }
        }
        // console.log(SUBMIT_DATA);
        if (flog == 1) {
            $('.queryBtn').removeClass('disabled');
            // console.log(SUBMIT_DATA)
        } else {
            $('.queryBtn').addClass('disabled');
        }
    },
    getImgCodeFunction:function () {
        var self = this;
        API.call({
            url: API_GETIMG,
            data: {
                "bank": this.bankId,
            },
            dataType: 'json',
            type: 'POST'
        }, function (res) {
            // console.log(res)
            if (res.code == 0) {
                $('.imgCodeImg').attr('src',res.data.img)
            } else {
                new Toast(res.message, 2000);
            }
        }, function (error) {
            console.log(error);
            new Toast('网络繁忙', 2000);
        });
    },
    sendCodeFunction: function (data) {
        var self = this;
        API.call({
            url: API_SENDMSG,
            data: {
                "mobile": data,
            },
            dataType: 'json',
            type: 'POST'
        }, function (res) {
            // console.log(res)
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
    upDate:function(data){
        this.data = data;
        this.render();
    }
});

module.exports = Index;