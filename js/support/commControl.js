/**
 * Created by 杜鹏宇 on 2015/7/23
 * Modified by
 */

//通信支持
CommControl = function () {
    this.socket = null;//通信实体
}

//建立与服务器的通信
CommControl.prototype.run = function (call) {
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
            if (game.isHost) {
                if (game.userCamp == null) {
                    game.userCamp = 'N';
                    call();
                } else
                    console.log('玩家' + o.clientId + '加入战场');
            } else {
                if (o.onlineCount <= 1) {
                    alert('管理员打扫战场中，请等待战场开启');
                    window.location.href = 'ready.html';
                }
                //检测到自己登陆成功
                if (game.userCamp == null) {
                    if (o.onlineCount % 2 == 0) {
                        game.userCamp = 'R';
                    } else {
                        game.userCamp = 'B';
                    }
                    call();
                } else {
                    //提示玩家登陆
                    if (o.onlineCount % 2 == 0) {
                        o.camp = 'R';
                    } else {
                        o.camp = 'B';
                    }
                    if (o.camp == game.userCamp) {
                        game.infoControl.friendJoin();
                    } else {
                        game.infoControl.enemyJoin();
                    }
                }
            }
        }
    );

    //告诉服务器端有用户登录
    this.socket.emit('login', {clientId: game.userName, camp: game.userCamp});

    //监听用户退出
    this.socket.on('logout', function (o) {
        console.log('玩家' + o.clientId + '离开战场');
    });

    //监听消息
    this.socket.on('message', function (obj) {
        //游戏结束指令
        if (obj.command == 'gameOver') {
            game.gameover(obj.data);
        }
        //炮弹爆炸指令
        if (obj.command == 'shellBomb') {
            for (var i = 0; i < obj.data.length; i++) {
                try {
                    var position = game.shellControl.shellList[game.shellControl.searchIndex(obj.data[i])].position;
                    game.particleControl.bomb(position);
                    game.shellControl.delete(obj.data[i]);
                    game.soundControl.bombSound(position, game.tankControl.myTank.position);
                } catch (e) {
                }
            }
        }
        if (!game.isHost && obj.from == 'Server') {
            //客户端更新坦克与炮弹数据
            if (obj.command == 'updateTank') {
                game.tankControl.clientUpdate(obj.data, game.infoControl);
            }
            if (obj.command == 'updateShell') {
                game.shellControl.clientUpdate(obj.data);
            }
        }
        if (game.isHost && obj.to == 'Server') {
            //新建坦克指令
            if (obj.command == 'newTank') {
                var md = obj.data;
                game.tankControl.addTank(md.user, md.camp, md.position, md.type);
                console.log('服务器为新玩家' + md.user + '创建坦克');
            }
            //更新单一坦克指令
            if (obj.command == 'sendTankInfo') {
                game.tankControl.updateTankInfo(obj.from, obj.data);
            }
            //开炮指令
            if (obj.command == 'newShell') {
                var md = obj.data;
                game.shellControl.addShell(md);
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