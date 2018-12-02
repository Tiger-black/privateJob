'use strict';
import "./index.less";
import tpl from "./index.ejs";
import API from "@br/common/api";
import Toast from "@br/common/toast/";
import Event from "@br/lib/events";
import Verifica from "@br/lib/verifica";
/* 日常地址 */
// let APICHECKPHONE = API.creditCardURL + 'creditCard/checkPhone.do';
// let APISENDMSG = API.creditCardURL + 'creditCard/sendMsg.do';
// let APIRECORD = API.creditCardURL + 'creditCard/record.do';

/* 线上地址 */
let APICHECKPHONE = 'https://fenxiaoapi.shuqucdn.com/distribution/h5/creditCard/checkPhone.do';
let APISENDMSG = 'https://fenxiaoapi.shuqucdn.com/distribution/h5/creditCard/sendMsg.do';
let APIRECORD = 'https://fenxiaoapi.shuqucdn.com/distribution/h5/creditCard/record.do';

var CHECKPHONE = {
    code: 0,
    message: '成功',
    status: 1
}

class Index {
    constructor(...args) {
        this.init(...args);
    }
}

$.extend(Index.prototype, Event, {
    init: function (config) {
        this.el = config.el;
        this.data = config.data;
        this.render();
        /* 取localstorage数据 */
        this.getLocalPhone = localStorage.getItem("phone");
        if (this.getLocalPhone) {
            this.el.find('.dialog_phone').val(this.getLocalPhone)
        }
        this.phone = this.el.find('.dialog_phone');
        this.code = this.el.find('.dialog_code');
        this.dialog_cont = this.el.find('.dialog_cont_code');
        this.event();
        this.buttonLight();
    },

    render() {
        var _html = tpl(this.data);
        this.el.html(_html);
    },

    event() {
        /* 点击关闭按钮 */
        this.el.on('click', '.dialog_close', (e) => {
            BrSPM.RecordEvent('10163', { gid: this.data.gid, channel: this.data.channelId });
            this.el.hide();
            this.trigger('close', null);
            e.preventDefault();
            e.stopPropagation();
        });

        /* 获取验证码 */
        this.el.on('click', '.dialog_getcode', () => {
            var phone = $('.dialog_phone').val();
            BrSPM.RecordEvent('10164', { gid: this.data.gid, channel: this.data.channelId,phone:phone});
            if ($('.dialog_getcode').html() == '重新获取') {
                this.secondgetNum();
            }
        })

        this.el.on('keyup', 'input', (e) => {
            this.el.find('.errorMessage').html('');
            this.buttonLight();
        })

        this.el.on('focus', 'input', (e) => {
            $(e.target).parent('.dialog_cont').addClass('border_check');
        })

        this.el.on('blur', 'input', (e) => {
            $(e.target).parent('.dialog_cont').removeClass('border_check');
        })

        /* 点击下一步提交 */
        this.el.on('click', '.reset', () => {
            var phone = $('.dialog_phone').val();            
            BrSPM.RecordEvent('10165', {
                id: this.data.cardId ? this.data.cardId : '',   //点击提交申请id
                type: this.data.type ? this.data.type : '',
                gid: this.data.gid, 
                channel: this.data.channelId, 
                phone: phone
            });
            let check = this.checkAll();
            if (this.clickSubmit) {
                this.dialogsubmit();
            } else {
                if (check) {
                    /* 判断是否需要验证码 */
                    this.needCode();
                }
            }
        })

    },

    /* 按钮点亮 */
    buttonLight() {
        if (this.phone && this.code && this.dialog_cont.length > 0) {
            if (this.el.find('input').val() != '') {
                this.el.find('.second_submit').addClass('reset');
            } else {
                this.el.find('.second_submit').removeClass('reset');
            }
        } else {
            if (this.phone.val() != '') {
                this.el.find('.second_submit').addClass('reset');
            } else {
                this.el.find('.second_submit').removeClass('reset');
            }
        }

    },

    checkAll() {
        var res = false;
        if (this.phone && this.code && this.dialog_cont.length > 0) {
            if (this.phone.val() == '') {
                this.el.find('.errorMessage').html('请输入手机号')
            } else if (!Verifica.isTel(this.phone.val())) {
                this.el.find('.errorMessage').html('手机号格式有问题')
            } else if (this.code.val() == '') {
                this.el.find('.errorMessage').html('请输入短信验证码')
            } else {
                res = true;
            }
        } else {
            if (this.phone.val() == '') {
                this.el.find('.errorMessage').html('请输入手机号')
            } else if (!Verifica.isTel(this.phone.val())) {
                this.el.find('.errorMessage').html('手机号格式有问题')
            } else {
                res = true;
            }
        }
        return res;
    },

    needCode() {
        let phone = this.phone.val();
        API.call({
            url: APICHECKPHONE,
            data: {
                phone: phone,
                channelId: this.data.channelId, //channelId,     /* ??? */
                gid: this.data.gid, //gid,     /* ??? */
                cardId: this.data.cardId
            }
        }, (res) => {
            if (res.code === 0) {
                if (res.status == 0) {
                    /* 需要验证，显示验证码输入框*/
                    this.el.find('#dialog_codenumber').addClass('dialog_cont_code');
                    /* 第一次自动调取验证码 */
                    this.secondgetNum();
                    this.clickSubmit = true;
                } else {
                    this.dialogsubmit();
                    this.clickSubmit = true;
                }
            } else {
                new Toast(res.message, 3000);
                this.clickSubmit = true;
            }
        }, (err) => {
            console.log(err.message);
        });
    },

    //获取短信验证码
    secondgetNum() {
        let phone = this.el.find('.dialog_phone').val();
        API.call({
            url: APISENDMSG,
            data: {
                phone: phone
            }
        }, (res) => {
            if (res.code == 0) {
                new Toast('验证码发送成功', 3000);
                this.countDown();
            } else {
                new Toast(res.message, 3000);
                this.el.find('.dialog_getcode').html('重新获取').removeAttr('disabled', true);
            }
        }, (err) => {
            console.log(err.message);
        });

    },

    //验证码倒计时
    countDown() {
        var buttonIdentify = this.el.find('.dialog_getcode');
        if (this.timer) {
            clearInterval(this.timer);
        } else {
            var count = 60;
            this.timer = setInterval(() => {
                if (count > 0) {
                    count--;
                    buttonIdentify.html(count + 's').attr('disabled', true);
                } else {
                    clearInterval(this.timer);
                    buttonIdentify.html('重新获取').removeAttr('disabled', true);
                    this.timer = null;
                }
            }, 1000);
        }
    },

    /* 用户点击跳转时记录用户选择卡 */
    dialogsubmit() {
        let captcha = this.el.find('.dialog_code').val();
        let phone = this.el.find('.dialog_phone').val();
        API.call({
            url: APIRECORD,
            data: {
                captcha: captcha ? captcha : '',
                phone: phone,
                channelId: this.data.channelId, //channelId,     /* ??? */
                gid: this.data.gid, //gid,     /* ??? */
                cardId: this.data.cardId
            }
        }, (res) => {
            if (res.code == 0) {
                localStorage.setItem('phone', phone);
                // 成功告诉父级
                this.trigger('successdata', res);
            } else {
                new Toast(res.message)
                if (res.code == '10006' || res.code == '10007' || res.code == '10008') {
                    this.el.find('.dialog_code').val('')
                    this.el.find('.dialog_getcode').html('重新获取').removeAttr('disabled');
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }
        }, (err) => {
            console.log(err.message);
        });
    }

});

module.exports = Index;