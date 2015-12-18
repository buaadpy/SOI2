/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by
 */

//炮弹类
Shell = function () {
    this.position = new BABYLON.Vector3(0, 0, 0);//炮弹位置
    this.direction = new BABYLON.Vector3(0, 0, 0);//炮弹方向
    this.target = new BABYLON.Vector3(0, 0, 0);//目标位置
    this.speed = 0;//炮弹速度
    this.damage = 0;//炮弹伤害
    this.id = null;//炮弹id
    this.object = null;//炮弹对象
    this.live = true;//存活
}

//创造炮弹
Shell.prototype.create = function (position, direction, target, speed, damage, id, scene) {
    this.position = position;
    this.direction = direction;
    this.target = target;
    this.speed = speed;
    this.damage = damage;
    this.id = id;
    this.object = BABYLON.Mesh.CreateSphere(id, 10, 0.1, scene);
}
//炮弹飞行
Shell.prototype.fly = function () {
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;
    this.position.z += this.direction.z * this.speed;
}
//绘制炮弹
Shell.prototype.draw = function () {
    this.object.position.x = this.position.x;
    this.object.position.y = this.position.y;
    this.object.position.z = this.position.z;
}