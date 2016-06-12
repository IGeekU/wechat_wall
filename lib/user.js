/**
 * Created by zcwup on 2016/6/1.
 * 该模块用来获得用户基本信息
 */

var appID = require('./config').appID;
var appSecret = require('./config').appSecret;

var getToken = require('./token').getToken;

var request = require('request');

function getUserInfo(code){
    return getToken(appID, appSecret,code).then(function(res){
        var token = res.access_token;
        var openid=res.openid;
        return new Promise(function(resolve, reject){
            request('https://api.weixin.qq.com/sns/userinfo?access_token='+token+'&openid='+openid+'&lang=zh_CN', function(err, res, data){
                resolve(JSON.parse(data));
            });
        });
    }).catch(function(err){
        console.log(err);
    });
}

module.exports = {
    getUserInfo: getUserInfo
};
