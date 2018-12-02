var GetChannelFun = require('@br/common/getchannel');
var RegisterModule = require('@br/register/index');
var Event = require('@br/lib/events');



function PageFactory() {
    this.init.apply(this, arguments);
}
$.extend(PageFactory.prototype, Event, {
    init(config) {
        this.source = config.source;
        this.el = config.el;
        this.buttonText = config.buttonText;
        this.isJrttSend = config.isJrttSend || '';//是否需要发今日头条统计的页面
        this.isIdentifyDisable = config.isIdentifyDisable || false;//初始化时是否置灰验证码按钮
        this.isMangoPage = config.isMangoPage || ''; //是否正芒的页面
        this.mangoData = config.mangoData || ''; //给后端发的正芒数据
        this.timeIndex = 30;//gid 轮询index
        this.getGID();//拿gid && 发一条页面曝光埋点
        this.checkSource();//把渠道号发给GetChannelFun 检测渠道号在不在渠道列表里
    },
    getGID() {
        if (this.gid){
            window.BrSPM && window.BrSPM.RecordEvent('10155', {
                gid: this.gid,
                channel: this.source || ''
            });
        }else{
            if (this.isNoLocalStorage()){
                this.gid = window.localStorage.getItem("bairong_l_gid");
                if (this.timeIndex > 0) {
                    window.setTimeout(() => {
                        this.getGID();
                    }, 100);
                    this.timeIndex--
                } else {
                    this.gid = 'null nogid';
                    window.BrSPM && window.BrSPM.RecordEvent('10155', {
                        gid: this.gid,
                        channel: this.source || ''
                    });
                }
            } else {
                this.gid = 'null nolocalStorage';
            }
        }
    },
    isNoLocalStorage() {
        try {
            var isSupport = 'localStorage' in window && window['localStorage'] !== null;
            if (isSupport) {
                window.localStorage.setItem('__test', '1');
                window.localStorage.removeItem('__test');
            }
            return isSupport;
        } catch (e) {
            return false;
        }
    },
    checkSource() {
        var self = this;
        this.GetChannelFun = new GetChannelFun({ channel: this.source });

        this.GetChannelFun.on('success', function (res) {
            self.onChannelDown(res);//拿到后端需要的channel、pchannle 例:AppStore_rongshugw、rongshugw
        });

        this.GetChannelFun.on('error', function (res) {//静态接口调用失败后 错误信息埋点
            self.onChannelDown(res);
            window.BrSPM && window.BrSPM.RecordEvent('10172', encodeURI(JSON.stringify(res.errMsg)));
        });
    },
    onChannelDown(data) {
        this.channel = data.channel;
        this.pchannel = data.pchannel;
        this.os = data.os;
        this.initRegister();//初始化输入模块
    },
    initRegister() {
        var self = this;
        this.registerModule = new RegisterModule({
            el: this.el,
            data: {
                channel: this.channel,
                pchannel: this.pchannel,
                buttonText: this.buttonText,
                isIdentifyDisable:this.isIdentifyDisable,
                isMangoPage: this.isMangoPage, //是否正芒的页面
                mangoData: this.mangoData//给后端发的正芒数据
            }
        });
        this.registerModule.on('sendCodeClick', function (res) {//获取验证码
            self.sendSpm('10077', res);
        });
        this.registerModule.on('submitClick', function (res) {//注册按钮每次点击
            self.sendSpm('10078', res);
        });
        this.registerModule.on('submit', function (res) {//注册按钮每次有效点击
            self.sendSpm('10133', res);
        });
        this.registerModule.on('register', function (res) {//注册成功
            if (self.isMangoChanel) {
                self.mango.sendUCspm('event', res.phone);
            }
            self.phone = res.phone;
            self.sendSpm('10079', res.phone);
            self.trigger('registerSuccess', {
                channel: self.pchannel,
                os: self.os,
                phone: res.phone,
                gid: self.gid
            });
        });
    },
    downloadRongShuAPP(spmid) {
        var pageid = spmid || '10080';
        this.sendSpm(pageid, this.phone || '');
        window.open('https://www.rongshu.cn:8443/promotion/d/index.html?c=' + this.pchannel, '_blank');
    },
    sendSpm(spmNum, phone){
        window.BrSPM && window.BrSPM.RecordEvent(spmNum, {
            channel: this.pchannel,
            os: this.os,
            phone: phone,
            gid: this.gid
        });
    }
});

module.exports = PageFactory;