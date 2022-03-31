import { Primitive } from './Primitive.js';

export class Plane extends Primitive{
    constructor(width, height){
        super(width, height, 0.0);

        width /= 2;
        height /= 2;

        super.vertices = new Float32Array([
            -width, height, 0.0,
            width, height, 0.0,
            -width, -height, 0.0,
            width, -height, 0.0,
        ]);
        
        super.indices = new Uint32Array([
            0, 1, 2,
            1, 2, 3,
        ]);

        super.normals = new Float32Array([
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
        ])

        super.textureCoords = new Float32Array([
            0,0,    1,1,    0,1,
            0,1,    1,1,    1,0,
        ]);
    }
}