class NormalMat extends Material{
    VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal;\n' +

    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal

    'varying vec3 v_Normal;\n' +

    'void main() {\n'+
        'gl_Position = u_ViewMatrix * a_Position;\n'+
        'mat4 vnMat = u_ViewMatrix;\n'+
        'vnMat[3][0] = 0.0;\n'+
        'vnMat[3][1] = 0.0;\n'+
        'vnMat[3][2] = 0.0;\n'+
        'vec3 world_Normal = normalize(vec3( vnMat * a_Normal));\n'+ // Normalise length to 1
        'v_Normal = world_Normal;\n'+
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

    initializeMaterial(lights){
    }
}