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