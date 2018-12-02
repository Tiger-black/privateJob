/*
 * @密码哈希
 * @author dezhao
 * */

var SHA256 = require('@br/lib/sha256');
var MD5 = require('@br/lib/md5');

module.exports = function (password) {
    var pas256 = SHA256(password);
    var md5 = MD5(password).toUpperCase();
    var newPassHash = md5.slice(0, 8) +
        pas256.slice(24, 32) +
        pas256.slice(0, 8) +
        md5.slice(16, 24) +
        md5.slice(8, 16) +
        pas256.slice(8, 16) +
        pas256.slice(16, 24) +
        md5.slice(24, 32);
    newPassHash = SHA256(newPassHash);
    return newPassHash.slice(0, 32);
};