class Camera extends Object3D{
    projectionMatrix;
    mvpMatrix;

    constructor(fov, aspectRatio, nearClipping, farClipping){
        super();

        // Set the viewing volume
        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setPerspective( fov, aspectRatio, nearClipping, farClipping);
        this.mvpMatrix = this.projectionMatrix;
    }

    transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ){
        super.transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
        this.mvpMatrix = this.projectionMatrix;
        this.mvpMatrix.multiply(this.transform);
    }

}