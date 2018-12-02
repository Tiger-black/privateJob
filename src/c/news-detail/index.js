
require('@br/lib/zepto.min');
require('./index.less');
var tpl = require('./index.ejs');

function NewsList() {
    this.init.apply(this, arguments);
}

$.extend(NewsList.prototype, {
    init: function (config) {
        this.el = config.el;
        this.data = config.data;
        this.render();
    },
    render: function () {
        var _html = tpl(this.data);
        this.el.html(_html);
    }
});

module.exports = NewsList;








