import { Material } from './Material.js';

export class DepthMat extends Material{
    VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal;\n' +

    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
    'void main() {\n'+
        'gl_Position = u_ViewMatrix * a_Position;\n'+
        'a_Normal;\n'+
    '}\n';

    FSHADER_SOURCE = 
    'precision mediump float;\n' +

    'uniform float u_Near;\n'+
    'uniform float u_Far;\n'+
  
    'void main(){\n' +         
        'float depth = 1.0 - gl_FragCoord.z;\n' + // Invert so closer pixels are lighter
        'gl_FragColor = vec4( vec3(depth), 1.0);\n' +
    '}\n';


    constructor(){
        super();
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;
    }

    initializeMaterial(gl, lights){
    }
}