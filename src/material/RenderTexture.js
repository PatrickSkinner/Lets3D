import { Material } from './Material.js';

export class RenderTexture extends Material{
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
    }`

    FSHADER_SOURCE = 
    `precision mediump float;
    uniform sampler2D u_texture;

    varying vec2 v_TexCoord;

    void main() {
        gl_FragColor = texture2D(u_texture, v_TexCoord);
    }`;

    constructor(width, height){
        super();
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;

        this.width = width;
        this.height = height;

        //this.initializeTexture();
    }

    initializeMaterial(gl, lights){
        if(!this.textureInitialized) this.initializeTexture(gl);
    }

    initializeTexture(gl){
        this.fb = gl.createFramebuffer();
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        {
            const level = 0;
            const internalFormat = gl.RGBA;
            const border = 0;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                            this.width, this.height, border,
                            format, type, data);
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        const attachment = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D( gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture, 0);
    
        const depthTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        {
            const level = 0;
            const internalFormat = gl.DEPTH_COMPONENT24;
            const border = 0;
            const format = gl.DEPTH_COMPONENT;
            const type = gl.UNSIGNED_INT;
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                          this.width, this.height, border,
                          format, type, data);
           
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
        
        // Rebind texture to draw to surface
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.textureInitialized = true;
    }
}