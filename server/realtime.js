var http    = require('http'),
    io      = require('socket.io');

//配置
var config = {
    port : 8000
}
//创建服务器，监听端口。
http = http.createServer(handler);
http.listen(config.port);
//创建webscoket监听服务器
io = io.listen(http);

function handler(req, res) {
}
 
//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;
 
io.on('connection', function(socket){
    //监听新用户加入
    socket.on('login', function(obj){
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        socket.name = obj.clientId;
         
        //检查在线列表，如果不在里面就加入
        if(!onlineUsers.hasOwnProperty(obj.clientId)) {
            onlineUsers[obj.clientId] = obj.clientId;
            //在线人数+1
            onlineCount++;
        }
         
        //向所有客户端广播用户加入
        io.emit('login', {clientId:obj.clientId, onlineCount:onlineCount});
    });
     
    //监听用户退出
    socket.on('disconnect', function(){
        //将退出的用户从在线列表中删除
        if(onlineUsers.hasOwnProperty(socket.name)) {
            //退出用户的信息
            //var obj = {userid:socket.name, username:onlineUsers[socket.name]};
             
            //删除
            delete onlineUsers[socket.name];
            //在线人数-1
            onlineCount--;
             
            //向所有客户端广播用户退出
            //io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
        }
    });
     
    //监听用户发布消息
    socket.on('message', function(obj){
        //向所有客户端广播发布消息
        io.emit('message', obj);
    });
});