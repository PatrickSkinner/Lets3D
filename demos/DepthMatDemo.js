import * as L3D from '/src/L3D.js';

var gl;
var scene;

init();

function init(){
    var canvas = document.getElementById('example');
    if(!canvas){
        console.log('Failed to retrieve canvas element');
        return;
    }

    gl = canvas.getContext("webgl2");
    if(!gl){
        console.log("Failed to initialise WebGL.");
        return;
    }

    scene = new L3D.Scene();

    let pivot = new L3D.Object3D();
    scene.add(pivot);

    let camera = new L3D.Camera(0.52, 1, 10, 25);
    camera.transformLookAt(0, 4, 16, 0, 0, 0, 0, 1, 0);
    scene.setActiveCamera( camera );
    scene.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.add(camera);
    pivot.addChild(camera);

    var depthMaterial = new L3D.DepthMat();

    var cubeGeometry = new L3D.Cube(2,2,2);
    var cube = new L3D.MeshObject(cubeGeometry, depthMaterial);
    scene.add(cube);

    var planeGeometry = new L3D.Plane(8, 8);
    var plane = new L3D.MeshObject(planeGeometry, depthMaterial);
    scene.add(plane);
    plane.translate(0,-1, 0);
    plane.rotate(-1.5708, 1, 0, 0);

    window.requestAnimationFrame(draw);
}

function draw(timestamp){
    scene.renderScene(gl);
    scene.objectList[1].rotate(1/500,0,1,0);
    window.requestAnimationFrame(draw);
}