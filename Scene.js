class Scene{

    activeCamera; 
    objectList;

    constructor(){
        this.objectList = [];
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
     * Iterate through the object list and draw each object.
     * @param gl Program
     */
    renderScene( gl ){
        gl.clearColor(0,0,0,1);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.objectList.forEach(element => {
            if(element instanceof MeshObject){
                element.draw(gl, this.activeCamera)
            }
        });
    }

}