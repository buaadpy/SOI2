//坦克
var Tank = function (user, camp, position, rotation_box, rotation_gun, protectDamage) {
    this.user = user;//玩家名称
    this.camp = camp;//玩家阵营
    this.life = 100;//生命值
    this.live = true;//存活标记
    this.position = position;//坦克位置
    this.rotation_box = rotation_box;//坦克身体转向
    this.rotation_gun = rotation_gun;//坦克炮筒转向
    this.protectDamage = protectDamage;//防御减伤
}

module.exports = Tank;