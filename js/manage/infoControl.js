/**
 * Created by 杜鹏宇 on 2015/09/13
 * Modified by 杜鹏宇 on 2015/12/04
 */

//管理信息面板显示
InfoControl = function () {
}
//更新面板信息
InfoControl.prototype.updateInfoPanel = function (tank) {
    if (tank.live) {
        document.getElementById('info_name').innerHTML = tank.user;
        document.getElementById('info_life').innerHTML = '生命值: ' + Math.round(tank.life);
        document.getElementById('info_position').innerHTML = '坐  标: ' + Math.round(tank.position.x) + ' , ' + Math.round(tank.position.z);
        document.getElementById('info_height').innerHTML = '海  拔: ' + Math.round(tank.position.y);
    } else {
        document.getElementById('info_name').innerHTML = tank.user + '  被击退';
        document.getElementById('info_life').innerHTML = '';
        document.getElementById('info_position').innerHTML = '';
        document.getElementById('info_height').innerHTML = '';
    }
}
//提示阵亡
InfoControl.prototype.death = function () {
    document.getElementById('tip_info').innerHTML = '[——您的坦克已被击退——]';
    setTimeout(function () {
        document.getElementById('tip_info').innerHTML = '[——您的坦克已被击退——]';
    }, '1000');
}
//提示坦克泡水
InfoControl.prototype.swim = function () {
    document.getElementById('tip_info').innerHTML = '警告：坦克正在受损！';
    setTimeout(function () {
        document.getElementById('tip_info').innerHTML = '';
    }, '500');
}
//提示遭受攻击
InfoControl.prototype.beAttack = function () {
    document.getElementById('tip_info').innerHTML = '警告：您遭受攻击！';
    setTimeout(function () {
        document.getElementById('tip_info').innerHTML = '';
    }, '2000');
}
//提示敌方加入
InfoControl.prototype.enemyJoin = function () {
    document.getElementById('tip_info').innerHTML = '警告：有新的敌人空降战场！';
    setTimeout(function () {
        document.getElementById('tip_info').innerHTML = '';
    }, '2000');
}
//提示友军加入
InfoControl.prototype.friendJoin = function () {
    document.getElementById('tip_info').style.color = '#00FF00';
    document.getElementById('tip_info').innerHTML = '注意：有新的友军增援战场！';
    setTimeout(function () {
        document.getElementById('tip_info').style.color = '#FF0000'
        document.getElementById('tip_info').innerHTML = '';
    }, '2000');
}
//创造小地图
InfoControl.prototype.showSmallMap = function () {
    var map = document.getElementById('smallMap');
    var img = document.createElement('img');
    img.src = '../asset/image/smallMap.png';
    img.height = 150;
    img.width = 150;
    map.appendChild(img);
}
//更新小地图
InfoControl.prototype.updateSmallMap = function (tankList) {
}