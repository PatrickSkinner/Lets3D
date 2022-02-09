var gl;
var scene;

function main(){
    var VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;\n' +

    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal

    'varying vec4 v_Color;\n' +
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +

    'void main() {\n'+
        'gl_Position = u_ViewMatrix * a_Position;\n'+
        'v_Position = vec3(u_ModelMatrix * a_Position);\n' + // Vertex position in world coords
        'v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+ // Normalise length to 1
        'v_Color = a_Color;\n'+
    '}\n';


    var FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform vec3 u_LightColor;\n' +     // Light color
    'uniform vec3 u_LightPosition;\n' +  // Position of the light source
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
        'vec3 normal = normalize(v_Normal);\n' + // Normalise interpolated normal
        'vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' + // Normalised light direction
        'float nDotL = max(dot(lightDirection, normal), 0.0);\n' +

        // Combine diffuse and ambient for final colour.
        'vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
        'vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
        'gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
    '}\n';

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
    var cubeGeom = new Cube(1,1,1);

    /*
    var cubeMat = new Material();
    cubeMat.fragmentShader = FSHADER_SOURCE;
    cubeMat.vertexShader = VSHADER_SOURCE;
    */
    var cubeMat = new BlinnPhongMat();

    var cube = new MeshObject(cubeGeom, cubeMat);
    scene.add(cube);

    /*
    var cubeGeom2 = new Cube(1.5, 0.5, 0.5);
    var cube2 = new MeshObject(cubeGeom2, cubeMat);
    cube2.rotate(40, 1, 0, 0);
    scene.add(cube2);
    */

    let camera = new Camera(30, 1, 1, 100);
    camera.transformLookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    scene.setActiveCamera( camera );

    scene.setClearColor(0.25,0.25,0.25,1);
    scene.showNormals = true;
    
    window.requestAnimationFrame(draw);
}

function draw(timestamp){
    scene.renderScene(gl);
    scene.objectList[0].rotate(1/5, 0, 1, 0);
    window.requestAnimationFrame(draw);
}