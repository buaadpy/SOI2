/**
 * Created by 杜鹏宇 on 2015/7/22
 * Modified by
 */

//地图管理
MapControl = function () {
}

//创造地图
MapControl.prototype.createMap = function (scene) {
    //加载天空盒
    var skybox = BABYLON.Mesh.CreateBox('skyBox', 2000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../asset/image/skybox/skybox', scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    //加载岛屿
    var groundMaterial = new BABYLON.StandardMaterial('ground', scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture('../asset/image/island.jpg', scene);
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap('ground', '../asset/image/island_height.jpg', 1200, 1200, 300, 0, 35, scene, false);
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    //加载水
    var extraGround = BABYLON.Mesh.CreateGround('extraGround', 2000, 2000, 1, scene, false);
    var extraGroundMaterial = new BABYLON.StandardMaterial('extraGround', scene);
    extraGroundMaterial.diffuseTexture = new BABYLON.Texture('../asset/image/water.jpg', scene);
    extraGroundMaterial.diffuseTexture.uScale = 60;
    extraGroundMaterial.diffuseTexture.vScale = 60;
    extraGround.position.y = 2;
    extraGround.material = extraGroundMaterial;
}
//丰富地图
MapControl.prototype.richMap = function () {

}