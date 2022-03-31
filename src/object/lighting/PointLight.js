import { Light } from './Light.js';

export class PointLight extends Light{

    constructor(diffuse, specular){
        super();
        this.diffuse = diffuse;
        this.specular = specular;
    }

}