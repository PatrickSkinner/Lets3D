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
        console.log("Failed initialise WebGL.");
        return;
    }

    scene = new Scene();

    let pivot = new Object3D();
    scene.add(pivot);
    let camera = new Camera(0.52, 1, 1, 100);
    camera.transformLookAt(0, 4, 12, 0, 0, 0, 0, 1, 0);

    scene.setActiveCamera( camera );

    scene.setClearColor(0.5, 0.5, 1.0, 1.0);
    scene.showNormals = false; // Visualise vertex normals
    scene.showLights = true; // Visualise lights
    scene.add(camera);
    pivot.addChild(camera);

    var geometry1 = new Cube(2,2,2);
    var material1 = new BlinnPhongTex("carmackpo2.png", 64.0);
    var object1 = new MeshObject(geometry1, material1);
    scene.add(object1);

    var geometry2 = new Sphere(0.5, 24, 12);
    var material2 = new BlinnPhongMat(1.0, 1.0, 1.0, 64);
    var object2 = new MeshObject(geometry2, material2);
    object2.translate(0,0,2);
    scene.add(object2);
    pivot.addChild(object2);

    var pl = new PointLight(createVector3(1.0, 0.0, 0.0), createVector3(0.8, 0.8, 0.8) );
    pl.translate(-10, 5, 10);
    //scene.add(pl);

    var pl2 = new PointLight(createVector3(0.0, 0.0, 1.0), createVector3(0.8, 0.8, 0.8) );
    pl2.translate(2, 1.5, 2);
    scene.add(pl2);

    var dl = new DirectionalLight( createVector3(1.0, 0.0, 0.0), createVector3(0.8, 0.8, 0.8), createVector3(0, -1, 0) );
    dl.setPosition(0,2,0);
    scene.add(dl);

    var dl2 = new DirectionalLight( createVector3(1.0, 0.0, 0.0), createVector3(0.8, 0.8, 0.8), createVector3(1, 1, 0) );
    //scene.add(dl2);

    var al = new AmbientLight( createVector3(0.1, 0.1, 0.1));
    //scene.add(al);

    window.requestAnimationFrame(draw);
}

function draw(timestamp){
    scene.renderScene(gl);
    scene.objectList[1].rotate(-1/500, 0, 1, 0);
    window.requestAnimationFrame(draw);
}