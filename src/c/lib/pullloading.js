require('@br/lib/zepto.min');
var Event = require('@br/lib/events');

var Tpl = ['<div class="J_load_more">',
    '<div class="loading_wrap">',
    '<img class="loading" src="//img.shuqucdn.com/group1/M00/00/06/wKgX2FpoYqKAaLWWAAASlRrvq40844.gif">',
    '<span class="tip">加载中,请稍候...</span>',
    '</div>',
    "<div class='moreCard'>── 更多卡种 敬请期待 ──</div>",
    '<div class="preloader">',
    '<p class="pre-more">上拉加载更多</p>',
    '</div>',
    '</div>'
].join('');


function Loading() {
    this.init.apply(this, arguments);
}

$.extend(Loading.prototype, Event, {
    init: function (config) {
        this.el = config.el;
        this.elClick = config.elClick;
        this.startLoadData = false;
        if (this.el) {
            this.render();
            this.bind();
        }
    },

    resizeHeight: function (data) {
        var self = this;
        var div = data;//外层div
        var ul = data[0].children[0];//ul
        var more = data[0].children[1];
        var ulHeight = $(ul).height();
        $(div).height(ulHeight);
    },

    render: function () {
        this.el.append(Tpl);
        this.loadingObj = this.el.find('.loading_wrap').hide();
        this.preloader = this.el.find('.preloader').hide();
        this.el.find('.moreCard').hide();
    },

    bind: function () {
        var self = this;
        self.preloader.show();
        /* let wScrollY = window.scrollY; // 当前滚动条位置    
        let wInnerH = window.innerHeight; // 设备窗口的高度    
        let bScrollH = document.body.scrollHeight; // 滚动条总高度 */
        var bheight = self.el.height();//获取窗口高度
        var sheight = self.el.scrollTop();//获取滚动条高度
        var stop = $("body").scrollTop();//滚动条距离顶部的距离

        this.el.on('touchstart', function (e) {
            var _touch = e.targetTouches[0];
            self.y_before = _touch.pageY;
        });
        this.el.on('scroll', function (e) {
            // self._isBottom = stop >= sheight - bheight
            self._isBottom = self.el.height() + self.el.scrollTop() - self.preloader.height() - self.el.prev('.creditcard_top').height() > self.el.find('ul').height() - 100;
            if (!self._isBottom) {
                self.onScroll();
            }
            // console.log(self.el.height(), self.el.scrollTop(),self.preloader.height() , self.el.prev('.creditcard_top').height());
        });

        this.el.on('touchend', function (e) {
            var _touch = e.changedTouches[0];
            self.y_after = _touch.pageY;
            // debugger;
            if (!self.startLoadData && self._isBottom && (self.y_before - self.y_after > 50)) {
                console.log('intotouchend')
                self.startLoadData = true;
                self.loading();
                self.trigger('loadData', self.startLoadData);
            }
        })

    },

    onScroll() {
        this.preloader.html('上拉加载更多').show();
        this.loadingObj.hide();
        this.el.find('.moreCard').hide();
    },

    loading() {
        this.loadingObj.show();
        this.preloader.hide();
    },

    loadEnd() {
        this.loadingObj.hide();
        this.preloader.show();
        this.startLoadData = false;
    },


    noMore() {
        var self = this;
        this.preloader.hide();
        this.loadingObj.hide();
        this.el.find('.moreCard').show();
    }
});


module.exports = Loading;