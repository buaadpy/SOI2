/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by 杜鹏宇 on 2015/9/15
 */

//坦克管理
TankControl = function () {
    this.myTank = null;
    this.tankList = new Array();
    this.playerNumber = 0;//玩家人数
    this.redLive = 0;//红方存活数量
    this.blueLive = 0;//蓝方存活数量
}

//添加坦克
TankControl.prototype.addTank = function (user, camp, position, type) {
    var tank = new Tank();
    tank.create(user, camp, position, type);
    this.tankList[this.tankList.length] = tank;
    if (user == game.userName) {
        this.myTank = tank;
        if (!game.isHost)
            game.commControl.send("Server", game.userName, "newTank", {user: user, camp: camp, position: position, type: type});
    }
    this.playerNumber++;
    if (camp == "R")
        this.redLive++;
    else
        this.blueLive++;
}
//移动玩家坦克
TankControl.prototype.myTankMove = function () {
    //Todo 临时代码
    this.myTank.position.x = game.camera.position.x;
    this.myTank.position.y = game.camera.position.y - 3.5;
    this.myTank.position.z = game.camera.position.z;
    this.myTank.rotation_gun = game.camera.rotation;
}
//服务器更新单一坦克位置
TankControl.prototype.updateTankPosition = function (user, position) {
    for (var i = 0; i < this.tankList.length; i++) {
        if (this.tankList[i].user == user) {
            this.tankList[i].position = position;
            break;
        }
    }
}
//服务器发送数据
TankControl.prototype.serverUpdate = function () {
    var data = new Array();
    for (var i = 0; i < this.tankList.length; i++) {
        data[i] = {
            user: this.tankList[i].user,
            camp: this.tankList[i].camp,
            position: this.tankList[i].position,
            rotation_box: this.tankList[i].rotation_box,
            rotation_gun: this.tankList[i].rotation_gun,
            type: this.tankList[i].type
        }
    }
    game.commControl.send("All", "Server", "updateTank", data);
}
//客户端更新数据
TankControl.prototype.clientUpdate = function (data) {
    for (var i = 0; i < data.length; i++) {
//        if (data[i].user == this.myTank.user) continue;
        var flag = false;
        for (var j = 0; j < this.tankList.length; j++) {
            if (data[i].user == this.tankList[j].user) {
                this.tankList[j].position = data[i].position;
                this.tankList[j].rotation_box = data[i].rotation_box;
                this.tankList[j].rotation_gun = data[i].rotation_gun;
                flag = true;
                break;
            }
        }
        if (!flag) {
            console.log("客户端接收到坦克" + data[i].user);
            this.addTank(data[i].user, data[i].camp, data[i].position, data[i].type);
        }
    }
}
//绘制坦克新的位置
TankControl.prototype.draw = function () {
    for (var i = 0; i < this.tankList.length; i++) {
        if (this.tankList[i].object_box != null) {
            this.tankList[i].object_box.position = this.tankList[i].position;
            this.tankList[i].object_box.rotation = this.tankList[i].rotation_box;
            this.tankList[i].object_gun.rotation = this.tankList[i].rotation_gun;
        }
        this.tankList[i].mark.position.x = this.tankList[i].position.x;
        this.tankList[i].mark.position.y = this.tankList[i].position.y + 30;
        this.tankList[i].mark.position.z = this.tankList[i].position.z;
    }
}
//判断游戏是否结束
TankControl.prototype.isGameover = function(){
    if (this.playerNumber != 1){
        if (this.redLive == 0)
            this.commControl.send("All", "Server", "gameOver", "Blue");
        if (this.blueLive == 0)
            this.commControl.send("All", "Server", "gameOver", "Red");
    }
}