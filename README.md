# Lets3D - Javascript 3D Library
Lets3D (L3D) is a 3D rendering library using WebGL.

## Usage
Include as an ES6 module using the following syntax:
```javascript
import * as L3D from '/L3D.js';
```

To render a simple scene with a single rotating cube:
```javascript
var canvas = document.getElementById('canvasID');
var gl = canvas.getContext("webgl2");

var scene = new L3D.Scene();

var camera = new L3D.Camera(0.6, 1, 10, 25);
camera.transformLookAt(0, 4, 16, 0, 0, 0, 0, 1, 0);
scene.add(camera);
scene.setActiveCamera(camera);
scene.setClearColor(0.7, 0.7, 0.7, 1.0);

var bpMaterial = new L3D.BlinnPhongMat(0.8, 0.8, 0.8, 255);
var cubeGeometry = new L3D.Cube(4, 4, 4);
var cube = new L3D.MeshObject(cubeGeometry, bpMaterial);
scene.add(cube);

var pointLight = new L3D.PointLight(L3D.createVector3(0.0, 0.0, 1.0), L3D.createVector3(0.3, 0.3, 0.3) );
pointLight.translate(0, 4, 4);
scene.add(pointLight);

var ambientLight = new L3D.AmbientLight(L3D.createVector3(0.0, 0.0, 0.2));
scene.add(ambientLight);

window.requestAnimationFrame(draw);

// Rendering loop.
function draw(timestamp){
    scene.renderScene(gl);
    cube.rotate(1/500, 0, 1, 0); // Rotate cube around Y axis
    window.requestAnimationFrame(draw);
}
```
