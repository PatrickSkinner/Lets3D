// Combination of Mesh and Material
class MeshObject extends Object3D{
    geometry;
    material;

    constructor( geom, mat ){
        super();
        this.geometry = geom;
        this.material = mat;
    }

    /**
     * Call initShaders() using the fragment and vertex shaders of the material assigned to this mesh
     * @param gl WebGL context
     * @returns 
     */
    initializeShaders(gl){
        if( !initShaders(gl, this.material.vertexShader, this.material.fragmentShader )){
            console.log('Failed to init shaders.');
            return;
        }
    }

    /**
     * Render this object from the perspective of a given camera.
     * @param gl WebGL context
     * @param camera Camera to render with
     * @returns 
     */
    draw(gl, camera){
        this.initializeShaders(gl);

        var n = initVertexBuffers(gl, this.geometry);
        if (n < 0){
            console.log("Failed to set vertex position");
            return;
        }

        var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        var u_cameraMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
        var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
        var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
        var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
        var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

        var normalMatrix = new Matrix4();
        var mvpMatrix = new Matrix4();

        mvpMatrix.set(camera.mvpMatrix);
        mvpMatrix.multiply(this.transform);
        gl.uniformMatrix4fv(u_cameraMatrix, false, mvpMatrix.elements);

        normalMatrix.setInverseOf(this.transform);
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.transform.elements);

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0); // Set light color to white
        var lightPosition = new Vector3([4,4,-3]);
        gl.uniform3fv(u_LightPosition, lightPosition.elements);
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }

    drawNormals(gl, camera){
        var VSHADER_SOURCE_NORMALS =
            'attribute vec4 a_Position;\n' +
            'uniform mat4 u_ViewMatrix;\n' +
            'void main() {\n' +
                'gl_Position = u_ViewMatrix * a_Position;\n'+
            '}\n';

        var FSHADER_SOURCE_NORMALS =
            'precision mediump float;\n' +
            'void main() {\n' +
               ' gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1);\n' +
            '}\n';

        initShaders(gl, VSHADER_SOURCE_NORMALS, FSHADER_SOURCE_NORMALS );

        var n = initNormalHelpers(gl, this.geometry);
        if (n < 0){
            console.log("Failed to set vertex position");
            return;
        }

        var u_cameraMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
        var mvpMatrix = new Matrix4();

        mvpMatrix.set(camera.mvpMatrix);
        mvpMatrix.multiply(this.transform);
        gl.uniformMatrix4fv(u_cameraMatrix, false, mvpMatrix.elements);

        gl.drawArrays(gl.LINES, 0, n);
    }
}