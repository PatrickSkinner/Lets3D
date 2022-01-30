class Object{
    constructor(){
        this.transform = new Matrix4();
        this.parent = null;
        this.children = [];
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
    
    removeChild(child){      
        const index = this.children.indexOf(child);
        if (index > -1) {
        this.children.splice(index, 1);
          child.parent = null;
        }
    }
}