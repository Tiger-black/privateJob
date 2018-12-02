require('./index.less');
var tpl = require('./index.ejs');
var Event = require('@br/lib/events');
var Url = require('@br/lib/url');

function Index() {
    this.init.apply(this, arguments);
}

$.extend(Index.prototype, Event, {
    init: function (config) {
        this.el = config.el;
    },

    render: function (data) {
        var _html = tpl(data);
        this.el.html(_html);

    },

    append: function (data) {
        var _html = tpl(data);
        this.el.append(_html);

    }


});

module.exports = Index;