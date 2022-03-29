var gl;
var scene; // Scene to be rendered to texture
var scene2; // Scene to be rendered to canvas
var rTex; // Render Texture object

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

    // Scene to be rendered to texture, two red spheres one orbiting the other.
    scene = new Scene();

    let camera = new Camera(0.52, 1, 1, 100);
    scene.add(camera);
    scene.setActiveCamera(camera);
    scene.setClearColor(0.5, 0.5, 1.0, 1.0);
    camera.transformLookAt(0, 4, 9, 0, 0, 0, 0, 1, 0);

    var bpMaterial = new BlinnPhongMat(1.0, 1.0, 1.0, 64);

    var geometry1 = new Sphere(1, 24, 12);
    var object1 = new MeshObject(geometry1, bpMaterial);
    scene.add(object1);

    var geometry2 = new Sphere(0.5, 24, 12);
    var object2 = new MeshObject(geometry2, bpMaterial);
    object2.translate(0,0,2);
    scene.add(object2);
    
    object1.addChild(object2);

    var dl = new DirectionalLight( createVector3(1.0, 0.0, 0.0), createVector3(0.8, 0.8, 0.8), createVector3(0, -1, 0) );
    scene.add(dl);

    // Scene to be rendered to canvas. Draw single cube with render texture applied.
    scene2 = new Scene();

    let camera2 = new Camera(0.52, 1, 10, 25);
    camera2.transformLookAt(0, 5, 14, 0, 0, 0, 0, 1, 0);
    scene2.setActiveCamera( camera2 );
    scene2.setClearColor(0.5/4, 0.5/4, 1.0/4, 1.0);
    scene2.add(camera2);

    rTex = new RenderTexture(640, 640);
    var geometry3 = new Cube(3, 3, 3);
    var cube = new MeshObject(geometry3, rTex);
    scene2.add(cube);
    cube.rotate(-1.5708*2, 1, 0, 0);

    window.requestAnimationFrame(draw);
}

function draw(timestamp){
    scene.renderSceneToTarget(gl, rTex); // Render scene1 to texture
    scene2.renderScene(gl); // Render scene2 to canvas
    scene.objectList[1].rotate(1/500, 0, 1, 0); // Make sphere 2 orbit sphere 1
    scene2.objectList[1].rotate(-1/500, 0, 1, 0); // Make cube rotate on y axis.
    window.requestAnimationFrame(draw);
}