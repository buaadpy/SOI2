/**
 * Created by 杜鹏宇 on 2015/9/10
 * Modified by
 */

//坦克类
Tank = function () {
    this.user = '';//玩家名称
    this.camp = '';//玩家阵营
    this.type = '';//坦克类型
    this.life = 100;//生命值
    this.live = true;//存活标记

    this.object_box = null;//坦克身体
    this.object_gun = null;//坦克炮筒
    this.mark = null;//阵营指示物
    this.position = new BABYLON.Vector3(0, 0, 0);//坦克位置
    this.rotation_box = new BABYLON.Vector3(0, 0, 0);//坦克身体转向
    this.rotation_gun = new BABYLON.Vector3(0, 0, 0);//坦克炮筒转向
    this.rotationFlag = 0;//转向指示，1表示顺时针，-1表示逆时针，0表示不转动

    this.attackDamage = 0;//攻击伤害
    this.shellSpeed = 0;//炮弹速度
    this.shootSpeed = 0;//攻击速度
    this.gunRotateSpeed = 0;//炮台旋转速度
    this.boxRotateSpeed = 0;//车身旋转速度
    this.moveSpeed = 0;//坦克速度
    this.protectDamage = 0;//防御减伤
}

//创造坦克
Tank.prototype.create = function (user, camp, position, type, scene) {
    this.user = user;
    this.camp = camp;
    this.position = position;
    this.type = type;
    this.life = 100;
    this.live = true;
    //根据不同类型设置不同坦克参数
    if (this.type == 'tankA') {
        this.attackDamage = 30;//攻击伤害
        this.shellSpeed = 1;//炮弹速度
        this.shootSpeed = 3;//攻击速度
        this.gunRotateSpeed = 0;//炮台旋转速度
        this.boxRotateSpeed = 0;//车身旋转速度
        this.moveSpeed = 0.5;//坦克速度
        this.protectDamage = 7;//防御减伤
    } else if (this.type == 'tankB') {
        this.attackDamage = 50;//攻击伤害
        this.shellSpeed = 2;//炮弹速度
        this.shootSpeed = 4;//攻击速度
        this.gunRotateSpeed = 3000;//炮台旋转速度
        this.boxRotateSpeed = 0.03;//车身旋转速度
        this.moveSpeed = 7;//坦克速度
        this.protectDamage = 15;//防御减伤
    } else {
        this.attackDamage = 70;//攻击伤害
        this.shellSpeed = 3;//炮弹速度
        this.shootSpeed = 6;//攻击速度
        this.gunRotateSpeed = 0;//炮台旋转速度
        this.boxRotateSpeed = 0;//车身旋转速度
        this.moveSpeed = 5;//坦克速度
        this.protectDamage = 0;//防御减伤
    }
    //加载坦克模型
    var material = new BABYLON.StandardMaterial('tankMaterial', scene);
    if (this.camp == 'R') {
        material.diffuseColor = new BABYLON.Color3(255 / 255, 30 / 255, 30 / 255);
    } else {
        material.diffuseColor = new BABYLON.Color3(30 / 255, 30 / 255, 255 / 255);
    }
    var loader = new BABYLON.AssetsManager(scene);
    var _this = this;
    var loadTank = loader.addMeshTask(this.user, ['tank', 'gun'], '../asset/model/', 'testTank.obj');
    loadTank.onSuccess = function () {
        if (loadTank.loadedMeshes[0].name == 'gun') {
//            loadTank.loadedMeshes[0].parent = loadTank.loadedMeshes[1];
            _this.object_box = loadTank.loadedMeshes[1];
            _this.object_gun = loadTank.loadedMeshes[0];
        } else {
//            loadTank.loadedMeshes[1].parent = loadTank.loadedMeshes[0];
            _this.object_box = loadTank.loadedMeshes[0];
            _this.object_gun = loadTank.loadedMeshes[1];
        }
        _this.object_box.position = position;
        _this.object_gun.position = position;
    };
    try {
        loader.load();
    } catch (e) {
        console.log('游戏错误:' + e);
    }
    ;

    //加载阵营标记
    this.mark = BABYLON.Mesh.CreateCylinder(this.user + 'CampMark', 15, 8, 0.1, 6, 1, scene);
    this.mark.position.x = position.x;
    this.mark.position.y = position.y + 30;
    this.mark.position.z = position.z;
    this.mark.material = material;
}