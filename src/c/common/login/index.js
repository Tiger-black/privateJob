/**
 * @登录组件
 * @author dezhao
 */

var _ = require('underscore');
var API = require('@br/common/api');
var Toast = require('@br/common/toast/index');
var PasswordHash = require('@br/lib/passwordHash');

function Login() {
    this.init.apply(this, arguments);
}

_.extend(Login.prototype, {
    init: function (config) {
        this.userData = {
            appId: '4',
            deviceId: 'mmmmm',
            unioId: '',
            password: '',
            osType: '2' //0-ios,1-android,2-web
        };
        _.extend(this.userData, config);
    },

    asyn: function (unioId, password, next) {
        this.userData.unioId = unioId;
        this.userData.password = PasswordHash(password);
        API.call({
            url: API.login,
            data: this.userData
        }, function (res) {
            if (res.code == 0) {
                typeof next == 'function' && next.call(next, res);
            } else {
                new Toast(res.message, 3000);
            }
        }, function (error) {
            console.log(error);
        })
    }
});

module.exports = Login;