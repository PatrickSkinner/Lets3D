import { Light } from './Light.js';

export class AmbientLight extends Light{

    constructor(ambient){
        super();
        this.ambient = ambient;
    }

    /** Override the drawLight() method of the generic Light class. Simply return as we do not need to visualise AmbientLights.
     * 
     * @param {*} gl WebGL context
     * @param {*} camera The camera to render with
     * @returns 
     */
    drawLight(gl, camera){
        return;
    }
}