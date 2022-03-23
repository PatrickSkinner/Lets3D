class Plane extends Primitive{
    constructor(width, height){
        super(width, height, 0.0);

        super.vertices = new Float32Array([
            -width, height, 0.0,
            width, height, 0.0,
            -width, -height, 0.0,
            width, -height, 0.0,
        ]);
        
        super.indices = new Uint8Array([
            0, 1, 2,
            1, 2, 3,
        ]);

        super.normals = new Float32Array([
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
        ])
    }
}