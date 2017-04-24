//管理信息面板显示
var Information = function () {
}

//更新面板信息
Information.prototype.updateInfoPanel = function (tank) {
    if (tank.live) {
        $('#info_life').text(Math.round(tank.life));
        $('#info_position').text('（' + Math.round(tank.position.x) + ' , ' + Math.round(tank.position.z) + '）');
        tank.inColding ? $('#logo_colding').css('visibility', 'hidden') : $('#logo_colding').css('visibility', 'visible');
    } else {
        $('#info_life').text('');
        $('#info_position').text('');
        $('#logo_colding').css('visibility', 'hidden');
        $('#logo_life').css('visibility', 'hidden');
        $('#logo_position').css('visibility', 'hidden');
    }
}
//创造小地图
Information.prototype.showSmallMap = function () {
    var map = document.getElementById('smallMap');
    var img = document.createElement('img');
    img.src = '../asset/image/smallmap/smallMap.png';
    img.height = 150;
    img.width = 150;
    map.appendChild(img);
}
//更新小地图
Information.prototype.updateSmallMap = function (myTank, tankList) {
    for (var i = 0; i < tankList.length; i++) {
        var t = document.getElementById('small' + tankList[i].user);
        if (t == null) {
            t = document.createElement('img');
            t.id = 'small' + tankList[i].user;
            if (tankList[i].user == myTank.user)
                t.src = '../asset/image/smallmap/grayPoint.png';
            else if (tankList[i].camp == 'R')
                t.src = '../asset/image/smallmap/redPoint.png';
            else
                t.src = '../asset/image/smallmap/bluePoint.png';
            t.height = 8;
            t.width = 8;
            t.style.position = 'absolute';
            document.body.appendChild(t);
        }
        if (tankList[i].live) {
            var x = (Math.round(tankList[i].position.x) + 490) / 980 * 150;
            var y = (Math.round(-1 * tankList[i].position.z) + 490) / 980 * 150;
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
Information.prototype.death = function () {
    $('#tip_info').text('[——坦克已被击退——]');
    setTimeout(function () {
        $('#tip_info').text('[——坦克已被击退——]');
    }, 3000);
}
//提示坦克泡水
Information.prototype.swim = function () {
    $('#tip_info').text('警告：坦克正在进水受损！');
    setTimeout(function () {
        $('#tip_info').text('');
    }, 500);
}
//提示遭受攻击
Information.prototype.beAttack = function () {
    if ($('#tip_info').text() == '警告：坦克正在进水受损！') return;
    $('#tip_info').text('警告：坦克遭受火力攻击！');
    setTimeout(function () {
        $('#tip_info').text('');
    }, 2000);
}
//提示敌方加入
Information.prototype.enemyJoin = function () {
    $('#tip_info').text('警告：新的敌人空降战场！');
    setTimeout(function () {
        $('#tip_info').text('');
    }, 2000);
}
//提示友军加入
Information.prototype.friendJoin = function () {
    $('#tip_info').css('color', '#00FF00');
    $('#tip_info').text('注意：新的友军增援战场！');
    setTimeout(function () {
        $('#tip_info').css('color', '#FF0000');
        $('#tip_info').text('');
    }, 2000);
}
//显示获胜方
Information.prototype.showWinner = function (result) {
    setInterval(function () {
        $('#tip_info').css('color', '#FFD700');
        $('#tip_info').text('[' + result + '赢得战斗胜利]');
    }, 1000);
}
//显示战场信息表
Information.prototype.showUserList = function (tankList) {
    var datadiv = document.getElementById('datadiv');
    if (datadiv.style.visibility != 'visible') {
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
        for (var i = 0; i < tankList.length; i++) {
            //每辆坦克的信息显示为一行
            var row = document.createElement('tr');
            var cell = document.createElement('td');
            cell.style.width = '250px';
            cell.style.paddingLeft = '5px';
            cell.innerHTML = tankList[i].user;
            row.appendChild(cell);
            cell = document.createElement('td');
            cell.style.width = '80px';
            cell.style.textAlign = 'center';
            if (tankList[i].live == true)
                cell.innerText = '';
            else
                cell.innerText = '阵亡';
            row.appendChild(cell);
            cell = document.createElement('td');
            cell.style.width = '80px';
            cell.style.textAlign = 'center';
            cell.innerText = '作战坦克';
            row.appendChild(cell);
            //分两栏显示
            if (tankList[i].camp == 'R') {
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
        datadiv.style.visibility = 'visible';
        if (document.getElementById('gunsight') != null)
            $('#gunsight').css('visibility', 'hidden');
    }
}
//隐藏战场信息表
Information.prototype.hideUserList = function (live) {
    var datadiv = document.getElementById('datadiv');
    if (datadiv.style.visibility == 'visible') {
        datadiv.style.visibility = 'hidden';
        if (document.getElementById('gunsight') != null && live)
            $('#gunsight').css('visibility', 'visible');
    }
}