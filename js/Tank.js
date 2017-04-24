//坦克类
var Tank = function () {
    this.user = '';//玩家名称
    this.camp = '';//玩家阵营
    this.life = 100;//生命值
    this.live = true;//存活标记
    this.object_box = null;//坦克身体
    this.object_gun = null;//坦克炮筒
    this.position = new BABYLON.Vector3(0, 0, 0);//坦克位置
    this.rotation_box = new BABYLON.Vector3(0, 0, 0);//坦克身体转向
    this.rotation_gun = new BABYLON.Vector3(0, 0, 0);//坦克炮筒转向
    this.rotationFlag = 0;//转向指示，1表示顺时针，-1表示逆时针，0表示不转动
    this.attackDamage = 0;//攻击伤害
    this.shellSpeed = 0;//炮弹速度
    this.gunRotateSpeed = 0;//炮台旋转速度
    this.boxRotateSpeed = 0;//车身旋转速度
    this.moveSpeed = 0;//坦克速度
    this.protectDamage = 0;//防御减伤
    this.coldTime = 0;//冷却时间
    this.inColding = false;//是否在冷却中
    this.cameraOffset = 0;//相机偏移量
}

//创造坦克
Tank.prototype.create = function (user, camp, position, scene) {
    this.user = user;
    this.camp = camp;
    this.position = position;
    this.life = 100;
    this.live = true;
    this.attackDamage = 40;//攻击伤害
    this.shellSpeed = 10;//炮弹速度
    this.gunRotateSpeed = 4800;//炮台旋转速度
    this.boxRotateSpeed = 0.06;//车身旋转速度
    this.moveSpeed = 10;//坦克速度
    this.protectDamage = 10;//防御减伤
    this.coldTime = 3000;//冷却时间
    this.cameraOffset = 2.8;//相机偏移量

    //加载坦克模型
    var loader = new BABYLON.AssetsManager(scene);
    var _this = this;
    var loadTank = loader.addMeshTask(this.user, ['tank', 'gun'], '../asset/model/', 'tankC.obj');
    loadTank.onSuccess = function () {
        if (loadTank.loadedMeshes[0].name == 'gun') {
            _this.object_box = loadTank.loadedMeshes[1];
            _this.object_gun = loadTank.loadedMeshes[0];
        } else {
            _this.object_box = loadTank.loadedMeshes[0];
            _this.object_gun = loadTank.loadedMeshes[1];
        }
        _this.object_box.position = position;
        _this.object_gun.position = position;
    };
    try {
        loader.useDefaultLoadingScreen = false;
        loader.load();
    } catch (e) {
    }
}
//绘制坦克
Tank.prototype.draw = function () {
    //当坦克模型加载完成才能开始修改位置
    if (this.object_box != null) {
        this.object_box.position.x = this.position.x;
        this.object_box.position.y = this.position.y;
        this.object_box.position.z = this.position.z;
        this.object_gun.position.x = this.position.x;
        this.object_gun.position.y = this.position.y;
        this.object_gun.position.z = this.position.z;
        this.object_box.rotation.x = this.rotation_box.x;
        this.object_box.rotation.y = this.rotation_box.y;
        this.object_box.rotation.z = this.rotation_box.z;
        this.object_gun.rotation.x = this.rotation_gun.x;
        this.object_gun.rotation.y = this.rotation_gun.y;
        this.object_gun.rotation.z = this.rotation_gun.z;
    }
}
//获取坦克数据
Tank.prototype.getTankData = function () {
    var data = {
        user: this.user,
        camp: this.camp,
        position: this.position,
        rotation_box: this.rotation_box,
        rotation_gun: this.rotation_gun,
        protectDamage: this.protectDamage
    }
    return data;
}