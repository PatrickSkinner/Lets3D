import * as L3D from '/src/L3D.js';
import { createVector3 } from '../src/Core.js';

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
        console.log("Failed initialise WebGL.");
        return;
    }

    scene = new L3D.Scene();

    let pivot = new L3D.Object3D();
    scene.add(pivot);
    let camera = new L3D.Camera(0.52, 1, 1, 100);
    camera.transformLookAt(0, 4, 9, 0, 0, 0, 0, 1, 0);

    scene.setActiveCamera( camera );

    scene.setClearColor(0.5, 0.5, 1.0, 1.0);
    scene.add(camera);
    pivot.addChild(camera);

    var bpMaterial = new L3D.GouraudMat(1.0, 1.0, 1.0, 64);

    var texMat = new L3D.BlinnPhongTex('testtexture.png', 32.0);
    var geometry1 = new L3D.Cube(2, 2, 2);
    var object1 = new L3D.MeshObject(geometry1, texMat);
    scene.add(object1);

    var geometry2 = new L3D.Sphere(0.5, 24, 12);
    var object2 = new L3D.MeshObject(geometry2, bpMaterial);
    object2.translate(0,0,2);
    scene.add(object2);
    object1.addChild(object2);

    var dl = new L3D.DirectionalLight( createVector3(1.0, 1.0, 1.0), createVector3(0.8, 0.8, 0.8), createVector3(0, -1, -1) );
    dl.setPosition(0,2,0);
    scene.add(dl);

    window.requestAnimationFrame(draw);
}

function draw(timestamp){
    scene.renderScene(gl); // Render scene to canvas
    scene.objectList[2].rotate(-1/500, 0, 1, 0);
    window.requestAnimationFrame(draw);
}