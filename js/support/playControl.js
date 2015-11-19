/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by 杜鹏宇 on 2015/10/16
 */

//指令支持
PlayControl = function () {
}

//设定指令
PlayControl.prototype.run = function () {
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 87) { // 按 W(前进)
//            game.tankControl.myTank.direction.x = 1;
//            var object = game.tankControl.myTank.object;
//            var forward = new BABYLON.Vector3(parseFloat(Math.sin(parseFloat(object.rotation.y))) / 5, 0.5, parseFloat(Math.cos(parseFloat(object.rotation.y))) / 5);
//            forward = forward.negate();
//            object.moveWithCollisions(forward);
        }
        if (e && e.keyCode == 83) { // 按 S(后退)
        }
        if (e && e.keyCode == 65) { // 按 A(左转)
        }
        if (e && e.keyCode == 68) { // 按 D(右转)
        }
        if (e && e.keyCode == 32) { // 按 空格(发射)
        }
    };
    document.onkeyup = function (event) {
    }
}