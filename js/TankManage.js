//坦克管理
var TankManage = function (scene) {
    this.gamescene = scene;//连接游戏场景
    this.myTank = null;//本机坦克
    this.tankList = [];//坦克列表
    this.deathView = false;//死亡视角标记
}

//添加坦克
TankManage.prototype.addTank = function (user, camp, position) {
    var tank = new Tank();
    tank.create(user, camp, position, this.gamescene);
    this.tankList.push(tank);
    return tank;
}
//移动玩家坦克
TankManage.prototype.myTankMove = function (camera, information, island) {
    if (!this.myTank.live) {
        //开启死亡视角
        if (!this.deathView) {
            $('#gunsight').css('visibility', 'hidden');
            camera.speed = 40;
            camera.position = new BABYLON.Vector3(0, 50, 0);
            information.death();
            this.deathView = true;
        }
    } else {
        try {
            camera.position.y = island.getHeightAtCoordinates(camera.position.x, camera.position.z) + 2;
        } catch (e) {
        }
        //限定坦克炮筒角度
        if (camera.rotation.x > 0.5) camera.rotation.x = 0.5;
        if (camera.rotation.x < -0.5) camera.rotation.x = -0.5;
        //因为相机附带移动效果因此让坦克跟随相机
        this.myTank.position.x = camera.position.x;
        this.myTank.position.y = camera.position.y - this.myTank.cameraOffset;
        this.myTank.position.z = camera.position.z;
        this.myTank.rotation_gun.x = camera.rotation.x;
        this.myTank.rotation_gun.y = camera.rotation.y;
        this.myTank.rotation_gun.z = camera.rotation.z;
        //控制旋转，随机数作为抖动因子模拟移动的颠簸
        this.myTank.rotation_box.y += this.myTank.rotationFlag * this.myTank.boxRotateSpeed * (Math.random() * 0.7 + 0.3);
        //坦克入水
        if (this.myTank.position.y <= 3) {
            information.swim();
        }
    }
}
//客户端更新数据
TankManage.prototype.clientUpdate = function (data, information) {
    for (var i = 0; i < data.length; i++) {
        try {
            //对于移动数据使用本地数据为基准，不用与服务器同步
            if (data[i].user == this.myTank.user) {
                if (this.myTank.life != data[i].life)
                    information.beAttack();
                this.myTank.live = data[i].live;
                this.myTank.life = data[i].life;
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
            this.addTank(data[i].user, data[i].camp, data[i].position);
        }
    }
}
//绘制坦克新的位置
TankManage.prototype.draw = function () {
    for (var i = 0; i < this.tankList.length; i++) {
        if (this.tankList[i].live) {
            this.tankList[i].draw();
        }
    }
}