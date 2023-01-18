import { Material } from './Material.js';

export class BasicTex extends Material{
    isTextured = true;
    textureInitialized = false;

    VSHADER_SOURCE=
    `attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    attribute vec4 a_Normal;

    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;    // Model matrix
    uniform mat4 u_NormalMatrix;   // Transformation matrix of the normal

    varying vec2 v_TexCoord;

    void main() {
        gl_Position = u_ViewMatrix * a_Position;
        v_TexCoord = a_TexCoord;
        a_Normal;
    }`;

    FSHADER_SOURCE = 
    `precision mediump float;
    uniform sampler2D u_texture;

    varying vec2 v_TexCoord;

    void main() {
        gl_FragColor = texture2D(u_texture, v_TexCoord);
    }`;

    constructor(texture){
        super();
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;
        this.textureName = texture;
        //this.initializeTexture(texture);
    }

    initializeMaterial(gl,lights){
        if(!this.textureInitialized) this.initializeTexture(gl, this.textureName);
    }

    initializeTexture(gl, textureName){
        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0+0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // Placeholder color fill until image is loaded
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));

        var image = new Image();
        image.src = textureName;
        image.addEventListener('load', function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

        this.textureInitialized = true;
    }
}