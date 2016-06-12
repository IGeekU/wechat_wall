/**
 * Created by zcwup on 2016/6/1
 * 该模块用来获得有效token.
 */
var request = require('request');
var fs = require('fs');
//获取用户的openid
function getToken(appID, appSecret,code){
    return new Promise(function(resolve, reject){
        var token;
        //先看是否有token缓存，这里选择用文件缓存，可以用其他的持久存储作为缓存
        if(fs.existsSync('./tokens/'+code+'.dat')){
            token = JSON.parse(fs.readFileSync('./tokens/'+code+'.dat'));
        }
        var url='https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appID+'&secret='+appSecret+'&code='+code+'&grant_type=authorization_code';
        console.log(url);
        //如果没有缓存或者过期
        if(!token || token.timeout < Date.now()){
            request(url, function(err, res, data){
                var result = JSON.parse(data);
                console.log(result);
                result.timeout = Date.now() + 7000000;
                //更新token并缓存
                //因为access_token的有效期是7200秒，每天可以取2000次
                //所以差不多缓存7000秒左右肯定是够了
                fs.writeFileSync('./tokens/'+code+'.dat', JSON.stringify(result));
                resolve(result);
            });
        }else{
            resolve(token);
        }

    });
}

module.exports = {getToken: getToken};
