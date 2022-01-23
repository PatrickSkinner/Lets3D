// Combination of Mesh and Material
class MeshObject{
    geometry;
    material;

    constructor( geom, mat ){
        this.geometry = geom;
        this.material = mat;
    }

    draw(gl){
        var n = initVertexBuffers(gl, this.geometry);
        if (n < 0){
            console.log("Failed to set vertex position");
            return;
        }

        // Set the eye point and the viewing volume
        var mvpMatrix = new Matrix4();
        mvpMatrix.setPerspective(30, 1, 1, 100);
        mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
        var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
        gl.uniformMatrix4fv(u_ViewMatrix, false, mvpMatrix.elements);

        var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
        var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
        var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0); // Set light color to white
        var lightDirection = new Vector3([2,3,-3.0]);
        lightDirection.normalize();
        gl.uniform3fv(u_LightDirection, lightDirection.elements);
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

        gl.clearColor(0,0,0,1);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }
}