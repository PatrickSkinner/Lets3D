// Combination of Mesh and Material
import { Object3D } from './Object3D.js';
import { initShaders, initArrayBuffer } from '../Core.js';

export class MeshObject extends Object3D{
    geometry;
    material;

    vertexBuffer;
    indexBuffer;
    normalBuffer;
    colorBuffer;
    vCount;
    program;

    nhVertexBuffer;
    nCount;
    normalHelperProgram;

    constructor( geom, mat ){
        super();
        this.geometry = geom;
        this.material = mat;
    }

    /**
     * Render this object from the perspective of a given camera.
     * @param gl WebGL context
     * @param camera Camera to render with
     * @returns 
     */
    draw(gl, camera, lights){
        if(!this.program){
            this.initializeMeshObject(gl); // This should only ever be called once
        } else {
            if(gl.program != this.program){
                //console.log("Switching programs");
                gl.useProgram(this.program);
                gl.program = this.program;

                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
                gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(a_Position);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
                let a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
                gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(a_Normal);

                if(this.geometry.textureCoords != null && this.material.isTextured){
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
                    let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
                    gl.vertexAttribPointer(a_TexCoord, 3, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(a_TexCoord);
                }

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            }
        }

        var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        var u_cameraMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
        var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

        var normalMatrix = mat4.create();
        var mvpMatrix = mat4.create();

        mat4.copy(mvpMatrix, camera.mvpMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, this.worldTransform);
        gl.uniformMatrix4fv(u_cameraMatrix, false, mvpMatrix);

        mat4.invert(normalMatrix, this.worldTransform);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.worldTransform);

        this.material.initializeMaterial(gl, lights);
        gl.drawElements(gl.TRIANGLES, this.vCount, gl.UNSIGNED_INT, 0);
    }

    initializeMeshObject(gl){
        console.log("Initializing new MeshObject");

        if( !initShaders(gl, this.material.vertexShader, this.material.fragmentShader )){
            console.log('Failed to init shaders');
            return;
        }

        this.program = gl.program;

        this.vCount = this.initVertexBuffers(gl, this.geometry);
        if (this.vCount < 0){
            console.log("Failed to set vertex position");
            return;
        }
    }

    /**
     * Create vertex buffers for a given primitive. Position/Color/Normal per vertex.
     * @param gl WebGL context
     * @param geometryPrimitive 3D geometry
     * @returns 
     */
    initVertexBuffers(gl, geometryPrimitive){
        var vertices = geometryPrimitive.vertices;
        var indices = geometryPrimitive.indices;
        var normals = geometryPrimitive.normals;
        var uvCoordinates = geometryPrimitive.textureCoords;

        this.indexBuffer = gl.createBuffer();
        if( !this.indexBuffer){
            console.log("Failed to create buffer object");
            return -1;
        }

        this.vertexBuffer = initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
        this.normalBuffer = initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal');
        if( uvCoordinates != null && this.material.isTextured) this.uvBuffer = initArrayBuffer(gl, uvCoordinates, 3, gl.FLOAT, 'a_TexCoord');

        // Write the indices to buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        return indices.length;
    }

    /**
     * Draws lines representing the normal of each vertice
     * @param {*} gl WebGL context
     * @param {*} camera The camera to render with
     * @returns 
     */
     drawNormals(gl, camera){
        if(!this.normalHelperProgram){
            this.initializeNormalHelpers(gl); // This should only ever be called once
        } else {
            if(gl.program != this.normalHelperProgram){
                gl.program = this.normalHelperProgram;
                gl.useProgram(this.normalHelperProgram);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.nhVertexBuffer);
                let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
                gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(a_Position);
            }
        }
        
        var u_cameraMatrix = gl.getUniformLocation(this.normalHelperProgram, 'u_ViewMatrix');
        var mvpMatrix = mat4.create();

        mat4.copy(mvpMatrix, camera.mvpMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, this.worldTransform);
        gl.uniformMatrix4fv(u_cameraMatrix, false, mvpMatrix);

        gl.drawArrays(gl.LINES, 0, this.nCount);
        
    }

    initializeNormalHelpers(gl){
        console.log("Initializing Normal Helpers");

        var VSHADER_SOURCE_NORMALS =
            'attribute vec4 a_Position;\n' +
            'uniform mat4 u_ViewMatrix;\n' +
            'void main() {\n' +
                'gl_Position = u_ViewMatrix * a_Position;\n'+
            '}\n';

        var FSHADER_SOURCE_NORMALS =
            'precision mediump float;\n' +
            'void main() {\n' +
               ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);\n' +
            '}\n';

        initShaders(gl, VSHADER_SOURCE_NORMALS, FSHADER_SOURCE_NORMALS );
        this.normalHelperProgram = gl.program;

        this.nCount = this.initNormalHelperBuffer(gl, this.geometry);
        if (this.nCount < 0){
            console.log("Failed to set vertex position of normal helpers");
            return;
        }
    }

    /**
     * Creates a buffer containing vertex pairs that represent the normal of each of the geometries vertices
     * @param gl The WebGL context
     * @param geometryPrimitive The geometry we are visualising the normals of
     * @returns 
     */
     initNormalHelperBuffer(gl, geometryPrimitive){
        var verticesIn = geometryPrimitive.vertices;
        var normals = geometryPrimitive.normals;
        var vertices = new Float32Array(verticesIn.length*2); // Start and end points of the visualised normals

        let i = 0; // Iterate through vertices
        let j = 0; // Iterates through verticesIn
        while(j < verticesIn.length){
            // Vertex x, y, z
            vertices[i] = verticesIn[j];
            vertices[i+1] = verticesIn[j+1];
            vertices[i+2] = verticesIn[j+2];

            // Vertex + Normal x, y, z
            vertices[i+3] = verticesIn[j] + normals[j];
            vertices[i+4] = verticesIn[j+1] + normals[j+1];
            vertices[i+5] = verticesIn[j+2] + normals[j+2];

            i = i + 6;
            j = j + 3;
        }

        this.nhVertexBuffer = initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');

        return vertices.length/3; // return number of coordinates
    }
}