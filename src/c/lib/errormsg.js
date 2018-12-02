/**
 * @author dezhao
 * 错误码描述
 */

require('@br/lib/zepto.min');
var CODES = {
    11003: '内部错误',
    11004: '参数错误',
    11721: '账号或密码错误',
    11724: '验证码发送失败',
    11730: '该手机号码已被注册',
    11726: '验证码输入有误',
    11711: '账号或密码为空',
    11712: '已达测试人数',
    11722: '服务器内部错误'
};

var FilterList = ['11003', '11004', '11712', '11722', '11742', '11744', '11758', '11759'];

module.exports = function (code) {
    CODES[code] && console.error(CODES[code]);
    if (CODES[code] && $.inArray(code, FilterList) == -1) {
        return CODES[code]
    } else {
        return '未知错误,程序员在努力修复中.';
    }
};


