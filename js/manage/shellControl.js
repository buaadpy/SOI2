/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by 杜鹏宇 on 2015/9/15
 */

//炮弹管理
ShellControl = function () {
    this.shellList = [];
}

//新建炮弹
ShellControl.prototype.addShell = function (position, direction, speed, damage) {
    var shell = new Shell();
    shell.create(position, direction, speed, damage);
    this.shellList.push(shell);
}
//让子弹飞
ShellControl.prototype.fly = function () {
    for (var i = 0; i < this.shellList.length; i++)
        this.shellList[i].fly();
}
//服务器发送数据
ShellControl.prototype.serverUpdate = function () {
    var data = [];
    for (var i = 0; i < this.shellList.length; i++) {
        data[i] = {
            id: this.shellList[i].id,
            position: this.shellList[i].position
        }
    }
    game.commControl.send('All', 'Server', 'updateShell', data);
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