/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by 杜鹏宇 on 2015/11/24
 */

//声音支持
SoundControl = function () {
    this.total = 3;//歌曲数目
    this.tankMove = new BABYLON.Sound('tankMove', '../asset/music/sound/tankMove.mp3', game.scene);//坦克移动音效
    this.tankFire = new BABYLON.Sound('tankFire', '../asset/music/sound/tankFire.mp3', game.scene);//坦克开火音效
    this.bomb = new BABYLON.Sound('bomb', '../asset/music/sound/bomb.mp3', game.scene);//炮弹爆炸音效
}

//播放背景音乐
SoundControl.prototype.playBackgroundMusic = function () {
    var path = Math.floor(Math.random() * this.total);
    var music = new BABYLON.Sound('Fighting', '../asset/music/fight/fight' + path + '.mp3', game.scene, null, { loop: false, autoplay: true});
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
SoundControl.prototype.bombSound = function () {
    this.bomb.play();
}