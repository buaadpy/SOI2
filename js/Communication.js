//通信支持
var Communication = function () {
    this.socket = null;//通信实体
    this.game = null;//连接游戏
}

//建立与服务器的通信
Communication.prototype.run = function (gameStart) {
    var g = this.game;
    //连接服务器
    try {
        this.socket = io.connect(server);//server是服务器地址，如http://172.22.227.46:8000
        this.send('LOGIN', {name: g.userName});
    }
    catch (e) {
        alert('无法与战场取得连接');
        window.location.href = 'ready.html?' + g.userName;
    }

    //监听新用户登录
    this.socket.on('login', function (o) {
    });

    //监听退出
    this.socket.on('logout', function (o) {
    });

    //监听消息
    this.socket.on('message', function (obj) {
        //玩家加入
        if (obj.command == 'LOGIN') {
            if (obj.data.clientName == g.userName) {
                g.userCamp = obj.data.clientCamp;
                gameStart();
            } else {
                obj.camp == g.userCamp ? g.information.friendJoin() : g.information.enemyJoin();
            }
        }
        //游戏结束
        if (obj.command == 'GAMEOVER') {
            g.gameover(obj.data);
        }
        //炮弹爆炸
        if (obj.command == 'SHELLBOMB') {
            for (var i = 0; i < obj.data.length; i++) {
                try {
                    g.particle.bomb(obj.data[i]);
                    g.sound.bombSound(obj.data[i]);
                } catch (e) {
                }
            }
        }
        //更新坦克
        if (obj.command == 'UPDATATANK') {
            g.tankManage.clientUpdate(obj.data, g.information);
        }
    });
}
//发送消息
Communication.prototype.send = function (com, data) {
    var obj = {
        to: 'Server',
        from: this.game.userName,
        command: com,
        data: data
    };
    this.socket.emit('message', obj);
}