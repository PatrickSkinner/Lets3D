function main(){
    var VSHADER_SOURCE=
        'attribute vec4 a_Position;\n'+
        'attribute vec4 a_Color;\n'+
        'varying vec4 v_Color;\n'+
        'attribute vec4 a_Normal;\n'+
        'uniform mat4 u_ViewMatrix;\n'+
        'uniform vec3 u_LightColor;\n'+
        'uniform vec3 u_LightDirection;\n'+ //World coordinate, normalized
        'uniform vec3 u_AmbientLight;\n' +

        'void main() {\n'+
            'gl_Position = u_ViewMatrix * a_Position;\n'+
            'vec3 normal = normalize(vec3(a_Normal));\n'+ // Normalise length to 1
            'float nDotL = max(dot(u_LightDirection, normal), 0.0);\n'+
            'vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n'+
            'vec3 ambient = u_AmbientLight * a_Color.rgb;\n'+
            'v_Color = vec4(diffuse+ambient, a_Color.a);\n'+ // Pass vertex color to fragment shader
        '}\n';

    var FSHADER_SOURCE = 
        'precision mediump float;\n'+
        'varying vec4 v_Color;\n'+
        'void main() {\n'+
            ' gl_FragColor = v_Color;\n'+
        '}\n';

    var canvas = document.getElementById('example');
    if(!canvas){
        console.log('Failed to retrieve canvas element');
        return;
    }

    var gl = canvas.getContext("webgl2");
    if(!gl){
        console.log("Failed initialise WebGL.");
        return;
    }

    if( !initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE )){
        console.log('Failed to init shaders.');
        return;
    }

    let scene = new Scene();
    var cubeGeom = new Cube(1, 1, 1);
    var cube = new MeshObject(cubeGeom, 0);
    scene.add(cube);

    let camera = new Camera(30, 1, 1, 100);
    camera.transformLookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    camera.setActiveCamera(gl);

    scene.objectList[0].draw(gl);
}