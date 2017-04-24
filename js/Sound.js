//声音支持
var Sound = function (scene) {
    this.tankMove = null;//坦克移动音效
    this.tankFire = null;//坦克开火音效
    this.bomb = null;//炮弹爆炸音效
    this.bgm = null;//背景音乐
    this.gamescene = scene;//连接游戏场景
}

//加载音效资源
Sound.prototype.loadSource = function (camp) {
    this.tankMove = new BABYLON.Sound('tankMove', '../asset/music/sound/tankMove.mp3', this.gamescene);
    this.tankFire = new BABYLON.Sound('tankFire', '../asset/music/sound/tankFire.mp3', this.gamescene);
    this.bomb = new BABYLON.Sound('bomb', '../asset/music/sound/bomb.mp3', this.gamescene, null, {
        loop: false,
        autoplay: false,
        spatialSound: true,
        maxDistance: 300
    });
    if (camp == 'R')
        this.bgm = new BABYLON.Sound('Fighting', '../asset/music/fight0.mp3', this.gamescene, null, {
            loop: false,
            autoplay: true
        });
    else
        this.bgm = new BABYLON.Sound('Fighting', '../asset/music/fight1.mp3', this.gamescene, null, {
            loop: false,
            autoplay: true
        });
}
//坦克行进音效
Sound.prototype.tankMoveSound = function (flag) {
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
Sound.prototype.tankFireSound = function () {
    this.tankFire.play();
}
//炮弹爆炸音效
Sound.prototype.bombSound = function (position) {
    this.bomb.setPosition(position);
    this.bomb.play();
}