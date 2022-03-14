class DirectionalLight extends Light{

    constructor(diffuse, specular, direction){
        super();
        this.diffuse = diffuse;
        this.specular = specular;
        this.direction = direction;
    }

}