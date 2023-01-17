import { Light } from './Light.js';
import { createVector3, initArrayBuffer } from '../../Core.js'

export class DirectionalLight extends Light{

    constructor(diffuse, specular, direction){
        super();
        this.diffuse = diffuse;
        this.specular = specular;
        this.direction = direction;

        var pos = super.getPosition()
        var origin = createVector3(pos[0], pos[1], pos[2]);
        var facing = vec3.create();
        vec3.add(facing, origin, direction);
        
        var transform = mat4.create();
        mat4.targetTo(transform, origin, facing, createVector3(0,1,-1));

        super.transform = transform;
    }

    /**
     * Create the appropriate vertices/indices to visualize a directional light.
     * @param gl The WebGL context
     * @returns 
     */
    initHelperBuffer(gl){
        var vertices = [];

        var dist = 0.25;
        vertices[0] = createVector3(dist, -dist, 0);
        vertices[1] = createVector3(dist, dist, 0);
        vertices[2] = createVector3(-dist, -dist, 0);
        vertices[3] = createVector3(-dist, dist, 0);

        vertices[4] = createVector3(0, 0, 0);
        vertices[5] = createVector3(0, 0, -(dist*2));

        var verticeComponents = [];
        for(var i = 0; i < vertices.length; i++){
            for(var j = 0; j < 3; j++){
                verticeComponents.push(vertices[i][j]);
            }
        }

        this.indices =  [0,1, 0,2, 2,3, 1,3, 4,5];

        this.vertexBuffer = initArrayBuffer(gl, new Float32Array(verticeComponents), 3, gl.FLOAT, 'a_Position');

        // Create buffer to handle indices
        this.indexBuffer = gl.createBuffer();
        if( !this.indexBuffer){
            console.log("Failed to create buffer object");
            return -1;
        }

        // Write the indices to buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint32Array.from(this.indices), gl.STATIC_DRAW);

        return this.indices.length; // return number of indices
    }
}