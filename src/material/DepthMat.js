import { Material } from './Material.js';

export class DepthMat extends Material{
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

    uniform float u_Near;
    uniform float u_Far;
  
    void main(){         
        float depth = 1.0 - gl_FragCoord.z; // Invert so closer pixels are lighter
        gl_FragColor = vec4( vec3(depth), 1.0);
    }`;


    constructor(){
        super();
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;
    }

    initializeMaterial(gl, lights){
    }
}