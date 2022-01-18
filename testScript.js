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

    let cube = new Cube(1, 1, 1);

    var n = initVertexBuffers(gl, cube);
    if (n < 0){
        console.log("Failed to set vertex position");
        return;
    }

    // Set the eye point and the viewing volume
    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    gl.uniformMatrix4fv(u_ViewMatrix, false, mvpMatrix.elements);

    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0); // Set light color to white
    var lightDirection = new Vector3([0.5,3.0,4.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_LightDirection, lightDirection.elements);
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

    gl.clearColor(0,0,0,1);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl, geometryPrimitive){

    var vertices = geometryPrimitive.vertices;
    var indices = geometryPrimitive.indices;
    var normals = geometryPrimitive.normals;

    // Placeholder color insertion
    var colors = new Float32Array([     // Colors
       0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // blue
       0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // blue
       0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // green
       0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // green
       1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // red
       1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // red
    ]);

    var indexBuffer = gl.createBuffer();
    if( !indexBuffer){
        console.log("Failed to create buffer object");
        return -1;
    }

    initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color');
    initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal');

    //Write the indices to buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}
