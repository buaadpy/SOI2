//指令支持
var Operation = function () {
    this.isWDown = false;//W按下
    this.isSDown = false;//S按下
    this.isADown = false;//A按下
    this.isDDown = false;//D按下
    this.game = null;//连接游戏场景
}

//设定指令
Operation.prototype.run = function () {
    var _this = this;
    var camera = _this.game.camera;
    var canvas = _this.game.canvas;
    var myTank = _this.game.tankManage.myTank;
    var sound = _this.game.sound;

    //移动停止
    var moveStop = function () {
        camera.speed = 0;
        myTank.rotationFlag = 0;
        sound.tankMoveSound(false);
    }

    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];

        // 按 X 显示战场信息
        if (e && e.keyCode == 88) {
            _this.game.information.showUserList(_this.game.tankManage.tankList);
        }

        //位于死亡视角不能进行其他操作
        if (!myTank.live) return;

        //角度归一化
        camera.rotation.y = camera.rotation.y % (2 * Math.PI);
        if (camera.rotation.y < 0) camera.rotation.y += 2 * Math.PI;
        myTank.rotation_box.y = myTank.rotation_box.y % (2 * Math.PI);
        if (myTank.rotation_box.y < 0) myTank.rotation_box.y += 2 * Math.PI;

        // 按 W(前进) 按 S(后退)
        if ((e && e.keyCode == 87) || (e && e.keyCode == 83)) {
            if (e && e.keyCode == 87) {
                _this.isWDown = true;
                //玩家按了多个键则停止移动
                if (_this.isSDown || _this.isADown || _this.isDDown) {
                    moveStop();
                    return;
                }
            } else {
                _this.isSDown = true;
                if (_this.isWDown || _this.isADown || _this.isDDown) {
                    moveStop();
                    return;
                }
            }
            //先转向再移动
            if (Math.abs(camera.rotation.y - myTank.rotation_box.y) < 0.2) {
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
            sound.tankMoveSound(true);
            return;
        }

        // 按 A(左转) 按 D(右转)
        if ((e && e.keyCode == 65) || (e && e.keyCode == 68)) {
            var target;
            //计算最终转向
            if (e && e.keyCode == 65) {
                _this.isADown = true;
                if (_this.isSDown || _this.isWDown || _this.isDDown) {
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
                _this.isDDown = true;
                if (_this.isSDown || _this.isADown || _this.isWDown) {
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
            if (Math.abs(target - myTank.rotation_box.y) < 0.2) {
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
            sound.tankMoveSound(true);
            return;
        }
    };

    document.onkeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];

        // 按 X
        if (e && e.keyCode == 88) {
            _this.game.information.hideUserList(myTank.live);
        }

        //位于死亡视角不能进行其他操作
        if (!myTank.live) return;

        if ((e && e.keyCode == 87) || (e && e.keyCode == 83) || (e && e.keyCode == 65) || (e && e.keyCode == 68)) {
            if (e && e.keyCode == 87) _this.isWDown = false;
            else if (e && e.keyCode == 83) _this.isSDown = false;
            else if (e && e.keyCode == 65) _this.isADown = false;
            else _this.isDDown = false;
            moveStop();
        }
    }

    document.onclick = function (event) {
        //位于死亡视角不能进行其他操作
        if (!myTank.live) return;
        //左键发射炮弹
        if (event.button == 0 && !myTank.inColding) {
            sound.tankFireSound();
            myTank.inColding = true;
            //设置冷却时间
            setTimeout(function () {
                myTank.inColding = false;
            }, myTank.coldTime);

            //创建炮弹
            var pickResult = _this.game.scene.pick(canvas.offsetWidth / 2, canvas.offsetHeight / 2);
            var target = pickResult.pickedPoint;
            var direction = new BABYLON.Vector3(target.x - camera.position.x, target.y - camera.position.y, target.z - camera.position.z);
            direction.normalize();
            var startPoint = new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z);
            startPoint = startPoint.add(new BABYLON.Vector3(direction.x * 10, direction.y * 10, direction.z * 10));
            var shellData = {
                id: Math.floor(Math.random() * 99999999),
                position: startPoint,
                direction: direction,
                target: target,
                speed: myTank.shellSpeed,
                damage: myTank.attackDamage
            };
            _this.game.communication.send('SHOOT', shellData);
        }
    }
}