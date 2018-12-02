require('./index.less');
var tpl = require('./index.ejs');
var Events = require('@br/lib/events');
function Index() {
    this.init.apply(this, arguments);
}

$.extend(Index.prototype, Events,{
    init: function (config) {
        this.el = config.el;
        this.data = config.data;
        this.render();
        
    },

    render: function () {
        var _html = tpl(this.data);
        this.el.html(_html);
    },
   
    upDate:function(data){
        this.data = data;
        this.render();
    }
});

module.exports = Index;