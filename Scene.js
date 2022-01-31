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
        this.objectList.forEach(element => {
            if(element instanceof MeshObject){
                element.draw(gl, this.activeCamera)
            }
        });
    }
    
}