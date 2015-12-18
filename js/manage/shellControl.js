/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by
 */

//炮弹管理
ShellControl = function () {
    this.gamescene = null;//连接游戏场景
    this.shellList = [];//子弹列表
    this.serverData = null;//服务器发送数据，作为外部函数的参数
}

//新建炮弹
ShellControl.prototype.addShell = function (data) {
    var shell = new Shell();
    shell.create(data.position, data.direction, data.target, data.speed, data.damage, data.id, this.gamescene);
    this.shellList.push(shell);
}
//删除炮弹
ShellControl.prototype.delete = function (id) {
    var index = this.searchIndex(id);
    if (index == null) return;
    this.gamescene.removeMesh(this.shellList[index].object);
    this.shellList.splice(index, 1);
}
//查询炮弹序号
ShellControl.prototype.searchIndex = function (id) {
    for (var i = 0; i < this.shellList.length; i++) {
        if (this.shellList[i].id == id) {
            return i;
        }
    }
    return null;
}
//让子弹飞
ShellControl.prototype.fly = function (tankList, username, infoControl) {
    //计算两点间距离
    var distance = function (a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) +
            (a.y - b.y) * (a.y - b.y) +
            (a.z - b.z) * (a.z - b.z));
    }

    var bombId = [];//记录爆炸炮弹id
    for (var i = 0; i < this.shellList.length; i++) {
        //炮弹飞行
        this.shellList[i].fly();
        //判断是否击中坦克
        for (var j = 0; j < tankList.length; j++) {
            if (distance(this.shellList[i].position, tankList[j].position) < 6) {
                tankList[j].life -= this.shellList[i].damage - tankList[j].protectDamage;
                if (tankList[j].user == username)
                    infoControl.beAttack();
                if (this.shellList[i].live) {
                    bombId.push(this.shellList[i].id);
                    this.shellList[i].live = false;
                }
            }
        }
        //判断是否击中目标点（地面、天空）
        if (distance(this.shellList[i].position, this.shellList[i].target) < this.shellList[i].speed && this.shellList[i].live) {
            bombId.push(this.shellList[i].id);
            this.shellList[i].live = false;
        }
    }
    return bombId;
}
//绘制炮弹新的位置
ShellControl.prototype.draw = function () {
    for (var i = 0; i < this.shellList.length; i++) {
        this.shellList[i].draw();
    }
}
//获取炮弹初始数据
ShellControl.prototype.getShootData = function (canvas, camera, tank) {
    var pickResult = this.gamescene.pick(canvas.offsetWidth / 2, canvas.offsetHeight / 2);
    var target = pickResult.pickedPoint;
    var direction = new BABYLON.Vector3(target.x - camera.position.x, target.y - camera.position.y, target.z - camera.position.z);
    direction.normalize();
    var startPoint = new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z);
    startPoint = startPoint.add(new BABYLON.Vector3(direction.x * 10, direction.y * 10, direction.z * 10));
    return {
        position: startPoint,
        direction: direction,
        target: target,
        speed: tank.shellSpeed,
        damage: tank.attackDamage,
        id: Math.floor(Math.random() * 99999999)
    };
}
//服务器计算并发送数据
ShellControl.prototype.serverUpdate = function () {
    this.serverData = [];
    for (var i = 0; i < this.shellList.length; i++) {
        this.serverData[i] = {
            id: this.shellList[i].id,
            position: this.shellList[i].position,
            direction: this.shellList[i].direction,
            target: this.shellList[i].target,
            speed: this.shellList[i].speed,
            damage: this.shellList[i].damage,
            live: this.shellList[i].live
        }
    }
}
//客户端更新数据
ShellControl.prototype.clientUpdate = function (data) {
    for (var i = 0; i < data.length; i++) {
        var flag = false;
        for (var j = 0; j < this.shellList.length; j++) {
            if (data[i].id == this.shellList[j].id) {
                this.shellList[j].position = data[i].position;
                flag = true;
                break;
            }
        }
        if (!flag && data[i].live) {
            this.addShell(data[i]);
        }
    }
}