class Scene{

    activeCamera; 
    objectList;
    cColor; // Color to clear screen to when clearColor() is called

    constructor(){
        this.objectList = [];
        this.cColor = [0,0,0,1];
    }

    /**
     * Add an object to the scene
     * @param newObject Object to be added.
     */
    add(newObject){
        this.objectList.push(newObject);
    }

    /**
     * Set which camera should be used when renderScene() is called
     * @param cam Camera object to be used
     */
    setActiveCamera(cam){
        this.activeCamera = cam;
    }

    /**
     * Set the color to be used when gl.clearColor is called.
     * @param r Red component
     * @param g Green component
     * @param b Blue component
     * @param a Alpha value
     */
    setClearColor(r, g, b, a){
        this.cColor = [r,g,b,a];
    }

    /**
     * Iterate through the object list and draw each object.
     * @param gl Program
     */
    renderScene( gl ){
        gl.clearColor(this.cColor[0], this.cColor[1], this.cColor[2], this.cColor[3]);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.objectList.forEach(element => {
            if(element instanceof MeshObject){
                element.draw(gl, this.activeCamera)
            }
        });
    }

}