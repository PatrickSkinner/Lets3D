class NormalMat extends Material{
    VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;\n' +

    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal

    'varying vec3 v_Normal;\n' +

    'void main() {\n'+
        'gl_Position = u_ViewMatrix * a_Position;\n'+
        'v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+ // Normalise length to 1
        'a_Color;\n'+
    '}\n';

    FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'varying vec3 v_Normal;\n' +

    'void main() {\n' +
        'vec3 normal = normalize(v_Normal);\n'+
        // Convert normal components with range (-1, 1) to colors components with range (0, 1)
        'float red = (1.0+normal.r)/2.0;\n'+
        'float green = (1.0+normal.g)/2.0;\n'+
        'float blue = (1.0+abs(normal.b))/2.0;\n'+
        'gl_FragColor = vec4( red, green, blue, 1.0);\n' +
    '}\n';

    constructor(){
        super();
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;
    }

    initializeMaterial(){
        var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
        var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
        var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        var lightPosition = createVector3(0, 5, 10);
        gl.uniform3fv(u_LightPosition, lightPosition);
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    }
}