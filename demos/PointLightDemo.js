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
    scene.showLights = true;

    let pivot = new Object3D();
    scene.add(pivot);
    
    let camera = new Camera(0.52, 1, 10, 25);
    camera.transformLookAt(0, 4, 16, 0, 0, 0, 0, 1, 0);
    scene.setActiveCamera( camera );
    scene.setClearColor(0.09, 0.09, 0.198, 1.0);
    scene.add(camera);
    pivot.addChild(camera);

    var bpMaterial = new BlinnPhongMat(1.0, 1.0, 1.0, 64);

    var sphereGeometry = new Sphere(1.5, 32, 32/2);
    var sphere = new MeshObject(sphereGeometry, bpMaterial);
    sphere.translate(1.75, 0.5, -0.5);
    scene.add(sphere);

    var cube = new MeshObject(sphereGeometry, bpMaterial);
    cube.translate(-1.75, 0.5, -0.5);
    scene.add(cube);

    var bpMaterial2 = new BlinnPhongMat(1.0, 1.0, 1.0, 255);
    var planeGeometry = new Plane(8, 8);
    var plane = new MeshObject(planeGeometry, bpMaterial2);
    scene.add(plane);
    plane.translate(0,-1, 0);
    plane.rotate(-1.5708, 1, 0, 0);

    var pointLight1 = new PointLight(createVector3(0.0, 0.5, 1.0), createVector3(0.3, 0.3, 0.3) );
    pointLight1.translate(1.75, 1, 3);
    scene.add(pointLight1);

    var pointLight2 = new PointLight(createVector3(1.0, 0.0, 0.5), createVector3(0.3, 0.3, 0.3) );
    pointLight2.translate(-1.75, 1, 3);
    scene.add(pointLight2);

    var ambientLight = new AmbientLight(createVector3(0.1, 0.1, 0.2));
    scene.add(ambientLight);

    window.requestAnimationFrame(draw);
}

function draw(timestamp){
    scene.renderScene(gl);
    scene.objectList[1].rotate(1/500,0,1,0);
    window.requestAnimationFrame(draw);
}