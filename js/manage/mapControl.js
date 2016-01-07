/**
 * Created by 杜鹏宇 on 2015/7/22
 * Modified by
 */

//地图管理
MapControl = function () {
    this.gamescene = null;//连接游戏场景
}

//创造地图
MapControl.prototype.createMap = function () {
    //加载天空盒
    var skybox = BABYLON.Mesh.CreateBox('skyBox', 2000.0, this.gamescene);
    var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.gamescene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../asset/image/skybox/skybox', this.gamescene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    //加载岛屿
    var groundMaterial = new BABYLON.StandardMaterial('ground', this.gamescene);
    groundMaterial.diffuseTexture = new BABYLON.Texture('../asset/image/map/island.jpg', this.gamescene);
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap('ground', '../asset/image/map/island_height.jpg', 1200, 1200, 300, 0, 35, this.gamescene, false);
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    //加载水
    var waterMesh = BABYLON.Mesh.CreateGround('waterMesh', 2000, 2000, 1, this.gamescene, false);
    var water = new BABYLON.WaterMaterial('water', this.gamescene);
    water.bumpTexture = new BABYLON.Texture('../asset/image/map/waterbump.png', this.gamescene);
    water.windForce = 0.7;
    water.waveHeight = 0.5;
    water.windDirection = new BABYLON.Vector2(1, 1);
    water.waterColor = new BABYLON.Color3(0.0, 0.3, 0.6);
    water.colorBlendFactor = 0.3;
    water.bumpHeight = 0.1;
    water.waveLength = 0.2;
    water.addToRenderList(skybox);
    waterMesh.material = water;
    waterMesh.position.y = 0;
}
//丰富地图
MapControl.prototype.richMap = function () {
}