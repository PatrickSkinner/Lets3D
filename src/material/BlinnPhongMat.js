import { Material } from './Material.js';
import { PointLight } from '../object/lighting/PointLight.js';
import { DirectionalLight } from '../object/lighting/DirectionalLight.js';
import { SpotLight } from '../object/lighting/SpotLight.js';
import { AmbientLight } from '../object/lighting/AmbientLight.js';
import { createVector3, createVector4 } from '../Core.js'

export class BlinnPhongMat extends Material{
    VSHADER_SOURCE=
    `attribute vec4 a_Position;
    attribute vec4 a_Normal;

    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;    // Model matrix
    uniform mat4 u_NormalMatrix;   // Transformation matrix of the normal
    uniform vec4 u_Color;   // Material Color

    varying vec4 v_Color;
    varying vec3 v_Normal;
    varying vec3 v_Position;

    void main() {
        gl_Position = u_ViewMatrix * a_Position;
        v_Position = vec3(u_ModelMatrix * a_Position); // Vertex position in world coords
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal)); // Normalise length to 1
        v_Color = u_Color;
    }`;

    FSHADER_SOURCE = 
    `
    #define MAX_POINT_LIGHTS 64  
    precision mediump float;
    precision mediump int;

    struct PointLight {   
        vec3 position;   
        vec3 diffuse;   
        vec3 specular;   
    };

    struct DirectionalLight {  
        vec3 direction; 
        vec3 position;   
        vec3 diffuse;   
        vec3 specular;   
    };

    struct SpotLight {  
        vec3 direction; 
        vec3 position;   
        vec3 diffuse;   
        vec3 specular;   
        float cutoff;
    };

    uniform PointLight pointLights[MAX_POINT_LIGHTS];
    uniform int u_numLights;
    uniform DirectionalLight dirLight;
    uniform SpotLight sptLight;

    uniform vec3 u_CameraPosition; // Position of the camera
    uniform float u_SpecularAmount;   // How shiny the surface is
    uniform vec3 u_AmbientLight;   // Ambient light color

    varying vec3 v_Normal;
    varying vec3 v_Position;
    varying vec4 v_Color;

    vec3 CalcPointLight( PointLight light, vec3 normal, vec3 viewDirection){   
        vec3 lightDirection = light.position- v_Position; 
        lightDirection = normalize(lightDirection); // Normalised light direction

        float nDotL = max( dot(lightDirection, normal), 0.0);
        float specular = 0.0;

        if (nDotL > 0.0) {
            vec3 halfwayVector = normalize(lightDirection + viewDirection);
            float specularAngle = max( dot(halfwayVector, normal), 0.0);
            specular = pow(specularAngle, u_SpecularAmount);
        }

        vec3 color =  (light.diffuse* v_Color.rgb * nDotL) + (light.specular * specular);
        return color;
    }   

    vec3 CalcDirectionalLight( DirectionalLight light, vec3 normal, vec3 viewDirection){   
        vec3 lightDirection = -normalize(light.direction); // Normalised light direction

        float nDotL = max( dot(lightDirection, normal), 0.0);
        float specular = 0.0;

        if (nDotL > 0.0) {
            vec3 halfwayVector = normalize(lightDirection + viewDirection);
            float specularAngle = max( dot(halfwayVector, normal), 0.0);
            specular = pow(specularAngle, u_SpecularAmount);
        }

        vec3 color =  (light.diffuse* v_Color.rgb * nDotL) + (light.specular * specular);
        return color;
    } 

    vec3 CalcSpotLight( SpotLight light, vec3 normal, vec3 viewDirection){   
        vec3 lightDirection = normalize(light.position - v_Position);
        vec3 spotlightDirection = -normalize(light.direction);
        float theta = dot(lightDirection, spotlightDirection);

        if(theta > light.cutoff){
            float nDotL = max( dot(lightDirection, normal), 0.0);
            float specular = 0.0;

            if (nDotL > 0.0) {
                vec3 halfwayVector = normalize(lightDirection + viewDirection);
                float specularAngle = max( dot(halfwayVector, normal), 0.0);
                specular = pow(specularAngle, u_SpecularAmount);
            }

            vec3 color =  (light.diffuse* v_Color.rgb * nDotL) + (light.specular * specular);
            return color;
        }
        vec3 color =  vec3(0,0,0);
        return color;
    }

    void main() {
        vec3 normal = normalize(v_Normal); // Normalise interpolated normal
        vec3 viewDirection = normalize(v_Position);
        vec3 result;
        for(int i = 0; i < MAX_POINT_LIGHTS; i++){ // TODO: This should be u_numLights
            result += CalcPointLight(pointLights[i], normal, viewDirection);
        }

        result += CalcDirectionalLight(dirLight, normal, viewDirection);
        result += CalcSpotLight(sptLight, normal, viewDirection);

        result += (u_AmbientLight*v_Color.rgb);
        
        gl_FragColor = vec4(result, v_Color.a);
    }
    `;

    constructor(colorR, colorG, colorB, shininess){
        super();
        this.color = createVector4(colorR, colorG, colorB, 1.0);
        this.shininess = shininess;
        this.vertexShader = this.VSHADER_SOURCE;
        this.fragmentShader = this.FSHADER_SOURCE;
    }

    initializeMaterial(gl, lights){

        var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
        gl.uniform4f(u_Color, this.color[0], this.color[1], this.color[2], this.color[3]);

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

            if(lights[i] instanceof SpotLight){
                let pos = lights[i].getPosition();
                let dif = lights[i].diffuse;
                let dir = lights[i].direction;
                gl.uniform3f(gl.getUniformLocation(gl.program, "sptLight.position"), pos[0], pos[1], pos[2]);
                gl.uniform3f(gl.getUniformLocation(gl.program, "sptLight.diffuse"), dif[0], dif[1], dif[2]);
                gl.uniform3f(gl.getUniformLocation(gl.program, "sptLight.direction"), dir[0], dir[1], dir[2]);
                gl.uniform1f(gl.getUniformLocation(gl.program, "sptLight.cutoff"), lights[i].cutoff);
            }

            if(lights[i] instanceof AmbientLight){
                var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
                gl.uniform3f(u_AmbientLight, lights[i].ambient[0], lights[i].ambient[1], lights[i].ambient[2]);
            }
            
        }
    }
}