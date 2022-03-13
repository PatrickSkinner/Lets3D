class GouraudMat extends Material{
    VSHADER_SOURCE=
    '#define MAX_POINT_LIGHTS 64\n'+  
    'precision mediump float;\n' +
    'precision mediump int;\n' +

    'struct PointLight {\n' +   
        'vec3 position;\n' +   

        'vec3 diffuse;\n' +   
        'vec3 specular;\n' +   
    '};\n' +

    'uniform PointLight pointLights[MAX_POINT_LIGHTS];\n'+
    'uniform int u_numLights;\n'+

    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;\n' +

    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
    'uniform vec4 u_Color;\n' +   // Material Color

    'varying vec4 v_Color;\n' +
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec3 v_LightColor;\n' +     // Diffuse light color

    'void CalcPointLight( PointLight light ){\n' +   
        'vec3 lightDirection = normalize(light.position - v_Position);\n' + 
        'float nDotL = max( dot(lightDirection, v_Normal), 0.0);\n' +
        'v_LightColor += nDotL*light.diffuse;\n'+
    '}\n' +   

    'void main() {\n'+
        'gl_Position = u_ViewMatrix * a_Position;\n'+
        'v_Position = vec3(u_ModelMatrix * a_Position);\n' + // Vertex position in world coords
        'v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+ // Normalise length to 1
        'v_Color = u_Color;\n'+
        'a_Color;\n'+        

        'for(int i = 0; i < MAX_POINT_LIGHTS; i++){\n'+ // TODO: This should be u_numLights
            'CalcPointLight(pointLights[i]);\n'+
        '}\n'+
    
    '}\n';

    FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform vec3 u_CameraPosition;\n' + // Position of the camera
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color

    'varying vec3 v_LightColor;\n' +     // Diffuse light color
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
        'vec3 color = (u_AmbientLight*v_Color.rgb) + (v_LightColor * v_Color.rgb);\n'+
        'gl_FragColor = vec4(color, v_Color.a);\n' +
    '}\n';

    constructor(colorR, colorG, colorB){
        super();
        this.color = createVector4(colorR, colorG, colorB, 1.0);
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;
    }

    initializeMaterial(lights){
        var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
        gl.uniform3f(u_AmbientLight, 0.1, 0.1, 0.1); // TODO: Get ambient from scene

        var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
        gl.uniform4f(u_Color, this.color[0], this.color[1], this.color[2], this.color[3]);

        var u_numLights = gl.getUniformLocation(gl.program, 'u_numLights');
        gl.uniform1i(u_numLights, lights.length);

        for(var i = 0; i < lights.length; i++){
            let pos = lights[i].getPosition();
            let dif = lights[i].diffuse;
            gl.uniform3f(gl.getUniformLocation(gl.program, "pointLights["+i+"].position"), pos[0], pos[1], pos[2]);
            gl.uniform3f(gl.getUniformLocation(gl.program, "pointLights["+i+"].diffuse"), dif[0], dif[1], dif[2]);
        }
    }
}