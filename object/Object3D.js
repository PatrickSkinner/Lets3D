class Object3D{
    constructor(){
        this.transform = new Matrix4();
        this.transform.setIdentity();
        this.parent = null;
        this.children = [];
    }

    translate(x, y, z){
        var translationMat = new Matrix4();
        translationMat.setIdentity();

        translationMat.elements[12] = x;
        translationMat.elements[13] = y;
        translationMat.elements[14] = z;

        this.transform.multiply(translationMat);
    }

    rotate(angle, x, y, z){
        this.transform.rotate(angle, x, y, z);
    }

    /**
     * Multiply the viewing matrix from the right.
     * @param eyeX, eyeY, eyeZ The position of the eye point.
     * @param centerX, centerY, centerZ The position of the reference point.
     * @param upX, upY, upZ The direction of the up vector.
     * @return this
    */
    transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ){
        this.transform.lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
    }

    /**
     * Create a parent-child relationship with a given object. If the object already has a parent that relationship will be overwritten.
     * @param child Object to be set as child.
     */
    addChild(child){
        var alreadyAdded = false;
        this.children.forEach(element => {
            if( element == child ) alreadyAdded = true;
        });

        if(!alreadyAdded){
            if( child.parent == null ){ // New child doesn't already have a parent
                child.parent = this;
                this.children.push(child);
            }
            else { // Child has a parent already
                child.parent.removeChild(child);
                child.parent = this;
                this.children.push(child);
            }
        }
    }
    
    /**
     * Remove a parent-child relationship from this object.
     * @param child Child to be removed.
     */
    removeChild(child){      
        const index = this.children.indexOf(child);
        if (index > -1) {
        this.children.splice(index, 1);
          child.parent = null;
        }
    }
}