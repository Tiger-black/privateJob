!function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.BrSPM = factory());
}.call(this, window, function () {
    "use strict";
    var isApp = (window.BrBridge && BrBridge.env.isApp) ? true : false;
    var devHosts = ['//127.0.0.1', '//localhost', '//192.168.', '//dym.100credit', '//dym.xiaqiu', '//d1.shuqudata.com', '//d2.shuqudata.com', '//d3.shuqudata.com']; //日常判断列表
    var isDev = getWorkEnv(devHosts);
    var EVENT_TYPE = 'DOMNodeInserted';
    var LocalStorage = window.localStorage;
    var HOST = 'https://orion.shuqudata.com:8443';
    if (isDev) {
        HOST = 'https://dymapi.xiaqiu.cn';
    }
    var API = HOST + '/orion/stat/logging.do';
    var URL_MAX_LENGTH = 1900;

    function BrSPM() {
        this.init.apply(this, arguments);
    }

    BrSPM.prototype = {
        version: '1.0.1',
        init: function () {
            var self = this;
            this.QueryData = this.getQuery();
            this.SPM_ID = this.getSpmByMeta();
            this.PRE_SPM_ID = (this.QueryData && this.QueryData.spm) || '';
            var _isinit = this.isInit();
            if (this.SPM_ID != '') {
                window.addEventListener('DOMContentLoaded', function () {
                    try {
                        _isinit && self.bind();
                    } catch (e) {
                        console.error('SPM:', e);
                    }
                }, false);
            } else {
                console.error('页面无spmid');
            }
        },

        isInit: function () {
            var spmMate = $$('head meta[name="spm-id"]');
            var _is = true;
            if (spmMate.length >= 1) {
                if (spmMate[0].getAttribute('loadsend') == 'no') {
                    _is = false;
                }
            }
            return _is;
        },

        bind: function () {
            var params = this.getConfig();
            var query = getQuery();
            var keys = getMetaAttr('keys');
            keys = keys ? keys.split('&') : [];
            if (keys.length > 0) {
                var json = {};
                keys.forEach(function (key) { 
                    try {
                        json[key] = query[key]; 
                    } catch(e){
                        json[key] = null; 
                    }
                });
                this.RecordEvent('0', json);
            } else {
                this.sendLog(params);
            }
            this.bindEventsByApp();
        },

        RecordEvent: function (eventID, _JSON) {
            var params = this.getParams(eventID, _JSON);
            this.sendLog(params);
        },

        getQuery: function () {
            var data = {};
            var _href = window.location.href;
            if (_href.indexOf('?') != -1) {
                var _Search = window.location.search || '';
                if (_Search == '' && _href.indexOf('#') != -1) {
                    _Search = _href.split('?')[1].split('#')[0];
                }
                if (_Search) {
                    _Search = _Search.indexOf('?') != -1 ? _Search.split('?')[1] : _Search;
                    var arr = _Search.split('&');
                    for (var i = 0; i < arr.length; i++) {
                        var d = arr[i].split('=');
                        data[d[0]] = d[1];
                    }
                }
            }
            if (JSON.stringify(data) != '{}') {
                return data;
            } else {
                return null;
            }
        },

        getSpmByMeta: function () {
            var fg = [];
            var _spm = '';
            var metas = $$('head meta[name="spm-id"]');
            if (metas.length >= 1) {
                _spm = metas[0].getAttribute('content');
                fg = _spm.split('.');
                _spm = fg[0] + '.' + fg[1];
            }
            return _spm;
        },

        //获取展示相关参数
        getConfig: function (eventID) {
            var _eventID = eventID ? eventID : '0';
            var _params = { spm: this.SPM_ID + '.' + _eventID + '.0' };
            if (this.PRE_SPM_ID) {
                _params.prespm = this.PRE_SPM_ID;
            }
            return _params;
        },

        getParams: function (eventID, json) {
            var _json = json ? JSON.stringify(json) : null;
            var _params = {};
            if (eventID) {
                _params.spm = this.SPM_ID + '.' + eventID + '.0';
                if (_json) {
                    _params.data = _json;
                }
            }
            return _params;
        },

        //发送日志
        sendLog: function (params) {
            if (isApp) {
                BrBridge.call('Common', 'recordEvent', {
                    params: params
                }, function (data) {
                    console.log('success');
                }, function (err) {
                    console.log('error');
                });
            } else {
                params.uid = 0;
                this.ajax({
                    type: 'POST',
                    data: params
                });
                /* var paramsSting = toStr(params);
                var _ele = document.createElement('IMG');
                var _src = API + "?" + paramsSting;
                if (_src.length >= URL_MAX_LENGTH) {
                    throw 'SPM:URL excess max length!';
                }
                _ele.src = _src;
                _ele.style.display = 'none';
                $$('body')[0].appendChild(_ele);
                _ele.onload = function () {
                    $$('body')[0].removeChild(_ele);
                };
                _ele.onerror = function () {
                    $$('body')[0].removeChild(_ele);
                }; */
            }
        },

        ajax: function (params) {
            var xmlHttp = new XMLHttpRequest();
            var _type = params.type || 'GET';
            var paramsSting = toStr(params.data);
            if (_type.toLowerCase() == 'post') {
                xmlHttp.open(_type, API, true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttp.send(paramsSting);
            } else {
                xmlHttp.open(_type, API + '?' + paramsSting, true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttp.send();
            }
            //xmlHttp.onreadystatechange = callback; //状态信息发生改变调用函数
        },

        bindEventsByApp: function () {
            var self = this;
            var spms = $$('[data-spm]');
            if (spms.length > 0) {
                for (var i = 0; i < spms.length; i++) {
                    self.setBoxByLink(spms[i]);
                    spms[i].addEventListener(EVENT_TYPE, (function (i) {
                        return function (event) {
                            self.setBoxByLink(spms[i]);
                        }
                    })(i));
                }
            } else {
                $$('body')[0].setAttribute('data-spm', '0');
                this.bindEventsByApp();
            }
        },

        setBoxByLink: function (boxObj) {
            var self = this;
            var _links = boxObj.getElementsByTagName('A');
            if (_links.length <= 0) {
                return
            }
            var spm_cid = boxObj.getAttribute('data-spm');
            if (spm_cid == null) {
                spm_cid = '0';
            }
            for (var i = 0; i < _links.length; i++) {
                self.setHref(_links[i], spm_cid);
            }
        },

        setHref: function (button, spmcid) {
            var self = this;
            var _href = button.getAttribute('href');
            var _openType = button.getAttribute('target') || '_self';
            if (this.checkHref(_href)) {
                _href += (_href.indexOf('?') == -1 ? '?' : '&');
                button.setAttribute('href', _href + 'spm=' + this.SPM_ID + '.' + spmcid + '.0');
                button.addEventListener('click', function (event) {
                    if (!isApp && spmcid != '0') {
                        self.RecordEvent(spmcid);
                        event.stopPropagation();
                        event.preventDefault();
                        window.open(this.href, _openType);
                    }
                }, false);
            }
        },

        checkHref: function (_href) {
            var _Agreements = ['javascript:', 'spm=', 'tel:', 'email:'];
            if (_href) {
                return _Agreements.every(function (item) {
                    return _href.toLowerCase().indexOf(item) == -1;
                });
            }
            return false;
        },

        saveSPM: function () {
            if (this.SPM_ID) {
                LocalStorage.setItem('SPM_ID', this.SPM_ID);
            }
        },

        getSPM: function () {
            return LocalStorage.getItem('SPM_ID');
        }
    };

    function $$(SelectName) {
        return document.querySelectorAll(SelectName);
    }

    function getMetaAttr(name) {
        var spmMate = $$('head meta[name="spm-id"]');
        if (spmMate.length >= 1) {
            return spmMate[0].getAttribute(name);
        } else {
            return null;
        }
    }

    function getQuery() {
        var _url = window.location.href;
        if (_url.indexOf('?') != -1) {
            var qsobj = {};
            var thisqs = _url.split('?')[1];
            if (thisqs) {
                thisqs = thisqs.replace(/#/g, '');
                var pairs = thisqs.split('&');
                for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i].split('=');
                    qsobj[pair[0]] = pair[1];
                }
            }
            return qsobj;
        } else {
            return null;
        }
    }

    function toStr(data) {
        var str = '';
        if (typeof data == 'object') {
            for (var i in data) {
                if (typeof data[i] == 'object') {
                    if (data[i].name) {
                        str += data[i].name + '=' + (data[i].value || '');
                    }
                } else {
                    str += i + '=' + data[i];
                }
                str += '&';
            }
        } else {
            str = data;
        }
        return str.slice(0, str.length - 1);
    }

    function getWorkEnv(hosts) {
        var _isDev = false;
        var $herf = window.location.href;
        hosts.forEach(function (host) {
            if ($herf.indexOf(host) != -1) {
                _isDev = true;
            }
        });
        return _isDev;
    }

    return new BrSPM();
});