/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by
 */

//炮弹类
Shell = function () {
    this.object = null;//炮弹对象
    this.id = null;//炮弹id
    this.direction = new BABYLON.Vector3(0, 0, 0);//炮弹方向
    this.position = new BABYLON.Vector3(0, 0, 0);//炮弹位置
    this.speed = 0;//炮弹速度
    this.damage = 0;//炮弹伤害
}

//创造炮弹
Shell.prototype.create = function (position, direction, speed, damage, id, scene) {
    this.object = BABYLON.Mesh.CreateBox('', 10.0, 1.0, scene);
    this.object.position = position;
    this.object.direction = direction;

    this.speed = speed;
    this.damage = damage;
    if (id != null) {
        this.id = id;
    } else {
        //随机分配八位id
        this.id = Math.floor(Math.random() * 99999999);
    }
}
//炮弹飞行
Shell.prototype.fly = function () {
    this.object.position.x += this.direction.x * this.speed;
    this.object.position.y += this.direction.y * this.speed;
    this.object.position.z += this.direction.z * this.speed;
}