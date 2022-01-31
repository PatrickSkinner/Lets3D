class Scene{

    activeCamera; 
    objectList;

    constructor(){
        this.objectList = [];
    }

    add( newObject ){
        this.objectList.push(newObject);
    }

    setActiveCamera(cam){
        this.activeCamera = cam;
    }

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