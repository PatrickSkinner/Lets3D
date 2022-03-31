import { Material } from './Material.js';
import { PointLight } from '../object/lighting/PointLight.js';
import { DirectionalLight } from '../object/lighting/DirectionalLight.js';
import { AmbientLight } from '../object/lighting/AmbientLight.js';

export class BlinnPhongTex extends Material{
    isTextured = true;
    textureInitialized = false;

    VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal;\n' +
    'attribute vec2 a_TexCoord;\n' +

    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal

    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec2 v_TexCoord;\n' +

    'void main() {\n'+
        'gl_Position = u_ViewMatrix * a_Position;\n'+
        'v_Position = vec3(u_ModelMatrix * a_Position);\n' + // Vertex position in world coords
        'v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+ // Normalise length to 1
        'v_TexCoord = a_TexCoord;\n'+
    '}\n';

    FSHADER_SOURCE = 
    '#define MAX_POINT_LIGHTS 64\n'+  
    'precision mediump float;\n' +
    'precision mediump int;\n' +

    'struct PointLight {\n' +   
        'vec3 position;\n' +   
        'vec3 diffuse;\n' +   
        'vec3 specular;\n' +   
    '};\n' +

    'struct DirectionalLight {\n' +  
        'vec3 direction;\n'+ 
        'vec3 position;\n' +   
        'vec3 diffuse;\n' +   
        'vec3 specular;\n' +   
    '};\n' +

    'uniform sampler2D u_texture;\n'+
    'uniform DirectionalLight dirLight;\n'+
    'uniform PointLight pointLights[MAX_POINT_LIGHTS];\n'+
    'uniform int u_numLights;\n'+

    'uniform vec3 u_CameraPosition;\n' + // Position of the camera
    'uniform float u_SpecularAmount;\n' +   // How shiny the surface is
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color

    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec2 v_TexCoord;\n' +

    'vec3 CalcPointLight( PointLight light, vec3 normal, vec3 viewDirection){\n' +   
        'vec3 lightDirection = light.position- v_Position;\n' + 
        'lightDirection = normalize(lightDirection);\n' + // Normalised light direction

        'float nDotL = max( dot(lightDirection, normal), 0.0);\n' +
        'float specular = 0.0;\n'+

        'if (nDotL > 0.0) {\n'+
            'vec3 halfwayVector = normalize(lightDirection + viewDirection);\n'+
            'float specularAngle = max( dot(halfwayVector, normal), 0.0);\n'+
            'specular = pow(specularAngle, u_SpecularAmount);\n'+
        '}\n'+

        'vec4 texColor = texture2D(u_texture, v_TexCoord);\n'+
        'vec3 color =  (light.diffuse* texColor.rgb * nDotL) + (light.specular * specular);\n' +
        'return color;\n'+
    '}\n' +   

    'vec3 CalcDirectionalLight( DirectionalLight light, vec3 normal, vec3 viewDirection){\n' +   
        'vec3 lightDirection = -normalize(light.direction);\n' + // Normalised light direction

        'float nDotL = max( dot(lightDirection, normal), 0.0);\n' +
        'float specular = 0.0;\n'+

        'if (nDotL > 0.0) {\n'+
            'vec3 halfwayVector = normalize(lightDirection + viewDirection);\n'+
            'float specularAngle = max( dot(halfwayVector, normal), 0.0);\n'+
            'specular = pow(specularAngle, u_SpecularAmount);\n'+
        '}\n'+

        'vec4 texColor = texture2D(u_texture, v_TexCoord);\n'+
        'vec3 color =  (light.diffuse* texColor.rgb * nDotL) + (light.specular * specular);\n' +
        'return color;\n'+
    '}\n' + 

    'void main() {\n' +
        'vec3 normal = normalize(v_Normal);\n' + // Normalise interpolated normal
        'vec3 viewDirection = normalize(v_Position);\n'+
        'vec4 texColor = texture2D(u_texture, v_TexCoord);\n'+
        'vec3 result;\n'+
        'for(int i = 0; i < MAX_POINT_LIGHTS; i++){\n'+ // TODO: This should be u_numLights
            'result += CalcPointLight(pointLights[i], normal, viewDirection);\n'+
        '}\n'+

        'result += CalcDirectionalLight(dirLight, normal, viewDirection);\n'+

        'result += (u_AmbientLight*texColor.rgb);\n'+
        
        'gl_FragColor = vec4(result.rgb, texColor.a);\n' +
    '}\n';

    constructor(texture, shininess){
        super();
        this.shininess = shininess;
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;
        this.textureName = texture;
        //this.initializeTexture(texture);
    }

    initializeMaterial(gl, lights){
        if(!this.textureInitialized) this.initializeTexture(gl, this.textureName);
        var u_SpecularAmount = gl.getUniformLocation(gl.program, 'u_SpecularAmount');
        gl.uniform1f(u_SpecularAmount, this.shininess);

        var u_numLights = gl.getUniformLocation(gl.program, 'u_numLights');
        gl.uniform1i(u_numLights, lights.length);

        for(var i = 0; i < lights.length; i++){        
            if(lights[i] instanceof PointLight){
                let pos = lights[i].getPosition();
                let dif = lights[i].diffuse;
                let spec = lights[i].specular;
                gl.uniform3f(gl.getUniformLocation(gl.program, "pointLights["+i+"].position"), pos[0], pos[1], pos[2]);
                gl.uniform3f(gl.getUniformLocation(gl.program, "pointLights["+i+"].diffuse"), dif[0], dif[1], dif[2]);
                gl.uniform3f(gl.getUniformLocation(gl.program, "pointLights["+i+"].specular"), spec[0], spec[1], spec[2]);
            }

            if(lights[i] instanceof DirectionalLight){
                let pos = lights[i].getPosition();
                let dif = lights[i].diffuse;
                let spec = lights[i].specular;
                let dir = lights[i].direction;
                gl.uniform3f(gl.getUniformLocation(gl.program, "dirLight.position"), pos[0], pos[1], pos[2]);
                gl.uniform3f(gl.getUniformLocation(gl.program, "dirLight.diffuse"), dif[0], dif[1], dif[2]);
                gl.uniform3f(gl.getUniformLocation(gl.program, "dirLight.specular"), spec[0], spec[1], spec[2]);
                gl.uniform3f(gl.getUniformLocation(gl.program, "dirLight.direction"), dir[0], dir[1], dir[2]);
            }

            if(lights[i] instanceof AmbientLight){
                var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
                gl.uniform3fv(u_AmbientLight, lights[i].ambient);
            }
        }
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