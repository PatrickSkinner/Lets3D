class Scene{

    activeCamera;

    // Placeholder. List of objects in the scene. To be replaced with a proper scenegraph.
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
}