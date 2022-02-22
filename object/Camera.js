class Camera extends Object3D{
    projectionMatrix;
    mvpMatrix;

    constructor(fov, aspectRatio, nearClipping, farClipping){
        super();

        // Set the viewing volume
        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, fov, aspectRatio, nearClipping, farClipping);
        this.mvpMatrix = this.projectionMatrix;
    }

    transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ){
        super.transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
        this.mvpMatrix = this.projectionMatrix;
        mat4.multiply( this.mvpMatrix, this.mvpMatrix, this.transform);
    }

}