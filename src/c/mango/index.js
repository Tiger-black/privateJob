require('@br/lib/zepto.min');
var PasswordHash = require('@br/lib/passwordHash');

function Register() {
  this.init.apply(this, arguments);
}

$.extend(Register.prototype, Event, {
  init:function(){
    this.SESSIONID = this.getSeaaion();
    this.PKID = this.getPkid();
    this.REFERRE = this.getReferrer();

    this.sendUCspm('pageview');

    // var res ={};res.phone = '13581910448'
    // this.sendUCspm('event',res.phone);
  },
  sendUCspm: function (t, phone){
    var data = {
        "t": t,
        "_gid": this.SESSIONID,
        "rf": escape(this.REFERRE),
        "dl": escape(window.location.href),
        "sr" : window.screen.width + 'x' + window.screen.height,
        "bl" : navigator.language,
        "st" :document.documentElement.scrollTop,
        "reqs" : new Date().getTime(),
        "_pkid": this.PKID
      };
    if(t === 'event' && phone) {
      data.uuid = PasswordHash(phone.substring(5));
    }
    $.ajax({
      url: 'https://api.mango-go.com/analytics/collect.json',
      // url: 'https://test.api.mango-go.com/analytics/collect.json',
      data: data,
      type: 'POST',
      dataType: 'json',
      success: function (res) {
        // 成功发送不需要处理
        console.log(res)
      },
      error: function (error) {
        console.log(error);
      }
    });
    window.BrSPM.RecordEvent('10112', {
      data
    });
  },
  getReferrer: function () {
    var referrer = '';
    try {
      referrer = window.top.document.referrer;
    } catch (e) {
      if (window.parent) {
        try {
          referrer = window.parent.document.referrer;
        } catch (e2) {
          referrer = '';
        }
      }
    }
    if (referrer === '') {
      referrer = document.referrer;
    }
    return referrer;
  },
  getPkid: function () {
    if (PKID = this.getCookie('PKID')) {
      return PKID
    } else {
      var PKID = this.generateSession(18);
      this.setCookie('PKID', PKID, 30 * 60 * 1000)
      return PKID
    }
  },
  getSeaaion: function () {
    if (SESSIONID = this.getCookie('SESSIONID')){
      return SESSIONID
    } else {
      var SESSIONID = this.generateSession(22);
      this.setCookie('SESSIONID', SESSIONID, 7 * 24 * 60 * 60 * 1000)
      return SESSIONID
    }
  },
  setCookie: function(c_name, value, expiredays){
    var Days = expiredays || 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  },
  getCookie: function(c_name){
    var arr, reg = new RegExp("(^| )" + c_name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  },
  generateSession: function (n) {
    var words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var chars = nums.concat(words).concat(words.map(function (s) {
      return s.toLowerCase();
    }));
    var res = '';
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 61);
      res += chars[id];
    }
    return res;
  }
});
module.exports = Register;

