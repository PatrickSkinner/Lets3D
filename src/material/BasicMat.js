import { Material } from './Material.js';
import { createVector4 } from '../Core.js'

export class BasicMat extends Material{
    VSHADER_SOURCE=
    `attribute vec4 a_Position;
    attribute vec4 a_Normal;

    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;    // Model matrix
    uniform mat4 u_NormalMatrix;   // Transformation matrix of the normal

    void main() {
        gl_Position = u_ViewMatrix * a_Position;
        a_Normal;
    }`;

    FSHADER_SOURCE = 
    `precision mediump float;
    uniform vec4 u_Color;   // Material Color

    void main() {
        gl_FragColor = u_Color;
    }`;

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