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

    constructor(height, width, depth){
        this.height = height;
        this.width = width;
        this.depth = depth;

        this.originX = 0.0;
        this.originY = 0.0;
        this.originZ = 0.0;
    }

}

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

class Cube extends Primitive{
    /**
     * Cube constructor
     * @param width along the X axis
     * @param height along the Y axis
     * @param depth along the Z axis
     */
     constructor(width, height, depth){

        super(width, height, depth);
        
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
  
    }
}

class Sphere extends Primitive{
    constructor(radius, xSegments, ySegments){
        super(radius*2, radius*2, radius*2);

        let verticeArray = [];
        let normalArray = [];
        let indexArray = [];

        for( let t = 0; t < ySegments; t++){ 
            let phi1 = (Math.PI/ySegments)*t; // y segments range from 0 to 180
            let phi2 = (Math.PI/ySegments)*(t+1);

            for( let p = 0; p < xSegments; p++){
                let theta1 = ((2*Math.PI)/xSegments)*p; // x segments range from 0 to 360
                let theta2 = ((2*Math.PI)/xSegments)*(p+1); 

                // Convert from spherical coordinates to rectangular
                let v1 = new Vector3([radius*Math.sin(phi1)*Math.cos(theta1), radius*Math.cos(phi1), radius*Math.sin(phi1)*Math.sin(theta1), ]); // t1, p1
                let v2 = new Vector3([radius*Math.sin(phi2)*Math.cos(theta1), radius*Math.cos(phi2), radius*Math.sin(phi2)*Math.sin(theta1), ]); // t1, p2
                let v3 = new Vector3([radius*Math.sin(phi2)*Math.cos(theta2), radius*Math.cos(phi2), radius*Math.sin(phi2)*Math.sin(theta2), ]); // t2, p2
                let v4 = new Vector3([radius*Math.sin(phi1)*Math.cos(theta2), radius*Math.cos(phi1), radius*Math.sin(phi1)*Math.sin(theta2), ]); // t2, p1

                if( t == 0 ){ // Top of sphere
                    verticeArray.push(v1);
                    verticeArray.push(v2);
                    verticeArray.push(v3);
                    normalArray.push(v1.normalize());
                    normalArray.push(v2.normalize());
                    normalArray.push(v3.normalize());
                } else if (t+1 == ySegments){ // Bottom of sphere
                    verticeArray.push(v1);
                    verticeArray.push(v2);
                    verticeArray.push(v4);
                    normalArray.push(v1.normalize());
                    normalArray.push(v2.normalize());
                    normalArray.push(v4.normalize());
                } else {
                    var dummy = new Vector3([0,0,0]);
                    verticeArray.push(v1);
                    verticeArray.push(v2);
                    verticeArray.push(v3);
                    normalArray.push(v1);
                    normalArray.push(v2);
                    normalArray.push(v3);

                    verticeArray.push(v1);
                    verticeArray.push(v3);
                    verticeArray.push(v4);
                    normalArray.push(v1.normalize());
                    normalArray.push(v3.normalize());
                    normalArray.push(v4.normalize());

                }
            }
        }

        // Instead of array of Vector3s we need arrays of each component [x,y,z,x,y,z,...]
        let verticeElements = [];
        let normalElements = [];
        for(let i = 0; i < verticeArray.length; i++){
            indexArray.push(i);
            for(let j = 0; j < 3; j++){
                verticeElements.push(verticeArray[i].elements[j]);
                normalElements.push(normalArray[i].elements[j]);
            }
        }

        super.vertices = new Float32Array(verticeElements);
        super.normals = new Float32Array(normalElements);
        super.indices = new Uint32Array(indexArray);
    }
}