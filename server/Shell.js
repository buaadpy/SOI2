//炮弹
var Shell = function (id, position, direction, target, speed, damage) {
    this.id = id;//炮弹id
    this.position = position;//炮弹位置
    this.direction = direction;//炮弹方向
    this.target = target;//目标位置
    this.speed = speed;//炮弹速度
    this.damage = damage;//炮弹伤害
}

//炮弹飞行
Shell.prototype.fly = function () {
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;
    this.position.z += this.direction.z * this.speed;
}

module.exports = Shell;