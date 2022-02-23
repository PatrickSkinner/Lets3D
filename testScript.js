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

    var geometry1 = new Cylinder(1, 2, 24);
    var material1 = new BlinnPhongMat();
    var object1 = new MeshObject(geometry1, material1);
    scene.add(object1);

    var geometry2 = new Cube(2, 2, 2);
    var object2 = new MeshObject(geometry2, material1);
    object2.translate(2.6, 0, 0);
    scene.add(object2);

    object1.addChild(object2);

    let camera = new Camera(0.52, 1, 1, 100);
    //camera.transformLookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    camera.transformLookAt(0, 6, 12, 0, 0, 0, 0, 1, 0);
    scene.setActiveCamera( camera );

    scene.setClearColor(0.5 ,0.5 ,1.0 ,1.0);
    scene.showNormals = true; // Visualise vertex normals
    
    window.requestAnimationFrame(draw);
}

function draw(timestamp){
    scene.renderScene(gl);
    scene.objectList[0].rotate(1/500, 0, 1, 0);
    scene.objectList[1].rotate(-1/200, 1, 0, 0);
    window.requestAnimationFrame(draw);
}