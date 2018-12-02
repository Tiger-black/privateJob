/**
 * @fileOverview
 * @author dezhao
 */

'use strict';
var _ = require('underscore');
var DialogTpl = '<%var itemForEach = (' + itemForEach.toString() + ')%>'+
    '<%obj.forEach(function(item){%>' +
    '<div class="item">' +
    '<%=itemForEach(item)%>' +
    '</div><%})%>';

var cssText = '.J_Console_Dialog{z-index:9999;font-size:12px;margin:auto;position:fixed;top:10%;left:10%;width:80%;background-color:#fff;max-height:400px;box-shadow:0 0 6px 3px rgba(0,0,0,0.1);}' +
    '.J_Console_Dialog .close{float:right;width:20px;height:20px;line-height:20px;background-color:rgba(0,0,0,0.5);color:#fff;text-align:center;border-radius:50%;margin:-5px -5px 0 0;}' +
    '.J_Console_Dialog .content{overflow:auto;max-height:inherit; max-width:inherit;}' +
    '.J_Console_Dialog .item{border-top:1px solid #ccc; padding:5px;}' +
    '.J_Console_Dialog .item > ul li > ul{padding-left:10px;}' +
    '.J_Console_Dialog .item.open > ul li > ul > li{display:none;}' +
    '.J_Console_Dialog .item.open > ul li > ul{height:10px;display:inline-block;padding-left:0;}' +
    '.J_Console_Dialog .item.open > ul li > ul::before{content:"...";}' +
    '.J_Console_Dialog .red{color:red;}' +
    '.J_Console_Dialog .blue{color:blue;}' +
    '.J_Console_Dialog .purple{color:purple;}';

function itemForEach(item) {
    var str = '';
    if (typeof item == 'object') {
        str += '<ul>';
        var d = jsonLength(item);
        var index = 1;
        for (var i in item) {
            if (i !== '__proto__' && i != 'prototype') {
                var isObj = _.isObject(item[i]);
                var isArr = _.isArray(item[i]);
                var b = !isObj && !isArr ? '' : isArr ? '[' : '{';
                var a = !isObj && !isArr ? '' : isArr ? ']' : '}';
                str += '<li><span class="purple">' + i + '</span>:' + (isObj || isArr ? b : '');
                str += itemForEach(item[i]);
                str += (isObj || isArr ? a + (index < d ? ',' : '') : '') + '</li>';
                index++;
            }
        }
        str += '</ul>';
    } else {
        if (typeof item == 'string') {
            str += '<span class="red">\'' + item + '\'</span>';
        } else {
            str += '<span class="blue">' + item + '</span>';
        }
    }
    return str;

    function jsonLength(json) {
        var l = 0;
        for (var key in json) {
            l++
        }
        return l;
    }
}

var isDebug = 0;
var _url = window.location.href;
if (_url.indexOf('dev=1') != -1 || _url.indexOf('debug=1') != -1) {
    isDebug = !0;
}


function Console() {
    this.init.apply(this, arguments);
}

_.extend(Console.prototype, {
    init: function () {
        this.el = $('<div class="J_Console_Dialog"><div class="close">X</div><div class="content"></div></div>');
        $('body').append(this.el);
        var _style = document.createElement('style');
        _style.innerHTML = cssText;
        document.querySelector('head').appendChild(_style);
        this.__events();
        this.el.hide();
    },

    log: function () {
        var args = this.__sliceArray(arguments);
        this.render(args);
    },
    error: function () {
        var args = this.__sliceArray(arguments);
        this.render(args);
    },

    render: function (data) {
        var dom = _.template(DialogTpl)(data);
        this.el.show().find('.content').append(dom);
    },

    clear: function(){
        this.el.find('.content').html('');
    },

    __events: function () {
        var self = this;
        this.el.on('tap', '.item', function (e) {
            $(this).toggleClass('open');
        });

        this.el.on('tap', '.close', function (e) {
            self.el.hide();
            //self.el.html('<div class="close">X</div>');
        });
    },

    __sliceArray: function (nodes) {
        return Array.prototype.slice.call(nodes);
    }
});

if (isDebug) {
    window.console = new Console();
}
