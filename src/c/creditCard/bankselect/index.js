/**
 * 下拉菜单选择器
 * @class Selector
 * @constructor
 * @param {Array} items [{title:'标题',value:'对应值'}]
 * @param {function} callback 回调函数
 * @return {value} 返回选择的内容
 */
require('./index.less');
require('@br/lib/zepto.min');
var Events = require('@br/lib/events');
var Tpl = require('./index.ejs');

function Selector() {
    this.init.apply(this, arguments);
}

$.extend(Selector.prototype, Events, {
    init: function (config) {
        this.el = config.el;
        this.data = config.data;
        this.render();
        this.events();
        let checkname = $('.credit_cardTitle').html();
        this.data.bankList.forEach((item, val) => {
            if (item.name == checkname) {
                $('.J_selectItem').eq(val).addClass('J_selected')
            }
        })
    },

    render: function () {
        var _html = Tpl(this.data);
        this.el.html(_html);
    },


    events: function () {
        var self = this;
        self.trigger('showHide', {});
        $('.J_selector_mask').on('touchmove', function (event) {
            event.stopPropagation();
            event.preventDefault();
        });

        $('.J_selector_mask').on('click', function () {
            self.onconfirm();

        });

        $('.J_selectItem').on('tap', function (event) {
            $(this).addClass('J_selected').siblings().removeClass('J_selected');
            $('.creditcard_top_left').addClass('checkCenter_title');
            self.onconfirm();
            event.stopPropagation();
        });
    },

    onconfirm() {
        var index = $('.J_selected').index();
        var data = {
            option: this.data.bankList[index],
        };
        this.trigger('bankList', data);
        this.close();
    },

    oncancel() {
        this.close();
    },

    close() {
        this.el.height(0);        
        $('.J_selector_mask').hide();
    }

});

module.exports = Selector;

/* DEMO
 var selector = require('@br/common/selector/index');
 new selector([{
 title: '七个工作日以内',
 value: 1
 }, {
 title: '30天（含）以内',
 value: 2
 }, {
 title: '30-60天（含）以内',
 value: 3
 }, {
 title: '60-90天（含）以内',
 value: 4
 }, {
 title: '90天以上',
 value: 5
 }, {
 title: '90天以上asdasdasdasd12点击大四的',
 value: 5
 }], function(data) {
 console.log('您选择的是：' + data);
 });*/