/**
 * @fileOverview
 * @author dezhao
 */
//user.shuqudata.com:8443/spore/userCenter/sendMsg.do

"use strict";
var protocol = window.location.protocol;

var URL = 'https://hermes.xiaqiu.cn:8443/hermes/';//hermes线上
var useCenterURL = 'https://user.shuqudata.com:8443/';//用户中心线上
var orionURL = 'https://orion.shuqudata.com:8443/orion/'; //线上地址,默认
// fenxiaoapi.shuqucdn.com / distribution / h5 / 
var creditCardURL = 'https://fenxiaoapi.shuqucdn.com/distribution/h5/'; //信用卡线上

// var bankCardURL = 'https://fenxiaoapi.shuqucdn.com/distribution/h5/'; //信用卡分销
// var bankTJUrl = 'https://dymapi.xiaqiu.cn/distribution/h5/';//信用卡推荐联调接口

var devHosts = ['//127.0.0.1', '//localhost', '//192.168.'];//开发
var dailyHosts = ['//dym.', '//d1.shuqudata.com', '//d2.shuqudata.com', '//d3.shuqudata.com']; //日常判断列表
var prepHosts = ['//pre.100credit.com', '//pre.xiaqiu.cn/'];//预发

var isDev = getWorkEnv(devHosts);
var isPrep = getWorkEnv(prepHosts);
var isDaily = getWorkEnv(dailyHosts);

if (isDev) {
    // https://dymapi.xiaqiu.cn/distribution/h5/creditCard/getSingleCard.do?skuSeed=e6292a1ab6c2b811b4fd71ea3f67efbd
    // URL = protocol + '//192.168.180.10:8040/hermes/';//hermes日常
    URL = protocol + '//dymapi.xiaqiu.cn/hermes/';//日常
    // URL = protocol + '//192.168.2.206:8080/hermes/';//红旺本机
    useCenterURL = protocol + '//192.168.180.10:8082/';//日常用户中心
    orionURL = protocol + '//192.168.180.10:8083/orion/';//日常常用  
    // creditCardURL = protocol + '//192.168.0.28:8080/distribution/'  //振乐本机
    // creditCardURL = protocol +'//dymapi.xiaqiu.cn/distribution/h5/' //信用卡日常
    creditCardURL = 'https://dymapi.xiaqiu.cn/distribution/h5/' //信用卡日常https://发线上要改
} else if (isDaily) {
    URL = protocol + '//dymapi.xiaqiu.cn/hermes/';//hermes日常
    useCenterURL = protocol + '//dymapi.xiaqiu.cn/';//日常用户中心
    orionURL = protocol + '//dymapi.xiaqiu.cn/orion/';//日常常用  
    // orionURL = protocol + '//192.168.180.10:8083/orion/';//日常常用  
    creditCardURL = 'https://dymapi.xiaqiu.cn/distribution/h5/' //信用卡日常

} else if (isPrep) {
    URL = 'https://hermes.xiaqiu.cn/hermes/';
    useCenterURL = 'https://user.shuqudata.com:8443/';
   // orionURL =  'https://192.168.23.185/orion/'; 
   orionURL = 'https://orion.shuqudata.com:8443/orion/'; //线上地址,默认
   creditCardURL = 'https://fenxiaoapi.shuqucdn.com/distribution/h5/'; //信用卡线上
}

// 接口预发测试参数 (isPrep ? '?prepub_front=43623425735346' : '')

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


module.exports = {
    URL: URL,
    creditCardURL: creditCardURL,


    /*
     * 获取贷款导航产品类型
     * */
    category: URL + 'navigate/category.do',

    /*
     * 获取贷款导航产品列表
     * */
    productList: URL + 'navigate/productList.do',

    /*
     * 保存大额贷款申请
     * */

    loanApplication: URL + 'greatloan/loanApplication.do',

    /*
     * 获取验证码
     * */
    sendCode: useCenterURL + 'spore/userCenter/sendMsg.do',

    /*
     * 用户注册
     * */
    register: useCenterURL + 'spore/userCenter/register.do',
    /*
     * 正芒用户注册
     * */
    registerMango: useCenterURL + 'spore/userCenter/registerMango.do',
    /*
     * 用户登录
     * */
    login: useCenterURL + 'spore/userCenter/login.do',

    /*
     * 获取图片验证码
     * */
    picVerify: orionURL + 'verify/picVerify.do',

    /*
     * 提交图片验证码
     * */
    picVerifyCheck: orionURL + 'verify/picVerifyCheck.do',



    call: function (config, callback, errorfn) {
        var params = config.data ? config.data : {};
        var type = config.type ? config.type : 'get';
        var dataType = config.dataType ? config.dataType : 'jsonp';
        //console.log(type+':'+dataType)
        if (window.BrBridge && window.BrBridge.env.isApp) {
            BrBridge.call('System', 'brIo', {
                url: config.url,
                params: params,
                showLoading: (config.showLoading ? true : false),
                type: 'post'
            }, callback, errorfn);
        } else {
            $.ajax({
                url: config.url,
                data: params,
                type: type,
                dataType: type == 'get' ? 'jsonp' : 'json',
                success: callback,
                error: errorfn
            });
        }
    }
};
