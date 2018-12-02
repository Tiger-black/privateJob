/**
 * @fileOverview
 * @author dezhao
 */

require('./index.less');
require('zepto');

function Loading() {
    this.init.apply(this, arguments);
}

$.extend(Loading.prototype, {
    init: function () {
        if (this.el) {
            this.show();
        } else {
            this.el = $('<div class="J_Loading load-container"><div class="loader">Loading...</div></div>');
            $('body').append(this.el);
        }
    },

    show: function () {
        this.el.show();
    },

    hide: function () {
        this.el.hide();
    }

});

module.exports = Loading;