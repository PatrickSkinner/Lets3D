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
    scene.showLights = true;

    let pivot = new L3D.Object3D();
    scene.add(pivot);
    
    let camera = new L3D.Camera(0.52, 1, 10, 25);
    camera.transformLookAt(0, 4, 16, 0, 0, 0, 0, 1, 0);
    scene.setActiveCamera( camera );
    scene.setClearColor(0, 0, 0, 1.0);
    scene.add(camera);
    pivot.addChild(camera);

    var bpMaterial = new L3D.BlinnPhongMat(1.0, 1.0, 1.0, 64);

    var sphereGeometry = new L3D.Sphere(1.5, 64, 64/2);
    var sphere = new L3D.MeshObject(sphereGeometry, bpMaterial);
    sphere.translate(0, 0.5, 0);
    scene.add(sphere);

    var planeGeometry = new L3D.Plane(10, 10);
    var plane = new L3D.MeshObject(planeGeometry, bpMaterial);
    scene.add(plane);
    plane.translate(0,-1, 0);
    plane.rotate(-1.5708, 1, 0, 0);

    // Spotlight(diffuse, specular, position, direction, cutoff)
    var spotLight = new L3D.SpotLight(L3D.createVector3(0.5, 0.50, 0.5), L3D.createVector3(0.3, 0.3, 0.3), L3D.createVector3(0, 3, 3), L3D.createVector3(0, -1, -1), Math.cos(30*(Math.PI/180)) );
    scene.add(spotLight);

    var ambientLight = new L3D.AmbientLight(L3D.createVector3(0.2, 0.2, 0.2));
    scene.add(ambientLight);

    window.requestAnimationFrame(draw);
}

function draw(timestamp){
    scene.renderScene(gl);
    scene.objectList[1].rotate(1/500,0,1,0);
    window.requestAnimationFrame(draw);
}