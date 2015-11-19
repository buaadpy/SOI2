/**
 * Created by 杜鹏宇 on 2015/9/7
 * Modified by 杜鹏宇 on 2015/10/14
 */

//声音支持
SoundControl = function () {
    this.total = 3;//歌曲数目
}

//播放背景音乐
SoundControl.prototype.playBackgroundMusic = function () {
    var path = Math.floor(Math.random() * this.total);
    var music = new BABYLON.Sound("Fighting", "../asset/music/fight/fight" + path + ".mp3", game.scene, null, { loop: false, autoplay: true});
}