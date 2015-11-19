/**
 * Created by 杜鹏宇 on 2015/9/13
 * Modified by 杜鹏宇 on 2015/10/14
 */

//管理信息面板显示
InfoControl = function () {
}
//更新面板信息
InfoControl.prototype.update = function (tank) {
    document.getElementById("info_name").innerHTML = tank.user;
    document.getElementById("info_life").innerHTML = "生命值: " + tank.life;
    document.getElementById("info_position").innerHTML = "坐  标: " + Math.round(tank.position.x) + " , " + Math.round(tank.position.z);
    document.getElementById("info_height").innerHTML = "海  拔: " + Math.round(tank.position.y);
}
//提示遭受攻击
InfoControl.prototype.beAttack = function () {
    document.getElementById("tip_info").innerHTML = "警告：您遭受攻击！";
    setTimeout(function () {
        document.getElementById("tip_info").innerHTML = "";
    }, "1000");
}
//提示敌方加入
InfoControl.prototype.enemyJoin = function () {
    document.getElementById("tip_info").innerHTML = "警告：有新的敌人空降战场！";
    setTimeout(function () {
        document.getElementById("tip_info").innerHTML = "";
    }, "1000");
}
//提示友军加入
InfoControl.prototype.friendJoin = function () {
    document.getElementById("tip_info").style.color = "#00FF00";
    document.getElementById("tip_info").innerHTML = "注意：有新的友军增援战场！";
    setTimeout(function () {
        document.getElementById("tip_info").style.color = "#FF0000"
        document.getElementById("tip_info").innerHTML = "";
    }, "1000");
}