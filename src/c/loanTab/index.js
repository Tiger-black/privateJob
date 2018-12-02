
require('@br/lib/zepto.min');
require('./index.less');
var _ = require('underscore');
var tpl = require('./index.ejs');


function provision() {
    this.init.apply(this, arguments);
}

_.extend(provision.prototype, {
    init: function (config,callback) {
        this.el = config.el;
        this.data = config.data;
        this.callback = callback;
        this.render();
    },
    render: function () {
        var _html = tpl(this.data);
        this.el.append(_html);
        var selected_data = $('.selected').attr('data-type');
        this.callback(selected_data);
        this.event();
    },
    event:function(){
        var self = this;
        $('.loanTab').on('tap','li',function(){
            var selected_data= $(this).attr('data-type');
            $('.loanTab li').removeClass('selected');
            $(this).addClass('selected');
            self.callback(selected_data);
        })
    }
});

module.exports = provision;








