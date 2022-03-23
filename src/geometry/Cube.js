class Cube extends Primitive{
    /**
     * Cube constructor
     * @param width along the X axis
     * @param height along the Y axis
     * @param depth along the Z axis
     */
     constructor(width, height, depth){

        super(width, height, depth);

        width /= 2;
        height /= 2;
        depth /= 2;
        
        super.vertices = new Float32Array([
            // Top
            -width, height, depth,
            width, height, depth,
            -width, height, -depth,
            width, height, -depth,

            // Bottom
            -width, -height, depth,
            width, -height, depth,
            -width, -height, -depth,
            width, -height, -depth,

            // Front
            -width, height, -depth,
            width, height, -depth,
            -width, -height, -depth,
            width, -height, -depth,

            // Back
            -width, height, depth,
            width, height, depth,
            -width, -height, depth,
            width, -height, depth,

            // Left
            -width, height, -depth,
            -width, height, depth,
            -width, -height, -depth,
            -width, -height, depth,

            // Right
            width, height, -depth,
            width, height, depth,
            width, -height, -depth,
            width, -height, depth,
        ]);

        super.indices = new Uint32Array([
            0, 1, 2,        1, 2, 3, // Top
            4, 5, 6,        5, 6, 7, // Bottom
            8, 9, 10,       9, 10, 11, // Front
            12, 13, 14,     13, 14, 15,// Back
            16, 17, 18,     17, 18, 19,// Left
            20, 21, 22,     21, 22, 23 // Right
        ]);

        super.normals = new Float32Array([
            0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   // Top
            0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   // Bottom

            0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   // Front
            0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   // Back
            
            -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // Left
            1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   // Right
        ]);

        super.textureCoords = new Float32Array([
            0,0,    1,1,    0,1,    // Top
            0,1,    1,1,    1,0,

            0,0,    1,1,    0,1,    // Bottom
            0,1,    1,1,    1,0,

            0,0,    1,1,    0,1,    // Front
            0,1,    1,1,    1,0,

            0,0,    1,1,    0,1,    // Back
            0,1,    1,1,    1,0,

            0,0,    1,1,    0,1,    // Left
            0,1,    1,1,    1,0,

            0,0,    1,1,    0,1,    // Right
            0,1,    1,1,    1,0,
        ]);
    }
}