/**
 * Created by 杜鹏宇 on 2015/09/07
 * Modified by
 */

//指令支持
PlayControl = function () {
    this.isWDown = false;//W按下
    this.isSDown = false;//S按下
    this.isADown = false;//A按下
    this.isDDown = false;//D按下
}

//设定指令
PlayControl.prototype.run = function (camera, myTank, tankList, soundControl, infoControl) {
    //移动停止
    var moveStop = function () {
        camera.speed = 0;
        myTank.rotationFlag = 0;
        soundControl.tankMoveSound(false);
    }

    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 88) { // 按 X
            infoControl.showUserList(tankList);
        }
        //位于死亡视角不能进行其他操作
        if (!myTank.live) return;
        //角度归一化
        camera.rotation.y = camera.rotation.y % (2 * Math.PI);
        if (camera.rotation.y < 0) camera.rotation.y += 2 * Math.PI;
        myTank.rotation_box.y = myTank.rotation_box.y % (2 * Math.PI);
        if (myTank.rotation_box.y < 0) myTank.rotation_box.y += 2 * Math.PI;
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
            if (Math.abs(camera.rotation.y - myTank.rotation_box.y) < 0.09) {
                myTank.rotationFlag = 0;
                camera.speed = myTank.moveSpeed;
            } else {
                camera.speed = 0;
                var a = camera.rotation.y - myTank.rotation_box.y;
                var b = myTank.rotation_box.y - camera.rotation.y;
                if ((a > 0 && a <= Math.PI) || (b > 0 && b >= Math.PI)) {
                    myTank.rotationFlag = 1;
                } else {
                    myTank.rotationFlag = -1;
                }
            }
            soundControl.tankMoveSound(true);
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
                target = camera.rotation.y - Math.PI / 2;
                if (target < 0) target += 2 * Math.PI;
                //寻找最快的转向达到平行位置
                var a = myTank.rotation_box.y - target;
                var b = target - myTank.rotation_box.y;
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
                target = camera.rotation.y + Math.PI / 2;
                if (target > 2 * Math.PI) target -= 2 * Math.PI;
                //寻找最快的转向达到平行位置
                var a = myTank.rotation_box.y - target;
                var b = target - myTank.rotation_box.y;
                if ((a > Math.PI / 2 && a < 3 * Math.PI / 2) || (b > Math.PI / 2 && b < 3 * Math.PI / 2)) {
                    target -= Math.PI;
                    if (target < 0) target += 2 * Math.PI;
                }
            }
            //先转向再移动
            if (Math.abs(target - myTank.rotation_box.y) < 0.09) {
                myTank.rotationFlag = 0;
                camera.speed = myTank.moveSpeed;
            } else {
                camera.speed = 0;
                var a = target - myTank.rotation_box.y;
                var b = myTank.rotation_box.y - target;
                if ((a > 0 && a <= Math.PI) || (b > 0 && b >= Math.PI)) {
                    myTank.rotationFlag = 1;
                } else {
                    myTank.rotationFlag = -1;
                }
            }
            soundControl.tankMoveSound(true);
            return;
        }

        if (e && e.keyCode == 32) { // 按 空格(发射)
            soundControl.tankFireSound();
        }
    };

    document.onkeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 88) { // 按 X
            infoControl.hideUserList();
        }
        //位于死亡视角不能进行其他操作
        if (!myTank.live) return;
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