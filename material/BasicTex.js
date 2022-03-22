class BasicTex extends Material{
    VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'attribute vec4 a_Normal;\n' +

    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal

    'varying vec2 v_TexCoord;\n' +

    'void main() {\n'+
        'gl_Position = u_ViewMatrix * a_Position;\n'+
        'v_TexCoord = a_TexCoord;\n'+
        'a_Normal;\n'+
    '}\n';

    FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform sampler2D u_texture;\n'+

    'varying vec2 v_TexCoord;\n' +

    'void main() {\n' +
        'gl_FragColor = texture2D(u_texture, v_TexCoord);\n' +
    '}\n';

    constructor(){
        super();
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;

        this.initializeTexture('/carmackpo2.png');
    }

    initializeMaterial(lights){
    }

    initializeTexture(textureName){
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
    }
}