import { Light } from './Light.js';

export class AmbientLight extends Light{

    constructor(ambient){
        super();
        this.ambient = ambient;
    }

}