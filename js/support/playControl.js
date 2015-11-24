/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by 杜鹏宇 on 2015/11/23
 */

//指令支持
PlayControl = function () {
    this.isWDown = false;//W按下
    this.isSDown = false;//S按下
    this.isADown = false;//A按下
    this.isDDown = false;//D按下
}

//设定指令
PlayControl.prototype.run = function () {
    //移动停止
    var moveStop = function () {
        game.camera.speed = 0;
        game.tankControl.myTank.rotationFlag = 0;
        game.soundControl.tankMoveSound(false);
    }

    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        //角度归一化
        game.camera.rotation.y = game.camera.rotation.y % (2 * Math.PI);
        if (game.camera.rotation.y < 0) game.camera.rotation.y += 2 * Math.PI;
        game.tankControl.myTank.rotation_box.y = game.tankControl.myTank.rotation_box.y % (2 * Math.PI);
        if (game.tankControl.myTank.rotation_box.y < 0) game.tankControl.myTank.rotation_box.y += 2 * Math.PI;
        if ((e && e.keyCode == 87) || (e && e.keyCode == 83)) { // 按 W(前进) 按 S(后退)
            if (e && e.keyCode == 87) {
                this.isWDown = true;
                if (this.isSDown || this.isADown || this.isDDown) {
                    moveStop();
                    return;
                }
            } else {
                this.isSDown = true;
                if (this.isWDown || this.isADown || this.isDDown) {
                    moveStop();
                    return;
                }
            }
            //先转向再移动
            if (Math.abs(game.camera.rotation.y - game.tankControl.myTank.rotation_box.y) < 0.09) {
                game.tankControl.myTank.rotationFlag = 0;
                game.camera.speed = game.tankControl.myTank.moveSpeed;
            } else {
                game.camera.speed = 0;
                var a = game.camera.rotation.y - game.tankControl.myTank.rotation_box.y;
                var b = game.tankControl.myTank.rotation_box.y - game.camera.rotation.y;
                if ((a > 0 && a <= Math.PI) || (b > 0 && b >= Math.PI)) {
                    game.tankControl.myTank.rotationFlag = 1;
                } else {
                    game.tankControl.myTank.rotationFlag = -1;
                }
            }
            game.soundControl.tankMoveSound(true);
            return;
        }

        if ((e && e.keyCode == 65) || (e && e.keyCode == 68)) { // 按 A(左转) 按 D(右转)
            var target;
            //计算最终转向
            if (e && e.keyCode == 65) {
                this.isADown = true;
                if (this.isSDown || this.isWDown || this.isDDown) {
                    moveStop();
                    return;
                }
                target = game.camera.rotation.y - Math.PI / 2;
                if (target < 0) target += 2 * Math.PI;
                //寻找最快的转向达到平行位置
                var a = game.tankControl.myTank.rotation_box.y - target;
                var b = target - game.tankControl.myTank.rotation_box.y;
                if ((a > Math.PI / 2 && a < 3 * Math.PI / 2) || (b > Math.PI / 2 && b < 3 * Math.PI / 2)) {
                    target -= Math.PI;
                    if (target < 0) target += 2 * Math.PI;
                }
            } else {
                this.isDDown = true;
                if (this.isSDown || this.isADown || this.isWDown) {
                    moveStop();
                    return;
                }
                target = game.camera.rotation.y + Math.PI / 2;
                if (target > 2 * Math.PI) target -= 2 * Math.PI;
                //寻找最快的转向达到平行位置
                var a = game.tankControl.myTank.rotation_box.y - target;
                var b = target - game.tankControl.myTank.rotation_box.y;
                if ((a > Math.PI / 2 && a < 3 * Math.PI / 2) || (b > Math.PI / 2 && b < 3 * Math.PI / 2)) {
                    target -= Math.PI;
                    if (target < 0) target += 2 * Math.PI;
                }
            }
            //先转向再移动
            if (Math.abs(target - game.tankControl.myTank.rotation_box.y) < 0.09) {
                game.tankControl.myTank.rotationFlag = 0;
                game.camera.speed = game.tankControl.myTank.moveSpeed;
            } else {
                game.camera.speed = 0;
                var a = target - game.tankControl.myTank.rotation_box.y;
                var b = game.tankControl.myTank.rotation_box.y - target;
                if ((a > 0 && a <= Math.PI) || (b > 0 && b >= Math.PI)) {
                    game.tankControl.myTank.rotationFlag = 1;
                } else {
                    game.tankControl.myTank.rotationFlag = -1;
                }
            }
            game.soundControl.tankMoveSound(true);
            return;
        }

        if (e && e.keyCode == 32) { // 按 空格(发射)
            game.soundControl.tankFireSound();
        }
    };

    document.onkeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if ((e && e.keyCode == 87) || (e && e.keyCode == 83) || (e && e.keyCode == 65) || (e && e.keyCode == 68)) {
            if (e && e.keyCode == 87) this.isWDown = false;
            else if (e && e.keyCode == 83) this.isSDown = false;
            else if (e && e.keyCode == 65) this.isADown = false;
            else this.isDDown = false;
            moveStop();
        }
        if (e && e.keyCode == 32) { // 按 空格(发射)
        }
    }
}