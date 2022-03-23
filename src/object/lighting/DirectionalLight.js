class DirectionalLight extends Light{

    constructor(diffuse, specular, direction){
        super();
        this.diffuse = diffuse;
        this.specular = specular;
        this.direction = direction;

        var pos = super.getPosition()
        var origin = createVector3(pos[0], pos[1], pos[2]);
        var facing = vec3.create();
        vec3.add(facing, origin, direction);
        
        var transform = mat4.create();
        mat4.targetTo(transform, origin, facing, createVector3(0,1,-1));

        super.transform = transform;
    }

}