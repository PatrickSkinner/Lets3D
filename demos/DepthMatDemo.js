var gl;
var scene;

function main(){
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

    scene = new Scene();

    let pivot = new Object3D();
    scene.add(pivot);

    let camera = new Camera(0.52, 1, 10, 25);
    camera.transformLookAt(0, 4, 16, 0, 0, 0, 0, 1, 0);
    scene.setActiveCamera( camera );
    scene.setClearColor(0.5, 0.5, 1.0, 1.0);
    scene.add(camera);
    pivot.addChild(camera);

    var depthMaterial = new DepthMat();

    var cubeGeometry = new Cube(2,2,2);
    var cube = new MeshObject(cubeGeometry, depthMaterial);
    scene.add(cube);

    var planeGeometry = new Plane(8, 8);
    var plane = new MeshObject(planeGeometry, depthMaterial);
    scene.add(plane);
    plane.translate(0,-1, 0);
    plane.rotate(1.5708, 1, 0, 0);

    window.requestAnimationFrame(draw);
}

function draw(timestamp){
    scene.renderScene(gl);
    scene.objectList[1].rotate(1/500,0,1,0);
    window.requestAnimationFrame(draw);
}