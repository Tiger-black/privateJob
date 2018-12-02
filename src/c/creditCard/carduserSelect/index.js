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
    },

    events: function () {
        var self = this;

        $('.J_selector_mask').on('touchmove', function (event) {
            event.stopPropagation();
            event.preventDefault();
        });

        $('.J_selector_mask').on('click', function () {
            self.close();
        });

        $('.J_selectItem').on('tap', function (event) {
            self.index = $(this).index();
            if ($(this).hasClass('J_selected')) {
                $(this).removeClass('J_selected');
                self.data.typeList[self.index].isCheck = false;
                if (self.el.find('.J_selected').length === 0) {
                    $('.creditcard_top_right').removeClass('checkCenter_title');
                    self.el.find('.resetcancle').removeClass('reset');                                    
                }
            } else {
                $(this).addClass('J_selected');
                self.data.typeList[self.index].isCheck = true;                
                self.el.find('.resetcancle').addClass('reset');
                $('.creditcard_top_right').addClass('checkCenter_title');
            }
            event.stopPropagation();
        });


        self.el.find('.select-menu-warpper').on('click', '.reset', function (event) {
            /* 清空选中内容 */
            $('.J_selectItem').removeClass('J_selected');
            self.data.typeList.forEach(function (item, val) {
                item.isCheck = false;
            })
            $(this).removeClass('reset');
            $('.creditcard_top_right').removeClass('checkCenter_title');
            event.stopPropagation();
        });

        self.el.find('.select-menu-warpper').on('click', '.sureconfirm', function (event) {
            self.data.typeList.forEach((item, i) => {
                if (item.isCheck) {
                    item.isSelect = true;
                } else {
                    item.isSelect = false;
                }
            })
            self.onconfirm();
            $('.creditcard_top_right').removeClass('right_check'); 
            $('.point-items').css('opacity', 1);                                                         
            event.stopPropagation();
        });
    },


    render: function () {
        var _html = Tpl(this.data);
        this.el.html(_html);
        this.data.typeList.forEach(function (item, val) {
            if (item.isSelect == true) {
                $('.J_cancleSelect').addClass('resetcancle');
                $('.J_confirmSelect').addClass('sureconfirm');
            }
        })
    },


    onconfirm: function () {
        var self = this;
        var _data = {
            option: self.data,
        };
        self.trigger('typeList', _data);
        this.close();
    },

    oncancel: function () {
        this.close();
    },

    close() {
        this.el.height(0);
        $('.J_selectorCard').hide();
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