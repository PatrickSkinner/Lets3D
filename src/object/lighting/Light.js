import { Object3D } from '../Object3D.js';
import { initShaders } from '../../Core.js'

export class Light extends Object3D{

    vertexBuffer;
    vCount;
    program;

    indices;

    /**
     * 
     * @param {*} gl WebGL context
     * @param {*} camera The camera to render with
     * @returns 
     */
     drawLight(gl, camera){
        if(!this.program){
            this.initializeLightHelper(gl); // This should only ever be called once per object
        } else {
            if(gl.program != this.program){
                gl.program = this.program;
                gl.useProgram(this.program);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
                gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(a_Position);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            }
        }
        
        var u_cameraMatrix = gl.getUniformLocation(this.program, 'u_ViewMatrix');
        var mvpMatrix = mat4.create();

        mat4.copy(mvpMatrix, camera.mvpMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, this.worldTransform);
        gl.uniformMatrix4fv(u_cameraMatrix, false, mvpMatrix);

        gl.drawElements(gl.LINES, this.vCount, gl.UNSIGNED_INT, 0);
        
    }

    initializeLightHelper(gl){
        console.log("Initializing Light Helper");

        var VSHADER_SOURCE_NORMALS =
            `attribute vec4 a_Position;
            uniform mat4 u_ViewMatrix;
            void main() {
                gl_Position = u_ViewMatrix * a_Position;
            }`;

        var FSHADER_SOURCE_NORMALS =
            `precision mediump float;
            void main() {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);
            }`;

        initShaders(gl, VSHADER_SOURCE_NORMALS, FSHADER_SOURCE_NORMALS );
        this.program = gl.program;

        this.vCount = this.initHelperBuffer(gl); // Implemented in each child class that allows visualization.
        if (this.vCount < 0){
            console.log("Failed to set vertex position of light helper");
            return;
        }
    }

}