import { Material } from './Material.js';
import { createVector4 } from '../Core.js'

export class BasicMat extends Material{
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
    'uniform vec4 u_Color;\n' +   // Material Color

    'void main() {\n' +
        'gl_FragColor = u_Color;\n' +
    '}\n';

    constructor(colorR, colorG, colorB){
        super();
        this.color = createVector4(colorR, colorG, colorB, 1.0);
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;
    }

    initializeMaterial(gl, lights){
        var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
        gl.uniform4f(u_Color, this.color[0], this.color[1], this.color[2], this.color[3]);
    }
}