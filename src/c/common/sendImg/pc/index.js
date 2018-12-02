/**
 * @fileOverview
 * @author dezhao
 */

require('./index.less');
var API = require('@br/common/api');
var Event = require('@br/lib/events');
var Tpl = require('./index.ejs');
var MD5 = require('@br/lib/md5');
var Toast = require('@br/common/toastPC/index');

function Index() {
    this.init.apply(this, arguments);
}
$.extend(Index.prototype, Event, {
    init: function (config) {
        this.sortData = config.data;
        this.flog = false;
        this.isBindEvent = false;
        this.clientX = 0;
        this.moveX = 0;
        this.maxwidth = 0;
        this.dateShiJian  = 0;
        this.sortMd();
        this.refreshImgData();
    },

    render: function () {
        var _html = Tpl(this.data);
        this.el.html(_html);
        this.maxwidth = $(this.el).find('.sendimg').width() - $(this.el).find('.mimg').width();
    },
    events:function (){
        var self = this;
        // document.addEventListener('touchmove',function(event){event.preventDefault(); },false);
        $(this.el).on('mousedown','.tips',function(e){
            self.clientX = e.pageX;
            $('.empty').addClass('emptycheck')
            self.flog = true;
        });
        $(this.el).on('mouseup',function(e){
            self.clientX = 0;
            self.flog = false;
            $('.empty').removeClass('emptycheck');
            if ($('.empty').width()>0){
                self.submitSend($('.empty').width() / self.maxwidth);
            }
        });
        
        $(this.el).on('mousemove',function(e){
            e.preventDefault();
            self.moveX = e.clientX - self.clientX;
            if(self.moveX > 0 && self.flog && self.moveX < self.maxwidth){
                $('.empty').css('width',self.moveX+'px')
                $('.mimg').css('left',self.moveX+'px')
                $(self.el).find('.tips').css('left',self.moveX+'px')
            }
        });

        $('#J_sendimg').on('touchmove',function(e){
            e.preventDefault();
        });
    },
    sortMd:function(){
        var arr = [];
     　　for ( var i in this.sortData ){
         　　 var str = i + '=' + this.sortData[ i ]
          　　arr.push( str );
    　　}
        arr.sort();
        // console.log(API.sendCode + '?' + arr.join('&'))
        this.mdStr = MD5(API.sendCode + '?' + arr.join('&')).toUpperCase();
        // console.log(this.mdStr)
    },
    closeModule:function(){
        $('.send_mask').hide();
        $('.sendimg').hide();
    },
    submitSend:function(shift){
        var self = this;
        API.call({
            url: API.picVerifyCheck,
            data: {
                "id": self.data.id,
                "shift": shift,
            },
            dataType:'json',
            type:'POST'
        }, function (res) {
           if(res.code == 0){
                self.closeModule();
                res.id = self.data.id
                self.trigger('sendSuccess', res);
            }else{
                new Toast('拼图失败，请重试');
                self.refreshImgData();
            }
        }, function (error) {
            console.log(error);
            new Toast('网络繁忙', 2000);
        });
    },

    refreshImgData: function(data) {
        var self = this;
        if(data){
            this.sortData = data.data;
            this.sortMd();
        }
        API.call({
            url: API.picVerify,
            type:'POST',
            data:{
                md5:this.mdStr
            }
        }, function (data) {
            self.data = data;
            if(!self.isBindEvent){
                self.isBindEvent = true;
                var aa=document.createElement("DIV");
                aa.setAttribute("id","J_sendimg");
                document.body.appendChild(aa);
                self.el = $('#J_sendimg');
                self.events();
            }
            self.render();
            self.dateShiJian = new Date() * 1;
            $('.send_mask').show();
        }, function (error) {
            console.log(error);
        })
    }
});

module.exports = Index;