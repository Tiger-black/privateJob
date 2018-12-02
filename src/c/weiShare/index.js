require('../lib/zepto.min');
var API=require('../common/api');
var Toast = require('../common/toast/index');

function Index() {
    this.init.apply(this, arguments);
}

Index.prototype = {
    init: function (config) {
        this.data = config;
        this.event();
    },
    event:function(){
        var self=this;
        self.shareConfig(self.data);
    },
        shareConfig:function(){
        var self =this;
        API.call({
                url: self.data.url
            }, function (data) {
                console.log(data);
                if(data.code == 0){
                    wx.config({
                        debug: false,
                        appId: data.appid, // 必填，公众号的唯一标识
                        timestamp:data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.noncestr, // 必填，生成签名的随机串
                        signature: data.signature,// 必填，签名，见附录1
                        jsApiList: [
                            'onMenuShareTimeline','onMenuShareAppMessage'
                        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function(){
                        self.shareGo(self.data.title,self.data.desc,self.data.link,self.data.imgUrl);
                    });
                    wx.error(function(res){
                        self.showError(res,2000);
                    });
                }else{
                    //self.showError(ErrorMsg(data.code),2000);
                }
            }, function () {
                console.log('error');
            }
        );
    },

    shareGo:function(title,desc,url,imgUrl){
        wx.onMenuShareTimeline({
            title:title, // 分享标题
            link: url, // 分享链接
            imgUrl:imgUrl, // 分享图标
            success: function () {
                self.showError('分享朋友圈成功',2000);
            },
            cancel: function () {
                self.showError('取消了分享',2000);
            }
        });
        wx.onMenuShareAppMessage({
            title:title, // 分享标题
            desc: desc, // 分享描述
            link: url, // 分享链接
            imgUrl:imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                self.showError('分享成功',2000);
            },
            cancel: function () {
                self.showError('取消了分享',2000);
            }
        });
    },
    showError: function (message,time) {
        new Toast(message, time);
    }
};

new Index();