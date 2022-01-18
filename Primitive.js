/**
 * Base class for geometry primitives.
 */
class Primitive{
    width;
    height;
    depth;

    originX;
    originY;
    originZ;

    vertices;
    indices;

    constructor(height, width, depth){
        this.height = height;
        this.width = width;
        this.depth = depth;

        this.originX = 0.0;
        this.originY = 0.0;
        this.originZ = 0.0;
    }

}

class Cube extends Primitive{

    /** Single parameter constructor, sets all dimensions equally.
     * @param scale value to set all width, height and depth to.
     */
    constructor(scale){

        super( scale, scale, scale );
        
        super.vertices = new Float32Array([
            // Top
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,

            // Bottom
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,

            // Front
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,

            // Back
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,

            // Right
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            
        ]);

        super.indices = new Uint8Array([
            0, 1, 2, // Top
            1, 2, 3,

            4, 5, 6, // Bottom
            5, 6, 7,

            8, 9, 10, // Front
            9, 10, 11,
            
            12, 13, 14, // Back
            13, 14, 15,

            16, 17, 18, // Left
            17, 18, 19,

            20, 21, 22, // Right
            21, 22, 23
        ]);
  
    }

}