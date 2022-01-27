class Object{
    transform;

    constructor(){
        this.transform = new Matrix4();
    }
    
    /**
     * Multiply the viewing matrix from the right.
     * @param eyeX, eyeY, eyeZ The position of the eye point.
     * @param centerX, centerY, centerZ The position of the reference point.
     * @param upX, upY, upZ The direction of the up vector.
     * @return this
    */
    transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ){
        console.log("parent");
        this.transform.lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
    }
}