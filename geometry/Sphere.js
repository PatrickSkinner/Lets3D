class Sphere extends Primitive{
    constructor(radius, xSegments, ySegments){
        super(radius*2, radius*2, radius*2);

        let verticeArray = [];
        let normalArray = [];
        let indexArray = [];

        for( let t = 0; t < ySegments; t++){ 
            let phi1 = (Math.PI/ySegments)*t; // y segments range from 0 to 180, use half of ySegments
            let phi2 = (Math.PI/ySegments)*(t+1);

            for( let p = 0; p < xSegments; p++){
                let theta1 = ((2*Math.PI)/xSegments)*p; // x segments range from 0 to 360
                let theta2 = ((2*Math.PI)/xSegments)*(p+1); 

                let v1 = createVector3( radius*Math.sin(phi1)*Math.cos(theta1), radius*Math.cos(phi1), radius*Math.sin(phi1)*Math.sin(theta1) );
                let v2 = createVector3( radius*Math.sin(phi2)*Math.cos(theta1), radius*Math.cos(phi2), radius*Math.sin(phi2)*Math.sin(theta1) );
                let v3 = createVector3( radius*Math.sin(phi2)*Math.cos(theta2), radius*Math.cos(phi2), radius*Math.sin(phi2)*Math.sin(theta2) );
                let v4 = createVector3( radius*Math.sin(phi1)*Math.cos(theta2), radius*Math.cos(phi1), radius*Math.sin(phi1)*Math.sin(theta2) );

                if( t == 0 ){ // Top of sphere
                    verticeArray.push(v1);
                    verticeArray.push(v2);
                    verticeArray.push(v3);
                    normalArray.push(normalizeVector3(v1));
                    normalArray.push(normalizeVector3(v2));
                    normalArray.push(normalizeVector3(v3));
                    
                } else if (t+1 == ySegments){ // Bottom of sphere
                    verticeArray.push(v1);
                    verticeArray.push(v2);
                    verticeArray.push(v4);
                    normalArray.push(normalizeVector3(v1));
                    normalArray.push(normalizeVector3(v2));
                    normalArray.push(normalizeVector3(v4));
                } else {           
                    verticeArray.push(v1);
                    verticeArray.push(v2);
                    verticeArray.push(v3);
                    
                    normalArray.push(normalizeVector3(v1));
                    normalArray.push(normalizeVector3(v2));
                    normalArray.push(normalizeVector3(v3));
                    
                    verticeArray.push(v1);
                    verticeArray.push(v3);
                    verticeArray.push(v4);

                    normalArray.push(normalizeVector3(v1));
                    normalArray.push(normalizeVector3(v3));
                    normalArray.push(normalizeVector3(v4));
                }
            }
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