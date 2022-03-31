import { Primitive } from './Primitive.js';
import { createVector3, normalizeVector3 } from '../Core.js'

export class Cylinder extends Primitive{
    constructor(radius, length, segments){
        super(radius*2, length, radius*2);

        let verticeArray = [];
        let normalArray = [];
        let indexArray = [];

        // Top and bottom caps, draw one triangle of both simultaneously
        for(let p = 0; p < segments; p++){
            let theta1 = ((2*Math.PI)/segments)*p; // Segments range from 0 to 360
            let theta2 = ((2*Math.PI)/segments)*(p+1); 

            let v1 = createVector3(radius*Math.sin(theta1), length/2, radius*Math.cos(theta1)); // Top left
            let v2 = createVector3(radius*Math.sin(theta2), length/2, radius*Math.cos(theta2)); // Top right

            let v3 = createVector3(radius*Math.sin(theta1), -length/2, radius*Math.cos(theta1)); // Bottom left
            let v4 = createVector3(radius*Math.sin(theta2), -length/2, radius*Math.cos(theta2)); // Bottom right

            // Top cap
            verticeArray.push(v1);
            verticeArray.push(v2);
            verticeArray.push(createVector3(0, length/2, 0));
            normalArray.push(createVector3(0, 1, 0));
            normalArray.push(createVector3(0, 1, 0));
            normalArray.push(createVector3(0, 1, 0));

            // Bottom cap
            verticeArray.push(v3);
            verticeArray.push(v4);
            verticeArray.push(createVector3(0, -length/2, 0));
            normalArray.push(createVector3(0, -1, 0));
            normalArray.push(createVector3(0, -1, 0));
            normalArray.push(createVector3(0, -1, 0));
        }

        // Sides of the cylinder
        for(let p = 0; p < segments; p++){
            let theta1 = ((2*Math.PI)/segments)*p; // segments range from 0 to 360
            let theta2 = ((2*Math.PI)/segments)*(p+1); 

            let v1 = createVector3(radius*Math.sin(theta1), length/2, radius*Math.cos(theta1)); // Top left
            let v2 = createVector3(radius*Math.sin(theta2), length/2, radius*Math.cos(theta2)); // Top right
            let v3 = createVector3(radius*Math.sin(theta1), -length/2, radius*Math.cos(theta1)); // Bottom left
            let v4 = createVector3(radius*Math.sin(theta2), -length/2, radius*Math.cos(theta2)); // Bottom right

            verticeArray.push(v1);
            verticeArray.push(v2);
            verticeArray.push(v3);
            normalArray.push( normalizeVector3( createVector3(v1[0], 0, v1[2])));
            normalArray.push( normalizeVector3( createVector3(v2[0], 0, v2[2])));
            normalArray.push( normalizeVector3( createVector3(v3[0], 0, v3[2])));

            verticeArray.push(v2);
            verticeArray.push(v3);
            verticeArray.push(v4);
            normalArray.push( normalizeVector3( createVector3(v2[0], 0, v2[2])));
            normalArray.push( normalizeVector3( createVector3(v3[0], 0, v3[2])));
            normalArray.push( normalizeVector3( createVector3(v4[0], 0, v4[2])));
        }

        // Instead of array of Vector3s we need arrays of each component [x,y,z,x,y,z,...]
        let verticeElements = [];
        let normalElements = [];
        for(let i = 0; i < verticeArray.length; i++){
            indexArray.push(i);
            for(let j = 0; j < 3; j++){
                verticeElements.push(verticeArray[i][j]);
                normalElements.push(normalArray[i][j]);
            }
        }

        super.vertices = new Float32Array(verticeElements);
        super.normals = new Float32Array(normalElements);
        super.indices = new Uint32Array(indexArray);
    }
}