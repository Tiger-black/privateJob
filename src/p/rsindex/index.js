require('@br/lib/zepto.min');
var Dialog = require('@br/common/dialog/index');
var Clipboard = require('@br/lib/clipboard.min');
var _ = require('underscore');
function Index() {
    this.init.apply(this, arguments);
}

_.extend(Index.prototype, {
    init:function(){
        if(!this.IsPC()){
            this.dialog = new Dialog({});
            this.mEvent();
        }else{
            this.event();
        };
        this.dontWheel();
    },
    event:function(){
        $('.header').on('click','.aboutBtn',function(){
            $('.about').addClass('aboutShow');       
        });
        $('.about').on('click','.closeBtn',function(){
            $('.about').removeClass('aboutShow');
        });
    },
    mEvent:function(){
        var self = this;
        var clipboard = new Clipboard('.wxBTN');
        clipboard.on('success', function(e) {
            self.dialog.show({
                className: 'J_dialogRepay',
                iconfont: '',
                contentData: {phoneNumber: '13521602062'},
                content: '已复制“榕树服务号”<br>去微信中粘贴？',
                cancel: '取消',
                confirm: '打开微信',
                onconfirm: function () {
                   window.open('weixin://http://weixin.qq.com');
                }
            });
        });
        clipboard.on('error', function(e) {
            console.log(2);
        });
        $('.phoneBtn').on('tap',function(){
            // $('.about').removeClass('aboutShow');
            $('.navList').addClass('navlistShow'); 
            $('.about').addClass('warpBlur');
            $('.topwarp').addClass('warpBlur');
            $('.phoneBtn').hide();
        });
        $('.navList').on('tap','li.ab',function(){
            if($(this).hasClass('liCheck')) return false;
            $(this).addClass('liCheck').siblings().removeClass('liCheck');
            $('.navList').removeClass('navlistShow');
            $('.about').removeClass('warpBlur');
            $('.topwarp').removeClass('warpBlur');
            $('.phoneBtn').show();
            if($(this).hasClass('aboutBtn')){
                $('.about').addClass('aboutShow');
            }else{
                $('.about').removeClass('aboutShow');
            };
        });
        $('.navList').on('tap','.closeBtn',function(){
            $('.about').removeClass('warpBlur');
            $('.topwarp').removeClass('warpBlur');
            $('.phoneBtn').show();
            $('.navList').removeClass('navlistShow');
        });
        $('.top-inof').on('tap','button',function(){
           window.open('https://www.rongshu.cn/promotion/d/index.html');
        });
    },
    dontWheel:function(){
        var firefox = navigator.userAgent.indexOf('Firefox') != -1;
        var about = document.getElementById('about');
        firefox ? about.addEventListener('DOMMouseScroll', this.MouseWheel, false) :  (about.onmousewheel = this.MouseWheel);
        $('#about').on('touchmove',function(e){
            e.preventDefault();
        });
        $('#navList').on('touchmove',function(e){
            e.preventDefault();
        });  
        $('.J_Dialog').on('touchmove', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
    },
    IsPC:function(){
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    MouseWheel(e){
        e = e || window.event;
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
         
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }
});
new Index();
        

         
    











