/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by
 */

//声音支持
SoundControl = function () {
    this.tankMove = null;//坦克移动音效
    this.tankFire = null;//坦克开火音效
    this.bomb = null;//炮弹爆炸音效
    this.bgm = null;//背景音乐
}

//加载音效资源
SoundControl.prototype.loadSource = function (scene) {
    this.tankMove = new BABYLON.Sound('tankMove', '../asset/music/sound/tankMove.mp3', scene);
    this.tankFire = new BABYLON.Sound('tankFire', '../asset/music/sound/tankFire.mp3', scene);
    this.bomb = new BABYLON.Sound('bomb', '../asset/music/sound/bomb.mp3', scene);
    var path = Math.floor(Math.random() * 3);
    this.bgm = new BABYLON.Sound('Fighting', '../asset/music/fight/fight' + path + '.mp3', scene, null, { loop: false, autoplay: true});
}
//坦克行进音效
SoundControl.prototype.tankMoveSound = function (flag) {
    if (flag) {
        if (!this.tankMove.isPlaying) {
            this.tankMove.setVolume(0.2);
            this.tankMove.play();
            this.tankMove.isPlaying = true;
        }
    } else {
        if (this.tankMove.isPlaying) {
            this.tankMove.stop();
            this.tankMove.isPlaying = false;
        }
    }
}
//坦克开火音效
SoundControl.prototype.tankFireSound = function () {
    this.tankFire.play();
}
//炮弹爆炸音效
SoundControl.prototype.bombSound = function (a, b) {
    //150码内能听到声音
    if (Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z)) <= 150)
        this.bomb.play();
}