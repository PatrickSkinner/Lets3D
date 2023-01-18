import { Material } from './Material.js';

export class NormalMat extends Material{
    VSHADER_SOURCE=
    `attribute vec4 a_Position;
    attribute vec4 a_Normal;

    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;    // Model matrix
    uniform mat4 u_NormalMatrix;   // Transformation matrix of the normal

    varying vec3 v_Normal;

    void main() {
        gl_Position = u_ViewMatrix * a_Position;
        mat4 vnMat = u_ViewMatrix;
        vnMat[3][0] = 0.0;
        vnMat[3][1] = 0.0;
        vnMat[3][2] = 0.0;
        vec3 world_Normal = normalize(vec3( vnMat * a_Normal)); // Normalise length to 1
        v_Normal = world_Normal;
    }`;

    FSHADER_SOURCE = 
    `precision mediump float;
    varying vec3 v_Normal;

    void main() {
        vec3 normal = normalize(v_Normal);
        // Convert normal components with range (-1, 1) to colors components with range (0, 1)
        float red = (1.0+normal.r)/2.0;
        float green = (1.0+normal.g)/2.0;
        float blue = (1.0+abs(normal.b))/2.0;
        gl_FragColor = vec4( red, green, blue, 1.0);
    }`;

    constructor(){
        super();
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;
    }

    initializeMaterial(gl, lights){
    }
}