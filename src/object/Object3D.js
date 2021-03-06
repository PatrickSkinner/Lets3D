import { createVector3, createVector4 } from '../Core.js'

export class Object3D{
    constructor(){
        this.transform = mat4.create()
        this.worldTransform = mat4.create()
        this.parent = null;
        this.children = [];
    }

    translate(x, y, z){
        let translation = createVector3(x, y, z);
        mat4.translate(this.transform, this.transform, translation);
    }

    rotate(angle, x, y, z){
        let axis = createVector3(x, y, z);
        mat4.rotate(this.transform, this.transform, angle, axis);
    }

    /**
     * Multiply the viewing matrix from the right.
     * @param eyeX, eyeY, eyeZ The position of the eye point.
     * @param centerX, centerY, centerZ The position of the reference point.
     * @param upX, upY, upZ The direction of the up vector.
     * @return this
    */
    transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ){
        let eye = createVector3(eyeX, eyeY, eyeZ);
        let center = createVector3(centerX, centerY, centerZ);
        let up = createVector3(upX, upY, upZ);

        mat4.lookAt(this.transform, eye, center, up);
    }

    setPosition(x, y, z){
        let pos = createVector3(x, y, z);
        this.transform[12] = pos[0];
        this.transform[13] = pos[1];
        this.transform[14] = pos[2];
    }

    getPosition(){
        let out = createVector4();
        let pos = createVector4(0,0,0,1);
        mat4.multiply(out, this.transform, pos );
        return out;
    }

    /**
     * Create a parent-child relationship with a given object. If the object already has a parent that relationship will be overwritten.
     * @param child Object to be set as child.
     */
    addChild(child){
        if(child == this.parent){
            console.log("Error: An object cannot be set as both the parent and child of another object.")
            return;
        }

        if(child == this){
            console.log("Error: An object cannot be set as its own child or parent.")
            return;
        }

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

    /**
     * Called once per frame.
     */
    update(){
        if(this.parent){
            mat4.multiply(this.worldTransform,this.parent.worldTransform,this.transform);
        } else {
            this.worldTransform = this.transform;
        }

        // Update all children
        this.children.forEach(element => {
            element.update();
        });
    }
}