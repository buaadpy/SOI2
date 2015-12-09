/**
 * Created by 杜鹏宇 on 2015/09/13
 * Modified by
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

//提示阵亡
InfoControl.prototype.death = function () {
    document.getElementById('tip_info').innerHTML = '[——坦克已被击退——]';
    setTimeout(function () {
        document.getElementById('tip_info').innerHTML = '[——坦克已被击退——]';
    }, '1000');
}
//提示坦克泡水
InfoControl.prototype.swim = function () {
    document.getElementById('tip_info').innerHTML = '警告：坦克正在进水受损！';
    setTimeout(function () {
        document.getElementById('tip_info').innerHTML = '';
    }, '500');
}
//提示遭受攻击
InfoControl.prototype.beAttack = function () {
    document.getElementById('tip_info').innerHTML = '警告：坦克遭受火力攻击！';
    setTimeout(function () {
        document.getElementById('tip_info').innerHTML = '';
    }, '2000');
}
//提示敌方加入
InfoControl.prototype.enemyJoin = function () {
    document.getElementById('tip_info').innerHTML = '警告：新的敌人空降战场！';
    setTimeout(function () {
        document.getElementById('tip_info').innerHTML = '';
    }, '2000');
}
//提示友军加入
InfoControl.prototype.friendJoin = function () {
    document.getElementById('tip_info').style.color = '#00FF00';
    document.getElementById('tip_info').innerHTML = '注意：新的友军增援战场！';
    setTimeout(function () {
        document.getElementById('tip_info').style.color = '#FF0000'
        document.getElementById('tip_info').innerHTML = '';
    }, '2000');
}
//显示获胜方
InfoControl.prototype.showWinner = function (result) {
    document.getElementById('tip_info').style.color = '#FFD700';
    document.getElementById('tip_info').innerHTML = '[' + result + '赢得战斗胜利]';
}

//更新所有用户信息
InfoControl.prototype.updateList = function (tanks) {
    var redtable = document.getElementById('redtable');
    var bluetable = document.getElementById('bluetable');
    var trs = redtable.getElementsByTagName('tr');
    for (var i = trs.length - 1; i >= 0; i--)
        redtable.deleteRow(i);
    trs = bluetable.getElementsByTagName('tr');
    for (var i = trs.length - 1; i >= 0; i--)
        bluetable.deleteRow(i);
    var redcount = 0;
    var bluecount = 0;
    for (var i = 0; i < tanks.length; i++) {
        var row = document.createElement('tr');

        var cell = document.createElement('td');
        cell.style.width = '250px';
        cell.style.paddingLeft = '5px';
        cell.innerHTML = tanks[i].user;
        row.appendChild(cell);
        cell = document.createElement('td');
        cell.style.width = '80px';
        cell.style.textAlign = 'center';
        if (tanks[i].live == true)
            cell.innerText = '';
        else
            cell.innerText = '阵亡';
        row.appendChild(cell);
        cell = document.createElement('td');
        cell.style.width = '80px';
        cell.style.textAlign = 'center';
        if (tanks[i].type == 'tankA')
            cell.innerText = '侦查装甲';
        else if (tanks[i].type == 'tankB')
            cell.innerText = '重型坦克';
        else
            cell.innerText = '自行火炮';
        row.appendChild(cell);

        if (tanks[i].camp == 'R') {
            redtable.appendChild(row);
            redcount++;
        }
        else {
            bluetable.appendChild(row);
            bluecount++;
        }
    }
    document.getElementById('redcount').innerText = redcount;
    document.getElementById('bluecount').innerText = bluecount;
}
//显示战场信息
InfoControl.prototype.showUserList = function (tankList) {
    var datadiv = document.getElementById('datadiv');
    if (datadiv.style.visibility != 'visible') {
        this.updateList(tankList);
        datadiv.style.visibility = 'visible';
        if (document.getElementById('gunsight') != null)
            document.getElementById('gunsight').style.visibility = 'hidden';
    }
}
//隐藏战场信息
InfoControl.prototype.hideUserList = function () {
    var datadiv = document.getElementById('datadiv');
    if (datadiv.style.visibility == 'visible') {
        datadiv.style.visibility = 'hidden';
        if (document.getElementById('gunsight') != null)
            document.getElementById('gunsight').style.visibility = 'visible';
    }
}