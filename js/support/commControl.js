/**
 * Created by 杜鹏宇 on 2015/7/23
 * Modified by
 */

//通信支持
CommControl = function () {
    this.socket = null;//通信实体
    this.game = null;//连接游戏
}

//建立与服务器的通信
CommControl.prototype.run = function (call) {
    var g = this.game;
    //连接websocket后端服务器
    try {
        this.socket = io.connect(server);//server是服务器地址，如http://172.22.227.46:8000
    }
    catch (e) {
        alert('管理员打扫战场中，请等待战场开启');
        window.location.href = 'ready.html';
    }

    //监听新用户登录
    this.socket.on('login', function (o) {
            if (g.isHost) {
                if (g.userCamp == null) {
                    g.userCamp = 'N';
                    call();
                } else
                    console.log('玩家' + o.clientId + '加入战场');
            } else {
                if (o.onlineCount <= 1) {
                    alert('管理员打扫战场中，请等待战场开启');
                    window.location.href = 'ready.html';
                }
                //检测到自己登陆成功
                if (g.userCamp == null) {
                    if (o.onlineCount % 2 == 0) {
                        g.userCamp = 'R';
                    } else {
                        g.userCamp = 'B';
                    }
                    call();
                } else {
                    //提示玩家登陆
                    if (o.onlineCount % 2 == 0) {
                        o.camp = 'R';
                    } else {
                        o.camp = 'B';
                    }
                    if (o.camp == g.userCamp) {
                        g.infoControl.friendJoin();
                    } else {
                        g.infoControl.enemyJoin();
                    }
                }
            }
        }
    );

    //告诉服务器端有用户登录
    this.socket.emit('login', {clientId: g.userName, camp: g.userCamp});

    //监听用户退出
    this.socket.on('logout', function (o) {
        console.log('玩家' + o.clientId + '离开战场');
    });

    //监听消息
    this.socket.on('message', function (obj) {
        //游戏结束指令
        if (obj.command == 'gameOver') {
            g.gameover(obj.data);
        }
        //炮弹爆炸指令
        if (obj.command == 'shellBomb') {
            for (var i = 0; i < obj.data.length; i++) {
                try {
                    var position = g.shellControl.shellList[g.shellControl.searchIndex(obj.data[i])].position;
                    g.particleControl.bomb(position);
                    g.shellControl.delete(obj.data[i]);
                    g.soundControl.bombSound(position);
                } catch (e) {
                }
            }
        }
        if (!g.isHost && obj.from == 'Server') {
            //客户端更新坦克与炮弹数据
            if (obj.command == 'updateTank') {
                g.tankControl.clientUpdate(obj.data, g.infoControl);
            }
            if (obj.command == 'updateShell') {
                g.shellControl.clientUpdate(obj.data);
            }
        }
        if (g.isHost && obj.to == 'Server') {
            //新建坦克指令
            if (obj.command == 'newTank') {
                var md = obj.data;
                g.tankControl.addTank(md.user, md.camp, md.position, md.type);
                console.log('服务器为新玩家' + md.user + '创建坦克');
            }
            //更新单一坦克指令
            if (obj.command == 'sendTankInfo') {
                g.tankControl.updateTankInfo(obj.from, obj.data);
            }
            //开炮指令
            if (obj.command == 'newShell') {
                var md = obj.data;
                g.shellControl.addShell(md);
            }
        }
    });
}
//发送消息
CommControl.prototype.send = function (to, from, com, data) {
    var obj = {
        to: to,
        from: from,
        command: com,
        data: data
    };
    this.socket.emit('message', obj);
}