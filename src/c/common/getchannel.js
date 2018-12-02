require('@br/lib/zepto.min');
var Event = require('@br/lib/events');
var ua = navigator.userAgent;
var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var API_GETCHANNEL = 'https://admss.shuqudata.com/api/5a98c22c3f1d4601693c668e/5a9cf24a699484015b3f1c3b';


function GetChannelFun() {
    this.init.apply(this, arguments);
}

$.extend(GetChannelFun.prototype, Event, {
    init: function (config) {
        this.channel = config.channel
        this.bind();
        this.getChannel();   
    },
    bind(){
        var self = this;
        this.on('channelListSuccess',function(res) {
            var _pchannel = self.channel;
            var isFlag = $.inArray(_pchannel, res.channelList);
            if (isFlag == -1) {
                _pchannel = 'rongshugw';
            }
            var machining = self.machining(_pchannel);
            self.trigger('success', {
                channel: machining[0],
                pchannel: _pchannel,
                apkVersion: res.apkVersion,
                os: machining[1],
            });
        })
        this.on('channelListError', function (res) {
            var _pchannel = 'rongshugw';
            var machining = self.machining(_pchannel);
            self.trigger('error', {
                channel: machining[0],
                pchannel: _pchannel,
                os: machining[1],
                apkVersion: false,
                errMsg: res
            });
        })
    },
    machining(data) {
        var _channel, _os;
        if (isiOS) {
            if (data.indexOf('_') == -1) {
                _channel = 'AppStore_' + data;
            }
            _os = 'ios';
        } else {
            if (data.indexOf('_') == -1) {
                _channel = 'android_' + data;
            }
            _os = 'android';
        }
        return [_channel, _os]
    },
    getChannel() {
        var self = this;
        $.ajax({
            url: API_GETCHANNEL,
            type: 'GET',
            dataType: 'jsonp',
            success: function (data) {
                if (data.code == 0) {
                    // console.log(data.data.channelList)
                    self.trigger('channelListSuccess', data.data);
                } else {
                    self.trigger('channelListError', data);
                }
            },
            error: function (error) {
                // console.log(error);
                self.trigger('channelListError', error);
            }
        });
    }
});

module.exports = GetChannelFun;



