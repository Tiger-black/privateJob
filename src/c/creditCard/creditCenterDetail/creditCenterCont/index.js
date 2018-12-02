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
        this.data = config.data;
        this.render();
    },

    render: function () {
        //console.log(data);
        var _html = tpl(this.data);
        this.el.html(_html);

    }

});

module.exports = Index;