/**
 * Created by 杜鹏宇 on 2015/7/8
 * Modified by 杜鹏宇 on 2015/12/08
 */

//钢铁之魂2
SOI2 = function () {
    this.canvas = null;//网页画布
    this.engine = null;//游戏引擎

    this.scene = null;//场景
    this.camera = null;//相机
    this.light = null;//光照

    this.userName = null;//玩家名称
    this.userCamp = null;//玩家阵营
    this.tankType = null;//坦克类型
    this.battlefield = null;//战场名称
    this.isHost = null;//是否为游戏主机


    this.infoControl = null;//信息项
    this.mapControl = null;//地图项
    this.particleControl = null;//粒子项
    this.shellControl = null;//炮弹项
    this.tankControl = null;//坦克项
    this.commControl = null;//通信项
    this.playControl = null;//指令项
    this.soundControl = null;//声音项
}

//游戏初始化
SOI2.prototype.init = function () {
    //加载游戏引擎
    this.canvas = document.getElementById('gameCanvas');
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.engine.loadingUIText = '正在进入钢铁之魂2战场……';
    this.engine.displayLoadingUI();
    setTimeout(function () {
        game.engine.hideLoadingUI();
    }, '5000');
    //加载玩家信息
    this.userName = window.sessionStorage.getItem('username');
    this.tankType = window.sessionStorage.getItem('tanktype');
    this.battlefield = window.sessionStorage.getItem('roomname');
    if (window.sessionStorage.getItem('host') == 'true') {
        this.isHost = true;
    } else {
        this.isHost = false;
    }
    window.sessionStorage.removeItem('username');
    window.sessionStorage.removeItem('tanktype');
    window.sessionStorage.removeItem('roomname');
    window.sessionStorage.removeItem('host');
    //初始化场景
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.gravity = new BABYLON.Vector3(0, -9.8, 0);
    this.scene.collisionsEnabled = true;
    //初始化灯光
    this.light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
    //初始化加载项
    this.infoControl = new InfoControl();
    this.mapControl = new MapControl();
    this.particleControl = new ParticleControl();
    this.shellControl = new ShellControl();
    this.tankControl = new TankControl();
    this.commControl = new CommControl();
    this.playControl = new PlayControl();
    this.soundControl = new SoundControl();
    //连接战场,连接成功后启动游戏流程
    this.commControl.run(function () {
        //加载游戏内容
        game.load();
        //建立60FPS的游戏循环
        game.engine.runRenderLoop(function () {
            game.update();
            game.draw();
        });
    });
}

//游戏内容加载
SOI2.prototype.load = function () {
    //加载地图
    this.mapControl.createMap(this.scene);
    this.infoControl.showSmallMap();
    //创建出生点
    var startPoint;
    if (this.userCamp == 'R') {
        startPoint = new BABYLON.Vector3(200 + Math.random() * 10, 20, -50 + Math.random() * 10);
    } else {
        startPoint = new BABYLON.Vector3(-370 + Math.random() * 10, 20, -10 + Math.random() * 10);
    }
    //新建玩家坦克
    this.tankControl.myTank = this.tankControl.addTank(this.userName, this.userCamp, new BABYLON.Vector3(0, 0, 0), this.tankType, this.scene);
    if (!this.isHost)
        this.commControl.send('Server', this.userName, 'newTank', {user: this.userName, camp: this.userCamp, position: startPoint, type: this.tankType});
    //添加相机
    this.camera = new BABYLON.FreeCamera('camera', startPoint, this.scene);
    this.camera.setTarget(new BABYLON.Vector3(0, 30, 0));
    this.camera.attachControl(this.canvas);
    this.camera.ellipsoid = new BABYLON.Vector3(1, 2, 1);
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera.keysUp = [87];
    this.camera.keysDown = [83];
    this.camera.keysLeft = [65];
    this.camera.keysRight = [68];
    this.camera.inertia = 0;
    this.camera.speed = 0;
    this.camera.angularSensibility = this.tankControl.myTank.gunRotateSpeed;
    //加载交互命令
    this.playControl.run(this.camera, this.tankControl.myTank, this.tankControl.tankList, this.soundControl, this.infoControl);
    //加载音乐
    this.soundControl.loadSource(this.scene);
}

//游戏逻辑更新
SOI2.prototype.update = function () {
    //游戏主机逻辑
    if (this.isHost) {
        this.tankControl.myTankMove(this.camera, this.infoControl);
        this.infoControl.updateInfoPanel(this.tankControl.myTank);
        this.infoControl.updateSmallMap(this.tankControl.tankList);
        //炮弹飞行
        this.shellControl.fly();
        //采用60Hz的同步频率
        this.tankControl.serverUpdate();
        this.commControl.send('All', 'Server', 'updateTank', this.tankControl.serverData);
        this.shellControl.serverUpdate();
        this.commControl.send('All', 'Server', 'updateTank', this.shellControl.serverData);
        //判断游戏是否结束
        if (Math.random() * (60 / 10) < 1) {
            var winner = this.tankControl.getWinner();
            if (winner != null) {
                this.commControl.send('All', 'Server', 'gameOver', winner);
            }
        }
    } else {
        //非游戏主机逻辑
        this.tankControl.myTankMove(this.camera, this.infoControl);
        this.infoControl.updateInfoPanel(this.tankControl.myTank);
        this.infoControl.updateSmallMap(this.tankControl.tankList);
        //采用60Hz的同步频率
        this.commControl.send('Server', this.userName, 'sendTankInfo', this.tankControl.getTankData());
    }
}

//游戏画面绘制
SOI2.prototype.draw = function () {
    this.tankControl.draw(this.scene);
    this.shellControl.draw();
    this.scene.render();
}

//游戏结束
SOI2.prototype.gameover = function (result) {
    this.infoControl.showWinner(result);
    this.infoControl.showUserList(this.tankControl.tankList);
    setTimeout(function () {
        window.location.href = 'ready.html?' + game.userName;
    }, '7000');
}