import '@br/lib/zepto.min';
require('./index.less');
var Tpl = require('./index.ejs');
var Url = require('@br/lib/url');


function CardCheck3_1() {
    this.init.apply(this, arguments);
}
//判断鼠标滑动
$.fn.slideDirection=function(callback){
    var startPosition, endPosition, deltaX, deltaY, moveLength;  
    this.bind('touchstart', function(e){  
        var touch = e.touches[0];  
        startPosition = {  
            x: touch.pageX,  
            y: touch.pageY  
        }  
    }) .bind('touchmove', function(e){  
        var touch = e.touches[0];  
        endPosition = {  
            x: touch.pageX,  
            y: touch.pageY  
        };  

        deltaX = endPosition.x - startPosition.x;  
        deltaY = endPosition.y - startPosition.y;  
        moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));  
    }).bind('touchend', function(e){  
        if(deltaX < 0) { // 向左划动  
            callback.call(this,1);
        } else if (deltaX > 0) { // 向右划动  
            callback.call(this,-1);
        }  
    });  
}
$.extend(CardCheck3_1.prototype, {
    init: function (config) {
        this.el = config.el;
        this.data = config.data;
        this.render();
        this.events();
        this.page=0;
        
    },
    render: function () {
        var _html = Tpl(this.data);
        this.el.html(_html);
    },
    isNext:function(){
        return this.el.find(".bankWap .view").length==0;
    },
    next:function(callback,fun1){
        var _this = this;
        this.el.on("tap",'.nextBtn',function(){
            var bank=[];
            var bankCode=[];
            $(".bankWap").find(".view").each(function(i){
                if(bank.length<4){
                    bank.push($(this).parent(".bankIcon").data("logo"));
                }
                bankCode.push($(this).parent(".bankIcon").data("code"))
            });
            sessionStorage.setItem("banklogo",bank.join(","));
            callback(bank,bankCode,fun1);
            _this.el.find(".tip>div").trigger("tap");
        });
    },
    close:function(clo,callback){  
        this.el.on("tap",".tip>div",function(){
            $(this).parents("."+clo).fadeOut(200);
            callback();
        });  
    },
    events: function () {
        var _this = this;
        _this.el.on("tap",'.tag>li',function(){
            if($(this).find(".bankIcon .view").length==0){//勾选
                $(this).find(".bankIcon .coverDiv").addClass("view");

            }else{//不勾选
                $(this).find(".bankIcon .coverDiv").removeClass("view")
            }
            if(_this.isNext()){
                _this.el.find(".btn .nextBtn").addClass("disview");
                _this.el.find(".btn .disDone").removeClass("disview");
            }else{
                _this.el.find(".btn .nextBtn").removeClass("disview");
                _this.el.find(".btn .disDone").addClass("disview");
            }
        });
        _this.el.find(".bankWap").slideDirection(function(direction){
            if(direction==-1){//向右滑动
                if(_this.page>0){
                    _this.page = _this.page+direction;
                }
            }else{//向左滑动
                if((_this.page+1)<$(this).find(".bankWapLi").length){
                    _this.page = _this.page+direction;
                }
            }
            if(_this.page<$(this).find(".bankWapLi").length&&_this.page!=-1){
                $(this).css("left","-"+_this.page*100+"%");
                $(".pointer").find("span").eq(-_this.page).css("opacity","0.8").siblings().css("opacity","0.3");
            }
        });
        
    }
});

 module.exports = CardCheck3_1;
