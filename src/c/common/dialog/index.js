/*
 * 对话框 组件
 * author dezhao.chen
 * */

"use strict";
require('./index.less');
require('@br/lib/zepto.min');
var _ = require('underscore');
var Event = require('@br/lib/events');
var Tpl = require('./index.ejs');

var CONFIG = {
    className: '', //样式
    iconfont: '&#xe608;',
    title: '', //
    contentData: {text: '提示框内容'},
    content: '<%=text%>',
    //dialog_input:'',
    //dialog_button:'',
    confirm: '', //确认按钮
    cancel: '', //取消按钮
    url: '',
    display: false,
    onconfirm: function () {
    },
    oncancel: function () {
    }
};

function Dialog() {
    this.init.apply(this, arguments);
}

_.extend(Dialog.prototype, Event, {
    init: function (config) {
        this.config = {};
        _.extend(this.config, CONFIG);
        _.extend(this.config, config);
        this.config.el = $('<div class="J_Dialog ' + this.config.className + '"></div>'); //阴影
        this.config.mask = $('<div class="J_Dialog-mask"></div>'); //阴影
        this.bind();
    },

    bind: function () {
        this.render();
        this.events();
    },

    render: function () {
        this.config.content = _.template(this.config.content)(this.config.contentData || this.config);
        var _html = Tpl(this.config);
        this.config.el.html(_html);
        if (this.config.className != '') {
            this.config.el.addClass(this.config.className);
        }
        $('body').append(this.config.el).append(this.config.mask);
        if (this.config.display) {
            this.show();
        } else {
            this.hide();
        }
    },

    events: function () {
        var self = this;

        this.config.el.on('tap', '.confirm', function (event) {
            if (self.config.onconfirm.call(self.config.onconfirm, event) != false) {
                self.close();
            }
        });
        this.config.el.on('tap', '.cancel', function (event) {
            if (self.config.oncancel.call(self.config.oncancel, event) != false) {
                self.close();
            }
        });

        //this.config.el.on('tap', '.confirm', _.bind(this.close, this));
        //this.config.el.on('tap', '.cancel', _.bind(this.close, this));

        this.config.mask.on('touchmove', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
    },

    //需要重置属性
    reset: function () {
        _.extend(this.config, CONFIG);
    },

    set: function (config) {
        _.extend(this.config, config);
        this.render();
    },

    show: function (config) {
        if (config && typeof config == 'object') {
            this.set(config);
            this.show();
        }
        this.config.el.show().css({opacity: 1});
        this.config.mask.show().css({opacity: 1});
        this.resetPosition();
    },

    hide: function () {
        this.config.el.hide();
        this.config.mask.hide();
    },

    close: function () {
        var self = this;
        //this.config.el.animate({opacity: 0}, 400, 'ease-out', function () {
        self.config.el.remove();
        self.config.mask.remove();
        //});
        /*this.config.mask.animate({opacity: 0}, 400, 'ease-out', function () {
         });*/
        this.reset();
    },

    resetPosition: function () {
        var winHeight = $(window).height();
        var winWidth = $(window).width();
        this.height = this.config.el.height();
        this.width = this.config.el.width();
        this.top = (winHeight * 0.5) - (this.height * 0.5);
        this.left = (winWidth * 0.5) - (this.width * 0.5);
        this.config.el.css({
            top: this.top,
            left: this.left,
            margin: 0
        });
    }
});

module.exports = Dialog;
