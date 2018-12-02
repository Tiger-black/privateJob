/**
 * 微信选择器
 * @class Selector
 * @constructor
 * @param {Array} items [{title:'标题',value:'对应值'}]
 * @param {function} callback 回调函数
 * @return {value} 返回选择的内容
 */
require('./index.less');
require('@br/lib/zepto.min');
var Event = require('@br/lib/events');
var Tpl = require('./index.ejs');
var city_tpl = require('./city_item.ejs');
var Toast = require('@br/common/toast/');
var API = require('@br/common/api');


var LISTREGION = API.URL + 'my/listRegionOfCreditCardApply.do';


var city_data = [ {
    "id" : 340000,
    "areaName" : "安徽省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 820000,
    "areaName" : "澳门特别行政区",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 110000,
    "areaName" : "北京",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 350000,
    "areaName" : "福建省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 620000,
    "areaName" : "甘肃省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 440000,
    "areaName" : "广东省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 450000,
    "areaName" : "广西壮族自治区",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 520000,
    "areaName" : "贵州省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 460000,
    "areaName" : "海南省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 130000,
    "areaName" : "河北省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 230000,
    "areaName" : "黑龙江省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 410000,
    "areaName" : "河南省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 420000,
    "areaName" : "湖北省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 430000,
    "areaName" : "湖南省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 320000,
    "areaName" : "江苏省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 360000,
    "areaName" : "江西省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 220000,
    "areaName" : "吉林省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 210000,
    "areaName" : "辽宁省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 150000,
    "areaName" : "内蒙古自治区",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 640000,
    "areaName" : "宁夏回族自治区",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 630000,
    "areaName" : "青海省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 370000,
    "areaName" : "山东省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 310000,
    "areaName" : "上海",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 610000,
    "areaName" : "陕西省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 140000,
    "areaName" : "山西省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 510000,
    "areaName" : "四川省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 710000,
    "areaName" : "台湾",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 120000,
    "areaName" : "天津",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 810000,
    "areaName" : "香港特别行政区",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 650000,
    "areaName" : "新疆维吾尔自治区",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 540000,
    "areaName" : "西藏自治区",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 530000,
    "areaName" : "云南省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 330000,
    "areaName" : "浙江省",
    "setAreaName" : true,
    "setId" : true
  }, {
    "id" : 500000,
    "areaName" : "重庆",
    "setAreaName" : true,
    "setId" : true
  } ]

function Selector() {
    this.init.apply(this, arguments);
}

$.extend(Selector.prototype, Event, {
    init: function () {
        var self = this;
        this.selectData = {};
        this.getCityData(0,function(data){
            self.renderProvince(data.regions);
        });  
        // this.renderProvince(city_data)  
    },

    renderProvince: function (data) {
        this.el = $(Tpl(data));
        $('body').append(this.el);
        this.event();
    },
    renderCity: function (data) {
        var _html = city_tpl(data);
        $('.city').html(_html);
    },
    renderArea: function (data) {
        var _html = city_tpl(data);
        $('.area').html(_html);
    },

    event: function () {
        var self = this;
        $('.J_selector_mask').on('touchmove',function(e){
            e.preventDefault();
        })
        $('.J_selector_mask').on('click',function () {
            self.trigger('maskClick');
            self.close();
        });

        $('.cityselector_title').on('click', "p", function () {
            var index = $(this).index();
            if(!$(this).hasClass('disable')){
                $('#selector_list').removeClass().addClass('eq'+index);
            }
        });

        $('.province').on('click','li',function () {//点击省
            self.selectData.provinceId = $(this).attr('data-id');
            self.selectData.province = $(this).attr('data-name');
            self.getCityData(self.selectData.provinceId,function(data){
                $('.provinceTit').html(self.selectData.province);
                $('.cityTit').html('城市');
                $('.cityTit').removeClass('disable');
                $('.areaTit').addClass('disable');
                self.renderCity(data.regions);
                $('#selector_list').removeClass().addClass('eq1');
            });    
        });

        $('.city').on('click','li',function () {//点击市
            self.selectData.cityId = $(this).attr('data-id');
            self.selectData.city = $(this).attr('data-name');
            self.getCityData(self.selectData.cityId,function(data){
                if(data.code == 41047){//无下级地区
                    self.selectData.areaId = '';
                    self.selectData.area = '';
                    self.trigger('selectEnd',self.selectData);
                    $('#selector_list').removeClass().addClass('eq0');
                    self.close();
                }else{
                    $('.cityTit').html(self.selectData.city);
                    $('.areaTit').removeClass('disable');
                    self.renderArea(data.regions);
                    $('#selector_list').removeClass().addClass('eq2');
                }
            });    
        });

        $('.area').on('click','li',function () {//点击区
            self.selectData.areaId = $(this).attr('data-id');
            self.selectData.area = $(this).attr('data-name');
            self.trigger('selectEnd',self.selectData);
            $('#selector_list').removeClass().addClass('eq0');
            self.close();
        });
    },

    getCityData: function (parentId,callback) {
        var self = this;
        $('.loading').show();
        API.call({
            url: LISTREGION,
            data: {
                parentId: parentId
            },
            dataType:'json',
            type:'POST'
        }, function (data) {
            $('.loading').hide();
            if (data.code == 0 || data.code == 41047) {
                callback(data)
            } else {
                self.showError(data.message);
            }
        }, function (e) {
            $('.loading').hide();
            self.showError(e.message);
            console.error(e);
        });
    },

    close: function () {
       $('.selectorContener').hide();
       $('.J_selector_mask').hide();
    },

    show: function () {
       $('.selectorContener').show();
       $('.J_selector_mask').show().css('opacity','0.3');
    },

    showError: function (e) {
        e && new Toast(e,2000);
    }
});

module.exports = Selector;
