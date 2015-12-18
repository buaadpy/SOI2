/**
 * Created by 杜鹏宇 on 2015/09/07
 * Modified by
 */

//坦克管理
TankControl = function () {
    this.gamescene = null;//连接游戏场景
    this.myTank = null;//本机坦克
    this.tankList = [];//坦克列表
    this.playerNumber = 0;//玩家人数
    this.redLive = 0;//红方存活数量
    this.blueLive = 0;//蓝方存活数量
    this.deathView = false;//死亡视角标记
    this.serverData = null;//服务器发送数据，作为外部函数的参数
}

//添加坦克
TankControl.prototype.addTank = function (user, camp, position, type) {
    var tank = new Tank();
    tank.create(user, camp, position, type, this.gamescene);
    this.tankList.push(tank);
    this.playerNumber++;
    if (camp == 'R') {
        this.redLive++;
    } else {
        this.blueLive++;
    }
    return tank;
}
//移动玩家坦克
TankControl.prototype.myTankMove = function (camera, infoControl) {
    if (!this.myTank.live) {
        //开启死亡视角
        if (!this.deathView) {
            var t = document.getElementById('gunsight');
            t.parentNode.removeChild(t);
            camera.applyGravity = false;
            camera.speed = 40;
            camera.position = new BABYLON.Vector3(0, 50, 0);
            infoControl.death();
            this.deathView = true;
        }
    } else {
        //限定坦克炮筒角度
        if (camera.rotation.x > 0.5) camera.rotation.x = 0.5;
        if (camera.rotation.x < -0.5) camera.rotation.x = -0.5;
        //因为相机附带移动效果因此让坦克跟随相机
        this.myTank.position.x = camera.position.x;
        this.myTank.position.y = camera.position.y - 3.5;
        this.myTank.position.z = camera.position.z;
        this.myTank.rotation_gun.x = camera.rotation.x;
        this.myTank.rotation_gun.y = camera.rotation.y;
        this.myTank.rotation_gun.z = camera.rotation.z;
        //控制旋转，随机数作为抖动因子模拟移动的颠簸
        this.myTank.rotation_box.y += this.myTank.rotationFlag * this.myTank.boxRotateSpeed * (Math.random());
        //坦克入水
        if (this.myTank.position.y <= 3) {
            infoControl.swim();
        }
    }
}
//获取向服务器发送当前坦克状态的数据
TankControl.prototype.getTankData = function () {
    var data = {
        position: this.myTank.position,
        rotation_box: this.myTank.rotation_box,
        rotation_gun: this.myTank.rotation_gun
    }
    return data;
}
//服务器更新单一坦克位置
TankControl.prototype.updateTankInfo = function (user, data) {
    for (var i = 0; i < this.tankList.length; i++) {
        if (this.tankList[i].user == user) {
            this.tankList[i].position = data.position;
            this.tankList[i].rotation_box = data.rotation_box;
            this.tankList[i].rotation_gun = data.rotation_gun;
            break;
        }
    }
}
//服务器计算游戏数据
TankControl.prototype.serverUpdate = function () {
    this.serverData = [];
    for (var i = 0; i < this.tankList.length; i++) {
        //坦克入水
        if (this.tankList[i].position.y <= 3) {
            if (this.tankList[i].life >= 0) this.tankList[i].life -= 0.3;
        }
        //判断坦克是否存活
        if (this.tankList[i].live && this.tankList[i].life <= 0) {
            this.tankList[i].live = false;
            if (this.tankList[i].camp == 'R') {
                this.redLive--;
            } else {
                this.blueLive--;
            }
        }
        //添加发送数据
        this.serverData[i] = {
            user: this.tankList[i].user,
            camp: this.tankList[i].camp,
            position: this.tankList[i].position,
            rotation_box: this.tankList[i].rotation_box,
            rotation_gun: this.tankList[i].rotation_gun,
            type: this.tankList[i].type,
            live: this.tankList[i].live,
            life: this.tankList[i].life
        }
    }
}
//客户端更新数据
TankControl.prototype.clientUpdate = function (data, infoControl) {
    for (var i = 0; i < data.length; i++) {
        try {
            //对于移动数据使用本地数据为基准，不用与服务器同步
            if (data[i].user == this.myTank.user) {
                if (this.tankList[i].life != data[i].life)
                    infoControl.beAttack();
                this.tankList[i].live = data[i].live;
                this.tankList[i].life = data[i].life;
                continue;
            }
        } catch (e) {
        }
        var flag = false;
        //更新数据
        for (var j = 0; j < this.tankList.length; j++) {
            if (data[i].user == this.tankList[j].user) {
                this.tankList[j].position = data[i].position;
                this.tankList[j].rotation_box = data[i].rotation_box;
                this.tankList[j].rotation_gun = data[i].rotation_gun;
                this.tankList[i].live = data[i].live;
                this.tankList[i].life = data[i].life;
                flag = true;
                break;
            }
        }
        if (!flag) {
            console.log('客户端接收到新坦克' + data[i].user);
            this.addTank(data[i].user, data[i].camp, data[i].position, data[i].type);
        }
    }
}
//绘制坦克新的位置
TankControl.prototype.draw = function () {
    for (var i = 0; i < this.tankList.length; i++) {
        if (!this.tankList[i].live) {
            if (this.tankList[i].mark != null) {
                this.gamescene.removeMesh(this.tankList[i].mark);
                this.tankList[i].mark = null;
            }
            return;
        } else
            this.tankList[i].draw();
    }
}
//获取游戏胜利方
TankControl.prototype.getWinner = function () {
    if (this.playerNumber > 1) {
        if (this.redLive <= 0)
            return '蓝军阵营';
        if (this.blueLive <= 0)
            return '红军阵营';
        return null;
    }
}