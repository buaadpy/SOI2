////////////////////////////////////////建立服务器////////////////////////////////////////
var http = require('http');
var io = require('socket.io');
//创建服务器，监听端口。
http = http.createServer(function (request, response) {
}).listen(8000);
//创建webscoket监听服务器
io = io.listen(http);
//加载模型
var Tank = require('./Tank');
var Shell = require('./Shell');

////////////////////////////////////////建立服务器监听////////////////////////////////////////
//在线用户人数
var onlineCount = 0;
//坦克列表
var tankList = [];
//炮弹列表
var shellList = [];
io.on('connection', function (socket) {
    //监听加入
    socket.on('login', function () {
    });

    //监听退出
    socket.on('disconnect', function () {
    });

    //监听用户发布消息
    socket.on('message', function (obj) {
        if (obj.command == 'LOGIN') {
            onlineCount++;
            var camp = onlineCount % 2 == 1 ? 'R' : 'B';
            console.log('新玩家' + obj.data.name + '加入战场 , 阵营为' + camp);
            //向所有客户端广播用户加入
            sendMessage('LOGIN', {clientName: obj.data.name, clientCamp: camp, onlineCount: onlineCount});
        }

        if (obj.command == 'SHOOT') {
            var s = new Shell(obj.data.id, obj.data.position, obj.data.direction, obj.data.target, obj.data.speed, obj.data.damage);
            shellList.push(s);
        }

        if (obj.command == 'UPDATA') {
            var flag = true;
            for (var i = 0; i < tankList.length; i++) {
                if (tankList[i].user == obj.data.user) {
                    tankList[i].position = obj.data.position;
                    tankList[i].rotation_box = obj.data.rotation_box;
                    tankList[i].rotation_gun = obj.data.rotation_gun;
                    flag = false;
                    break;
                }
            }
            if (flag) {
                var t = new Tank(obj.data.user, obj.data.camp, obj.data.position, obj.data.rotation_box, obj.data.rotation_gun, obj.data.protectDamage);
                tankList.push(t);
                console.log('玩家' + obj.data.user + '坦克就绪');
            }
        }
    });
});

////////////////////////////////////////建立服务器逻辑////////////////////////////////////////
//广播消息
var sendMessage = function (com, data) {
    var obj = {
        to: 'All',
        from: 'Server',
        command: com,
        data: data
    };
    io.emit('message', obj);
}
//坦克更新
var updataTank = function () {
    var serverData = [];
    for (var i = 0; i < tankList.length; i++) {
        //坦克入水
        if (tankList[i].position.y <= 3) {
            if (tankList[i].life >= 0) tankList[i].life -= 0.3;
        }
        //判断坦克是否存活
        if (tankList[i].live && tankList[i].life <= 0) {
            tankList[i].live = false;
			console.log('玩家' + tankList[i].user + '坦克被击退');
        }
        //添加发送数据
        serverData[i] = {
            user: tankList[i].user,
            camp: tankList[i].camp,
            position: tankList[i].position,
            rotation_box: tankList[i].rotation_box,
            rotation_gun: tankList[i].rotation_gun,
            live: tankList[i].live,
            life: tankList[i].life
        }
    }
    return serverData;
}
//删除炮弹
var delletShell = function (id) {
    var searchIndex = function (id) {
        for (var i = 0; i < shellList.length; i++) {
            if (shellList[i].id == id) {
                return i;
            }
        }
        return null;
    }

    var index = searchIndex(id);
    if (index == null) return;
    shellList.splice(index, 1);
}
//炮弹更新
var undataShell = function () {
    //计算两点间距离
    var distance = function (a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) +
            (a.y - b.y) * (a.y - b.y) +
            (a.z - b.z) * (a.z - b.z));
    }

    var bombPoint = [];//记录爆炸炮弹id
    for (var i = 0; i < shellList.length; i++) {
        //炮弹飞行
        shellList[i].fly();
        var flag = false;
        //判断是否击中坦克
        for (var j = 0; j < tankList.length; j++) {
            if (distance(shellList[i].position, tankList[j].position) < 6) {
                tankList[j].life -= shellList[i].damage - tankList[j].protectDamage;
                bombPoint.push(shellList[i].position);
                delletShell(shellList[i].id);
                flag = true;
                break;
            }
        }
        if (flag) {
            i--;
            continue;
        }
        //判断是否击中目标点（地面、天空）
        if (distance(shellList[i].position, shellList[i].target) < shellList[i].speed) {
            bombPoint.push(shellList[i].position);
            delletShell(shellList[i].id);
        }
    }
    return bombPoint;
}
//获取赢家
var getWinner = function () {
    if (tankList.length > 1) {
        var rlive = 0;
        var blive = 0;
        for (var i = 0; i < tankList.length; i++) {
            if (tankList[i].camp == 'R' && tankList[i].live) rlive++;
            if (tankList[i].camp == 'B' && tankList[i].live) blive++;
        }
        if (rlive == 0) return '蓝军阵营';
        if (blive == 0) return '红军阵营';
        return null;
    }
}

//服务器逻辑
console.log('**********************服务器逻辑启动**********************');
var number = setInterval(function () {
    var serverData = updataTank();
    if (serverData.length != 0)
        sendMessage('UPDATATANK', serverData);
    var bombPoint = undataShell();
    if (bombPoint.length != 0)
        sendMessage('SHELLBOMB', bombPoint);
    var winner = getWinner();
    if (winner != null) {
        sendMessage('GAMEOVER', winner);
        console.log(winner + '取得胜利');
        console.log('**********************服务器逻辑停止**********************');
        clearInterval(number);
        return;
    }
}, 17);