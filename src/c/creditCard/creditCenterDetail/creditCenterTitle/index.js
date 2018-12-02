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
        this.event();
        this.render();
    },

    render: function () {
        //console.log(data);
        var _html = tpl(this.data);
        this.el.fadeIn();
        this.el.html(_html);

    },

    event: function () {
        var self = this;
        this.el.on('click', '.center_title', function () {
            self.index = $(this).attr('data-index');
            $(this).addClass('check_title').siblings().removeClass('check_title');
            self.trigger('tabIndex', self.index);
        });
    }

});

module.exports = Index;