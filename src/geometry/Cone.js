import { Primitive } from './Primitive.js';
import { createVector3, normalizeVector3 } from '../Core.js'

export class Cone extends Primitive{
    constructor(radius, length, segments){
        super(radius*2, length, radius*2);

        let verticeArray = [];
        let normalArray = [];
        let indexArray = [];

        // Bottom cap
        for(let p = 0; p < segments; p++){
            let theta1 = ((2*Math.PI)/segments)*p; // Segments range from 0 to 360
            let theta2 = ((2*Math.PI)/segments)*(p+1); 

            let v3 = createVector3(radius*Math.sin(theta1), -length/2, radius*Math.cos(theta1)); // Bottom left
            let v4 = createVector3(radius*Math.sin(theta2), -length/2, radius*Math.cos(theta2)); // Bottom right

            // Bottom cap
            verticeArray.push(v3);
            verticeArray.push(v4);
            verticeArray.push(createVector3(0, -length/2, 0));
            let downVec = createVector3(0, -1, 0);
            normalArray.push(downVec);
            normalArray.push(downVec);
            normalArray.push(downVec);
        }

        // Sides of the cone
        for(let p = 0; p < segments; p++){
            let theta1 = ((2*Math.PI)/segments)*p; // segments range from 0 to 360
            let theta2 = ((2*Math.PI)/segments)*(p+1); 

            let v1 = createVector3(0, length/2, 0); // Top point
            let v2 = createVector3(radius*Math.sin(theta1), -length/2, radius*Math.cos(theta1)); // Bottom left
            let v3 = createVector3(radius*Math.sin(theta2), -length/2, radius*Math.cos(theta2)); // Bottom right

            verticeArray.push(v1);
            verticeArray.push(v2);
            verticeArray.push(v3);

            // TODO: Set Y element of normal correctly using the cross product of the face
            // Normal of top is halfway between normal of two bottom points
            normalArray.push( normalizeVector3( createVector3(v2[0]+(v3[0]-v2[0])/2, 0, v2[2]+(v3[2]-v2[2])/2)));
            normalArray.push( normalizeVector3( createVector3(v2[0], 0, v2[2])));
            normalArray.push( normalizeVector3( createVector3(v3[0], 0, v3[2])));
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