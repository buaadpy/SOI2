/**
 * Created by 杜鹏宇 on 2015/12/4
 * Modified by
 */

//粒子系统
ParticleControl = function () {
    this.gamescene = null;//连接游戏场景
}

//爆炸效果
ParticleControl.prototype.bomb = function (point) {
    var fountain = BABYLON.Mesh.CreateBox('foutain', 0.01, this.gamescene);
    fountain.position = point;
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem('particles', 200, this.gamescene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture('../asset/image/particle/fire.png', this.gamescene);

    // Where the particles come from
    particleSystem.emitter = fountain; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(1, 0, -1); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(-1, 0, 1); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(1.0, 0.4, 0.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(1.0, 1.0, 1.0, 0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 7;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.2;
    particleSystem.maxLifeTime = 0.8;

    // Emission rate
    particleSystem.emitRate = 200;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-8, 4, 0);
    particleSystem.direction2 = new BABYLON.Vector3(8, 4, 0);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 6;
    particleSystem.updateSpeed = 0.01;

    particleSystem.disposeOnStop = true;
    // Start the particle system
    particleSystem.start();

    //爆炸效果800ms后结束，释放资源
    var _this = this;
    setTimeout(function () {
        particleSystem.stop();
        _this.gamescene.removeMesh(fountain);
    }, 800);
}