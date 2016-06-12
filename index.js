/**
 * Created by zcwup on 2016/6/1.
 */
//引入依赖库和模块
var express=require('express');
var url=require('url');
var app=express();
var bodyParser=require('body-parser');
var http=require('http');
var request=require('request');
var qs=require('querystring');
var fs=require('fs');
var getUserInfo = require('./lib/user').getUserInfo;

var server = http.createServer(function(req, res){
    // 解析code
    var path = url.parse(req.url).pathname;
	var code=url.parse(req.url,true).query.code;
	console.log(code); 
    switch (path){
    case '/':
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<meta property="qc:admins" content="0170367227633672556470" />   <h1>Hello! Welcome to the<a href="/client/index.html">Wechat Wall</a></h1>');
        res.end();
        break;
    case '/client/index.html':
	
        fs.readFile(__dirname + path, function(err, data){
        if (err) return sendStatus(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
        getUserInfo(code).then(function(userinfo){
	var headimg=userinfo.headimgurl;
	var nickname=userinfo.nickname;
	var sex=userinfo.sex;
        res.write('<head><meta charset="utf-8"/></head>');
	    res.write('<div class="text-center"><div class=" btn btn-info btn-lg"><h1 class="glyphicon glyphicon-headphones">Wechat Wall</h1></div>');
        res.write('<h3 class="white"><button type="button" class="btn btn-primary btn-lg" style="text-shadow: black 5px 3px 3px;"><span class="glyphicon glyphicon-user"></span>User</button><a id="username" href="#">'+nickname+'</a>您好！<img height="60px",width="60px"src="'+headimg+'">欢迎进入微信墙<a style="visibility:hidden" id="headurl">'+headimg+'<a></h3></div>');
	    res.write(data, 'utf8');
        res.end();
          });
        });
        break;
    default: sendStatus(res);
    }
});
 
var sendStatus = function(res){
    res.writeHead(404);
    res.write('404');
    res.end();
};
 
server.listen(4000,function(){
    console.log('Wechat Wall running at http://123.206.60.87:4000');
});

var io=require('socket.io').listen(server);
//初始化信息
var messages=[];
messages.push('欢迎进入微信墙');
io.sockets.on('connection',function(socket){
	socket.emit('connected');
	console.log('客户端用户已连接！');
	//广播新用户连接
	socket.broadcast.emit('newClient',new Date());
	//获取总信息
	socket.on('getAllMessages',function(){
	socket.emit('allMessages',messages);
});	
	//断开连接
	socket.on('disconnect',function(){
	console.log('有用户断开连接!');
});
	//发送新消息 on 是接收 emit是发送 握手信号
	socket.on('addMessage',function(message){
	messages.unshift(message);
	io.sockets.emit('newMessage',message);
});

});
