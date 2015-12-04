/**
 * Created by 杜鹏宇 on 2015/7/8
 * Modified by 杜鹏宇 on 2015/12/04
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
    this.shellControl = null;//炮弹项
    this.tankControl = null;//坦克项
    this.commControl = null;//通信项
    this.particleControl = null;//粒子项
    this.playControl = null;//指令项
    this.soundControl = null;//声音项
}

//游戏初始化
SOI2.prototype.init = function () {
    //加载游戏引擎
    this.canvas = document.getElementById('gameCanvas');
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.engine.displayLoadingUI();
    setTimeout(function () {
        game.engine.hideLoadingUI();
    }, '4000');
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
    this.shellControl = new ShellControl();
    this.tankControl = new TankControl();
    this.commControl = new CommControl();
    this.particleControl = new ParticleControl();
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
    this.mapControl.createMap();
    this.infoControl.showSmallMap();

    //新建玩家坦克
    this.tankControl.addTank(this.userName, this.userCamp, new BABYLON.Vector3(0, 0, 0), this.tankType);
    //Todo 临时代码
    //添加相机
    if (this.userCamp == 'R') {
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(200 + Math.random() * 10, 20, -50 + Math.random() * 10), this.scene);
    } else {
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(-370 + Math.random() * 10, 20, -10 + Math.random() * 10), this.scene);
    }
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
    this.playControl.run();
    //加载背景音乐
    this.soundControl.playBackgroundMusic();
}

//游戏逻辑更新
SOI2.prototype.update = function () {
    this.tankControl.myTankMove();
    this.infoControl.updateInfoPanel(this.tankControl.myTank);
    this.infoControl.updateSmallMap(this.tankControl.tankList);
    if (this.isHost) {
        //炮弹飞行
        this.shellControl.fly();
        //采用60Hz的同步频率
        if (Math.random() * (60 / 60) < 1) {
            this.tankControl.serverUpdate();
            this.shellControl.serverUpdate();
        }
        //判断游戏是否结束
        this.tankControl.isGameover();
    } else {
        //采用60Hz的同步频率
        if (Math.random() * (60 / 60) < 1) {
            this.tankControl.sendTankInfo();
        }
    }
}

//游戏画面绘制
SOI2.prototype.draw = function () {
    this.tankControl.draw();
    this.shellControl.draw();
    this.scene.render();
}

//游戏结束
SOI2.prototype.gameover = function (result) {
    alert('战斗结束，获胜方为：' + result);
    window.location.href = 'ready.html?' + this.userName;
}