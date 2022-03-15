class Light extends Object3D{

    vertexBuffer;
    vCount;
    program;

    indices;

    /**
     * 
     * @param {*} gl WebGL context
     * @param {*} camera The camera to render with
     * @returns 
     */
     drawLight(gl, camera){
        if(this instanceof AmbientLight) return;
        if(!this.program){
            this.initializeLightHelper(gl); // This should only ever be called once
        } else {
            if(gl.program != this.program){
                gl.program = this.program;
                gl.useProgram(this.program);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
                gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(a_Position);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            }
        }
        
        var u_cameraMatrix = gl.getUniformLocation(this.program, 'u_ViewMatrix');
        var mvpMatrix = mat4.create();

        mat4.copy(mvpMatrix, camera.mvpMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, this.worldTransform);
        gl.uniformMatrix4fv(u_cameraMatrix, false, mvpMatrix);

        gl.drawElements(gl.LINES, this.vCount, gl.UNSIGNED_INT, 0);
        
    }

    initializeLightHelper(gl){
        console.log("Initializing Light Helper");

        var VSHADER_SOURCE_NORMALS =
            'attribute vec4 a_Position;\n' +
            'uniform mat4 u_ViewMatrix;\n' +
            'void main() {\n' +
                'gl_Position = u_ViewMatrix * a_Position;\n'+
            '}\n';

        var FSHADER_SOURCE_NORMALS =
            'precision mediump float;\n' +
            'void main() {\n' +
               ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);\n' +
            '}\n';

        initShaders(gl, VSHADER_SOURCE_NORMALS, FSHADER_SOURCE_NORMALS );
        this.program = gl.program;

        this.vCount = this.initHelperBuffer(gl, this.geometry);
        if (this.vCount < 0){
            console.log("Failed to set vertex position of normal helpers");
            return;
        }
    }

    /**
     * Create the appropriate vertices/indices to visual each type of light.
     * @param gl The WebGL context
     * @returns 
     */
     initHelperBuffer(gl){
         if(this instanceof DirectionalLight) return this.directionalLightHelper(gl);
         if(this instanceof PointLight) return this.pointLightHelper(gl);
    }
    
    pointLightHelper(gl){
        var vertices = [];

        var dist = 0.15;
        var origin = this.getPosition();
        vertices[0] = createVector3( origin[0], origin[1]+dist*1.5, origin[2] );
        vertices[1] = createVector3( origin[0], origin[1]-dist*1.5, origin[2] );
        vertices[2] = createVector3( origin[0]+dist, origin[1], origin[2]-dist );
        vertices[3] = createVector3( origin[0]+dist, origin[1], origin[2]+dist );
        vertices[4] = createVector3( origin[0]-dist, origin[1], origin[2]-dist );
        vertices[5] = createVector3( origin[0]-dist, origin[1], origin[2]+dist );

        var verticeComponents = [];
        for(var i = 0; i < vertices.length; i++){
            for(var j = 0; j < 3; j++){
                verticeComponents.push(vertices[i][j]);
            }
        }

        this.indices =  [0,2, 0,3, 0,4, 0,5,
                        1,2, 1,3, 1,4, 1,5,
                        2,3, 2,4, 4,5, 3,5];

        this.vertexBuffer = initArrayBuffer(gl, new Float32Array(verticeComponents), 3, gl.FLOAT, 'a_Position');

        // Create buffer to handle indices
        this.indexBuffer = gl.createBuffer();
        if( !this.indexBuffer){
            console.log("Failed to create buffer object");
            return -1;
        }

        // Write the indices to buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint32Array.from(this.indices), gl.STATIC_DRAW);

        return this.indices.length; // return number of indices
    }

    directionalLightHelper(gl){
        var vertices = [];

        var dist = 0.25;
        var origin = this.getPosition();
        vertices[0] = createVector3( origin[0]+dist, origin[1], origin[2]-dist );
        vertices[1] = createVector3( origin[0]+dist, origin[1], origin[2]+dist );
        vertices[2] = createVector3( origin[0]-dist, origin[1], origin[2]-dist );
        vertices[3] = createVector3( origin[0]-dist, origin[1], origin[2]+dist );

        vertices[4] = createVector3( origin[0], origin[1], origin[2]);
        vertices[5] = createVector3( origin[0], origin[1]-(dist*2), origin[2]);

        var verticeComponents = [];
        for(var i = 0; i < vertices.length; i++){
            for(var j = 0; j < 3; j++){
                verticeComponents.push(vertices[i][j]);
            }
        }

        this.indices =  [0,1, 0,2, 2,3, 1,3, 4,5];

        this.vertexBuffer = initArrayBuffer(gl, new Float32Array(verticeComponents), 3, gl.FLOAT, 'a_Position');

        // Create buffer to handle indices
        this.indexBuffer = gl.createBuffer();
        if( !this.indexBuffer){
            console.log("Failed to create buffer object");
            return -1;
        }

        // Write the indices to buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint32Array.from(this.indices), gl.STATIC_DRAW);

        return this.indices.length; // return number of indices
    }
}