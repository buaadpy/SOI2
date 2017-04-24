//钢铁之魂2
var SOI2 = function () {
    this.canvas = null;//网页画布
    this.engine = null;//游戏引擎
    this.stats = null;//帧率监听

    this.scene = null;//场景
    this.camera = null;//相机
    this.light = null;//光照

    this.userName = null;//玩家名称
    this.userCamp = null;//玩家阵营

    this.information = null;//信息项
    this.mapManage = null;//地图项
    this.particle = null;//粒子项
    this.tankManage = null;//坦克项
    this.communication = null;//通信项
    this.operation = null;//指令项
    this.sound = null;//声音项
}

//游戏初始化
SOI2.prototype.init = function () {
    //加载游戏引擎
    this.canvas = document.getElementById('gameCanvas');
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.engine.loadingUIText = '正在进入钢铁之魂2战场，请稍候';
    this.engine.displayLoadingUI();
    //加载玩家信息
    this.userName = window.sessionStorage.getItem('username');
    window.sessionStorage.removeItem('username');
    //初始化场景
    this.scene = new BABYLON.Scene(this.engine);
    //初始化灯光
    this.light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
    //初始化加载项
    this.information = new Information();
    this.mapManage = new MapManage(this.scene);
    this.particle = new Particle(this.scene);
    this.tankManage = new TankManage(this.scene);
    this.communication = new Communication();
    this.communication.game = this;
    this.operation = new Operation();
    this.operation.game = this;
    this.sound = new Sound(this.scene);
    //连接战场,连接成功后启动游戏流程
    var _this = this;
    this.communication.run(function () {
        //加载游戏内容
        _this.load();
        //建立60FPS的游戏循环
        _this.engine.runRenderLoop(function () {
            _this.update();
            _this.draw();
        });
    });
}

//游戏内容加载
SOI2.prototype.load = function () {
    //加载地图
    this.mapManage.createMap();
    //加载小地图
    this.information.showSmallMap();
    //创建出生点
    var startPoint;
    if (this.userCamp == 'R') {
        startPoint = new BABYLON.Vector3(-220 + Math.random() * 10, 50, 360 + Math.random() * 10);
    } else {
        startPoint = new BABYLON.Vector3(-190 + Math.random() * 10, 50, -300 + Math.random() * 10);
    }
    //新建玩家坦克
    this.tankManage.myTank = this.tankManage.addTank(this.userName, this.userCamp, new BABYLON.Vector3(0, 0, 0));
    //添加相机
    this.camera = new BABYLON.FreeCamera('camera', startPoint, this.scene);
    this.camera.setTarget(new BABYLON.Vector3(0, 30, 0));
    this.camera.attachControl(this.canvas);
    this.camera.keysUp = [87];
    this.camera.keysDown = [83];
    this.camera.keysLeft = [65];
    this.camera.keysRight = [68];
    this.camera.inertia = 0;
    this.camera.speed = 0;
    this.camera.angularSensibility = this.tankManage.myTank.gunRotateSpeed;
    //加载交互命令
    this.operation.run();
    //加载音乐
    this.sound.loadSource(this.userCamp);
}

//游戏逻辑更新
SOI2.prototype.update = function () {
    this.tankManage.myTankMove(this.camera, this.information, this.mapManage.island);
    this.information.updateInfoPanel(this.tankManage.myTank);
    this.information.updateSmallMap(this.tankManage.myTank, this.tankManage.tankList);
    this.communication.send('UPDATA', this.tankManage.myTank.getTankData());
}

//游戏画面绘制
SOI2.prototype.draw = function () {
    this.tankManage.draw();
    this.scene.render();
    this.stats.update();
}

//游戏结束
SOI2.prototype.gameover = function (result) {
    this.information.showWinner(result);
    this.information.showUserList(this.tankManage.tankList);
    var _this = this;
    setTimeout(function () {
        window.location.href = 'ready.html?' + _this.userName;
    }, 7000);
}