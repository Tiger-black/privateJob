import '@br/lib/zepto.min';
require('./index.less');
var Tpl = require('./index.ejs');
var Url = require('@br/lib/url');


function CardCheck2() {
    this.init.apply(this, arguments);
}

$.extend(CardCheck2.prototype, {
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
        return this.el.find(".checked").length==0;
    },
    checked:function(){
        return {"bankType":this.el.find(".checked").map(function(){return $(this).find("p").text()}).selector.join(",")}
    },
    next:function(callback){
        var _this = this;
        this.el.on("tap",'.nextBtn',callback.bind(this))
    },
    back:function(callback){
        var _this = this;
        this.el.on("tap",'.upBtn',callback.bind(this))
    },
    events: function () {
        var _this = this;
        this.el.on("tap",'.tagtwo>li',function(){
            if($(this).hasClass("checked")){
                $(this).removeClass("checked");
            }else{
                if(_this.el.find(".checked").length<4){
                    $(this).addClass("checked");
                }
            }
            if(_this.isNext()){
                _this.el.find(".nexttwo .disBtn").removeClass("disview");
                _this.el.find(".nexttwo .nextBtn").addClass("disview");
            }else{
                _this.el.find(".nexttwo .nextBtn").removeClass("disview");
               _this.el.find(".nexttwo .disBtn").addClass("disview");
            }
        })
    }
});

 module.exports = CardCheck2;
