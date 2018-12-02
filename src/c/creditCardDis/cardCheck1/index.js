import '@br/lib/zepto.min';
require('./index.less');
var Tpl = require('./index.ejs');
var Url = require('@br/lib/url');


function CardCheck1() {
    this.init.apply(this, arguments);
}

$.extend(CardCheck1.prototype, {
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
        return {"special":this.el.find(".checked").map(function(){return $(this).text()}).selector.join(",")}
    },
    next:function(callback){
        this.el.on("tap",'.nextBtn',callback.bind(this));
    },

    events: function () {
        var _this = this;
        this.el.on("tap",'.tagone>li>div',function(){
            if($(this).hasClass("checked")){
                $(this).removeClass("checked");
            }else{
                if(_this.el.find(".checked").length<3){
                    $(this).addClass("checked");
                }
            }
            // var nextone = ;
            // var nextbtn = ;
            // var disbtn = ;
            if(_this.isNext()){
                _this.el.find(".nextone .nextBtn").addClass("disview");
                _this.el.find(".nextone .disBtn").removeClass("disview");
            }else{
                _this.el.find(".nextone .disBtn").addClass("disview");
                _this.el.find(".nextone .nextBtn").removeClass("disview");         
            }
        });
        
    }
});

 module.exports = CardCheck1;
