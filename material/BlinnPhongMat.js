class BlinnPhongMat extends Material{
    VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;\n' +

    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal

    'varying vec4 v_Color;\n' +
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +

    'void main() {\n'+
        'gl_Position = u_ViewMatrix * a_Position;\n'+
        'v_Position = vec3(u_ModelMatrix * a_Position);\n' + // Vertex position in world coords
        'v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+ // Normalise length to 1
        'v_Color = a_Color;\n'+
    '}\n';

    FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform vec3 u_CameraPosition;\n' + // Position of the camera
    'uniform vec3 u_LightPosition;\n' +  // Position of the light source
    'uniform vec3 u_LightColor;\n' +     // Diffuse light color
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
    'uniform vec3 u_SpecularColor;\n' +   // Specular light color
    'uniform float u_SpecularAmount;\n' +   // How shiny the surface is

    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
        'vec3 normal = normalize(v_Normal);\n' + // Normalise interpolated normal
        'vec3 lightDirection = u_LightPosition - v_Position;\n' + 
        'lightDirection = normalize(lightDirection);\n'+// Normalised light direction

        'float nDotL = max( dot(lightDirection, normal), 0.0);\n' +
        'float specular = 0.0;\n'+

        'if (nDotL > 0.0) {\n'+
            'vec3 viewDirection = normalize(v_Position);\n'+
            'vec3 halfwayVector = normalize(lightDirection + viewDirection);\n'+
            'float specularAngle = max( dot(halfwayVector, normal), 0.0);\n'+
            'specular = pow(specularAngle, u_SpecularAmount);\n'+
        '}\n'+

        'vec3 color = (u_AmbientLight*v_Color.rgb) + (u_LightColor * v_Color.rgb * nDotL) + (u_SpecularColor * specular * u_LightColor);\n' +
        'gl_FragColor = vec4(color, v_Color.a);\n' +
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
        var u_SpecularColor = gl.getUniformLocation(gl.program, 'u_SpecularColor');
        var u_SpecularAmount = gl.getUniformLocation(gl.program, 'u_SpecularAmount');

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        var lightPosition = createVector3(0, 5, 10);
        gl.uniform3fv(u_LightPosition, lightPosition);
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
        gl.uniform1f(u_SpecularAmount, 128);
        gl.uniform3f(u_SpecularColor, 1.0, 1.0, 1.0);
    }
}