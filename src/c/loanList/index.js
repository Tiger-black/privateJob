
require('@br/lib/zepto.min');
require('./index.less');
var _ = require('underscore');
var tpl = require('./index.ejs');


function provision() {
    this.init.apply(this, arguments);
}

_.extend(provision.prototype, {
    init: function (config) {
        this.el = config.el;
        this.data = config.data;
        this.render();
    },
    render: function (data) {
        var _html = tpl(this.data);
        this.el.html(_html);
    }
});

module.exports = provision;








