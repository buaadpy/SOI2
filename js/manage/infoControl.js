/**
 * Created by 杜鹏宇 on 2015/09/13
 * Modified by
 */

//管理信息面板显示
InfoControl = function () {
    this.smallTank = null;//小地图上的自己坦克
}

//更新面板信息
InfoControl.prototype.updateInfoPanel = function (tank) {
    if (tank.live) {
        $('#info_name').text(tank.camp + "-" + tank.user);
        $('#info_life').text('【生命值】：' + Math.round(tank.life));
        $('#info_position').text('【坐  标】：' + Math.round(tank.position.x) + ' , ' + Math.round(tank.position.z));
        $('#info_height').text('【海  拔】：' + Math.round(tank.position.y));
        $('#info_colding').text('【装 弹】：' + !tank.inColding);
    } else {
        $('#info_name').text(tank.user + '  被击退');
        $('#info_life').text('');
        $('#info_position').text('');
        $('#info_height').text('');
        $('#info_colding').text('');
    }
}
//创造小地图
InfoControl.prototype.showSmallMap = function () {
    var map = document.getElementById('smallMap');
    var img = document.createElement('img');
    img.src = '../asset/image/smallmap/smallMap.png';
    img.height = 150;
    img.width = 150;
    map.appendChild(img);
    this.smallTank = document.createElement('img');
    this.smallTank.src = '../asset/image/smallmap/grayPoint.png';
    this.smallTank.height = 8;
    this.smallTank.width = 8;
    this.smallTank.style.position = 'absolute';
    document.body.appendChild(this.smallTank);
}
//更新小地图
InfoControl.prototype.updateSmallMap = function (myTank, tankList) {
    //绘制自己坦克
    if (myTank.live) {
        var x = (Math.round(myTank.position.x) + 590) / 1180 * 150;
        var y = (Math.round(-1 * myTank.position.z) + 590) / 1180 * 150;
        x += document.getElementById('smallMap').offsetLeft;
        y += document.getElementById('smallMap').offsetTop;
        this.smallTank.style.left = x + 'px';
        this.smallTank.style.top = y + 'px';
    } else {
        this.smallTank.style.visibility = 'hidden';
    }
    //绘制其他坦克
    for (var i = 0; i < tankList.length; i++) {
        if (tankList[i].user == myTank.user) continue;
        var t = document.getElementById('small' + tankList[i].user);
        if (t == null) {
            t = document.createElement('img');
            t.id = 'small' + tankList[i].user;
            if (tankList[i].camp == 'R')
                t.src = '../asset/image/smallmap/redPoint.png';
            else
                t.src = '../asset/image/smallmap/bluePoint.png';
            t.height = 8;
            t.width = 8;
            t.style.position = 'absolute';
            document.body.appendChild(t);
        }
        if (tankList[i].live) {
            var x = (Math.round(tankList[i].position.x) + 590) / 1180 * 150;
            var y = (Math.round(-1 * tankList[i].position.z) + 590) / 1180 * 150;
            x += document.getElementById('smallMap').offsetLeft;
            y += document.getElementById('smallMap').offsetTop;
            t.style.left = x + 'px';
            t.style.top = y + 'px';
        } else {
            t.style.visibility = 'hidden';
        }
    }
}
//提示阵亡
InfoControl.prototype.death = function () {
    $('#tip_info').text('[——坦克已被击退——]');
    setTimeout(function () {
        $('#tip_info').text('[——坦克已被击退——]');
    }, 3000);
}
//提示坦克泡水
InfoControl.prototype.swim = function () {
    $('#tip_info').text('警告：坦克正在进水受损！');
    setTimeout(function () {
        $('#tip_info').text('');
    }, 500);
}
//提示遭受攻击
InfoControl.prototype.beAttack = function () {
    if ($('#tip_info').text() == '警告：坦克正在进水受损！') return;
    $('#tip_info').text('警告：坦克遭受火力攻击！');
    setTimeout(function () {
        $('#tip_info').text('');
    }, 2000);
}
//提示敌方加入
InfoControl.prototype.enemyJoin = function () {
    $('#tip_info').text('警告：新的敌人空降战场！');
    setTimeout(function () {
        $('#tip_info').text('');
    }, 2000);
}
//提示友军加入
InfoControl.prototype.friendJoin = function () {
    $('#tip_info').css('color', '#00FF00');
    $('#tip_info').text('注意：新的友军增援战场！');
    setTimeout(function () {
        $('#tip_info').css('color', '#FF0000');
        $('#tip_info').text('');
    }, 2000);
}
//显示获胜方
InfoControl.prototype.showWinner = function (result) {
    $('#tip_info').css('color', '#FFD700');
    $('#tip_info').text('[' + result + '赢得战斗胜利]');
}
//更新战场信息表
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
        //每辆坦克的信息显示为一行
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
        //分两栏显示
        if (tanks[i].camp == 'R') {
            redtable.appendChild(row);
            redcount++;
        }
        else {
            bluetable.appendChild(row);
            bluecount++;
        }
    }
    $('#redcount').text(redcount);
    $('#bluecount').text(bluecount);
}
//显示战场信息表
InfoControl.prototype.showUserList = function (tankList) {
    var datadiv = document.getElementById('datadiv');
    if (datadiv.style.visibility != 'visible') {
        this.updateList(tankList);
        datadiv.style.visibility = 'visible';
        if (document.getElementById('gunsight') != null)
            $('#gunsight').css('visibility', 'hidden');
    }
}
//隐藏战场信息表
InfoControl.prototype.hideUserList = function (live) {
    var datadiv = document.getElementById('datadiv');
    if (datadiv.style.visibility == 'visible') {
        datadiv.style.visibility = 'hidden';
        if (document.getElementById('gunsight') != null && live)
            $('#gunsight').css('visibility', 'visible');
    }
}