import '@br/lib/zepto.min';
require('./index.less');
var Tpl = require('./index.ejs');
var Url = require('@br/lib/url');


function CardCheck3() {
    this.init.apply(this, arguments);
}

$.extend(CardCheck3.prototype, {
    init: function (config) {
        this.address = new Url(); 
        this.el = config.el;
        this.data = config.data;
        this.render();
        this.events();
    },
    render: function () {
        var _html = Tpl(this.data);
        this.el.html(_html);
    },
    isNext:function(){
        return this.el.find(".checked").length<3;
    },
    checked:function(){
        return {
            "education":this.el.find(".education .checked div").text(),
            "job":this.el.find(".job .checked div").text()
        }
    },
    next:function(callback){
        var _this = this;
        this.el.on("tap",'.nextBtn',callback.bind(this))
    },
    back:function(callback){
        var _this = this;
        this.el.on("tap",'.upBtn',callback.bind(this))
    },
    changeBank:function(arr,code,callback){
        var img = "";
        for(var i=0;i<arr.length;i++){
            var src = arr[i].replace(/(.*)\./, '$1_40x40q90.');
            img+="<img src='"+src+"'/>";
        }
        $(".ownCard span").find("img").remove();
        $(".ownCard span").prepend(img);
        if(arguments.length==3){
            callback({"bankCode":code.join(",")});
        }
    },
    showBank:function(callback1,callback2){
        var _this = this;
        this.el.on("tap",'.cardTag>li',function(){
            if($(this).hasClass("checked")){
                $(this).removeClass("checked");
                if($(this).index()==0){
                    $(".ownCard").hide();
                }
            }else{
                $(this).addClass("checked").siblings().removeClass("checked");
                if($(this).parent().hasClass("cardTag")&&$(this).index()==1){
                    $(".ownCard").hide();
                    sessionStorage.removeItem("banklogo");
                    callback2({"bankCode":""});
                }else if($(this).index()==0){
                    $(".ownCard").show();
                    callback1();
                }
            }
            if(_this.isNext()){
                _this.el.find(".nextthree .disBtn").removeClass("disview");
                _this.el.find(".nextthree .nextBtn").addClass("disview");
            }else{
                _this.el.find(".nextthree .nextBtn").removeClass("disview");
               _this.el.find(".nextthree .disBtn").addClass("disview");
            }
           
        });
        this.el.on("tap",".ownCard",callback1);
    },
    
    //监听银行遮盖层关闭事件
    listenBankHide:function(callback){
        callback(function(){
            var banklogo = sessionStorage.getItem("banklogo");
            if(banklogo==null){
                $(".cardTag li").removeClass("checked").eq(1).addClass("checked");
                $(".ownCard").hide();
            }
        });
    },
    events: function () {
        var _this = this;
        this.el.on("tap",'.tagthree:not(.cardTag)>li',function(){
            if($(this).hasClass("checked")){
                $(this).removeClass("checked");
                if($(this).parent().hasClass("cardTag")&&$(this).index()==0){
                    $(".ownCard").hide();
                }
            }else{
                $(this).addClass("checked").siblings().removeClass("checked");
                if($(this).parent().hasClass("cardTag")&&$(this).index()==1){
                    
                    $(".ownCard").hide();
                }else if($(this).parent().hasClass("cardTag")&&$(this).index()==0){
                    $(".ownCard").show();
                }
            }
            if(_this.isNext()){
                _this.el.find(".nextthree .disBtn").removeClass("disview");
                _this.el.find(".nextthree .nextBtn").addClass("disview");
            }else{
                _this.el.find(".nextthree .nextBtn").removeClass("disview");
               _this.el.find(".nextthree .disBtn").addClass("disview");
            }
           
        });
        
    }
});

 module.exports = CardCheck3;
