import { Light } from './Light.js';
import { createVector3, initArrayBuffer } from '../../Core.js'

export class PointLight extends Light{

    constructor(diffuse, specular){
        super();
        this.diffuse = diffuse;
        this.specular = specular;
    }

    /**
     * Create the appropriate vertices/indices to visualise a point light.
     * @param gl The WebGL context
     * @returns 
     */
     initHelperBuffer(gl){
        var vertices = [];

        var dist = 0.15;
        vertices[0] = createVector3( 0, dist*1.5, 0 );
        vertices[1] = createVector3( 0, -dist*1.5, 0 );
        vertices[2] = createVector3( dist, 0, -dist );
        vertices[3] = createVector3( dist, 0, dist );
        vertices[4] = createVector3( -dist, 0, -dist );
        vertices[5] = createVector3( -dist, 0, dist );

        var verticeComponents = [];
        for(var i = 0; i < vertices.length; i++){
            for(var j = 0; j < 3; j++){
                verticeComponents.push(vertices[i][j]);
            }
        }

        this.indices =  [0,2, 0,3, 0,4, 0,5,
                        1,2, 1,3, 1,4, 1,5,
                        2,3, 2,4, 4,5, 3,5];

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