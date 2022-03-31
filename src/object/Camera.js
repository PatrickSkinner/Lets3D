import { Object3D } from './Object3D.js';

export class Camera extends Object3D{
    projectionMatrix;
    mvpMatrix;

    constructor(fov, aspectRatio, nearClipping, farClipping){
        super();

        // Set the viewing volume
        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, fov, aspectRatio, nearClipping, farClipping);
        this.mvpMatrix = mat4.create();
        mat4.copy(this.mvpMatrix, this.projectionMatrix);
    }

    transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ){
        super.transformLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
        mat4.multiply( this.mvpMatrix, this.projectionMatrix, this.transform);
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

        mat4.multiply( this.mvpMatrix, this.projectionMatrix, this.worldTransform);

        // Update all children
        this.children.forEach(element => {
            element.update();
        });
    }

}