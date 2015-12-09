/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by
 */

//炮弹管理
ShellControl = function () {
    this.shellList = [];//子弹列表
    this.serverData = null;//服务器发送数据，作为外部函数的参数
}

//新建炮弹
ShellControl.prototype.addShell = function (position, direction, speed, damage, scene) {
    var shell = new Shell();
    shell.create(position, direction, speed, damage, scene);
    this.shellList.push(shell);
}
//让子弹飞
ShellControl.prototype.fly = function () {
    for (var i = 0; i < this.shellList.length; i++)
        this.shellList[i].fly();
}
//服务器发送数据
ShellControl.prototype.serverUpdate = function () {
    this.serverData = [];
    for (var i = 0; i < this.shellList.length; i++) {
        this.serverData[i] = {
            id: this.shellList[i].id,
            position: this.shellList[i].position
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
        if (!flag) {
            this.addShell(data[i].position, null, 0, 0, data[i].id);
        }
    }
}
//绘制炮弹新的位置
ShellControl.prototype.draw = function () {
    for (var i = 0; i < this.shellList.length; i++) {
        this.shellList[i].object.position = this.shellList[i].position;
    }
}