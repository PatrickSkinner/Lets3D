class Camera extends Object{
    projectionMatrix;
    mvpMatrix;

    constructor(  fov, aspectRatio, nearClipping, farClipping ){
        super();

        // Set the viewing volume
        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setPerspective( fov, aspectRatio, nearClipping, farClipping);
        this.mvpMatrix = this.projectionMatrix;
    }

    // TODO: Directly use object transform for matrix calculations.
    transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ){
        super.transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
        this.mvpMatrix = this.projectionMatrix;
        this.mvpMatrix.lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
    }
}