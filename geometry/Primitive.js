/**
 * Base class for geometry primitives.
 */
class Primitive{
    // Parameters
    width;
    height;
    depth;

    //Origin Point
    originX;
    originY;
    originZ;

    // Buffers
    vertices;
    indices;
    normals;
    textureCoords;

    constructor(height, width, depth){
        this.height = height;
        this.width = width;
        this.depth = depth;

        this.originX = 0.0;
        this.originY = 0.0;
        this.originZ = 0.0;
    }

}