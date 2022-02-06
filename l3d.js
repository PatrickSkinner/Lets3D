/**
 * @param gl WebGL context
 * @param vShader Vertex shader program passed as a string
 * @param fShader Fragment shader program passed as a string
 * @returns 
 */
function initShaders(gl, vShader, fShader){

    // Compile shader objects
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vShader);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fShader);

    // Create program from shaders
    var program = createProgram(gl, vertexShader, fragmentShader);
    if(!program){
        console.log("Failed to create program from shaders");
        return false;
    }

    gl.useProgram(program);
    gl.program = program;

    return true;
}

/**
 * @param gl WebGL context
 * @param vertexShader Compiled vertex shader object
 * @param fragmentShader Compiled fragment shader object
 * @returns returns program, or null object on failure
 */
function createProgram(gl, vertexShader, fragmentShader) {
    //Create program object
    var program = gl.createProgram();

    // Attach shader objects and link program object
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var isLinked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!isLinked){
        console.log("Failed to link program.");
        gl.deleteProgram(program);
        //gl.deleteShader(vertexShader);
        //gl.deleteShader(fragmentShader);
        return null;
    } else {
        return program;
    }
}

/**
 * @param gl WebGL context
 * @param type Type of shader to be compiled
 * @param source Shader program passed as a string
 * @returns return shader object, or null object on failure
 */
function createShader(gl, type, source){
    // Create shader object
    var shader = gl.createShader(type);

    // Set shader program and compile shader
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check if shader successfully compiled
    var isCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!isCompiled) { // Failed to compile
        console.log("Failed to compile shader.")
        gl.deleteShader(shader);
        return null;
    } else { // Successfully compiled
        return shader;
    }
}

/**
 * Initialise an array buffer and assign it to given attribute variable.
 * @param gl GL rendering context
 * @param data Vertex data to be stored in buffer
 * @param num Size of buffer
 * @param type Type of data to be stored
 * @param attribute Attribute variable name
 * @returns True, if buffer successfully created and assigned to attribute variable.
 */
function initArrayBuffer(gl, data, num, type, attribute) {

    // Create buffer object
    var buffer = gl.createBuffer();
    if(!buffer){
        console.log('Failed to create buffer object.')
        return false;
    }

    // Bind object to array buffer target
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Write data to buffer
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Get location of attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if(a_attribute < 0){
        console.log('Failed retrieve storage position for attribute ' + attribute);
        return false;
    }

    // Assign buffer to attribute variable and enable assignment
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    return true; // Success
}

/**
 * Create vertex buffers for a given primitive.
 * @param {*} gl 
 * @param {*} geometryPrimitive 
 * @returns 
 */
 function initVertexBuffers(gl, geometryPrimitive){
    var vertices = geometryPrimitive.vertices;
    var indices = geometryPrimitive.indices;
    var normals = geometryPrimitive.normals;

    // Placeholder color insertion
    var colors = new Float32Array([     // Colors
       0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // blue
       0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // blue
       0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // green
       0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // green
       1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // red
       1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // red
    ]);

    var indexBuffer = gl.createBuffer();
    if( !indexBuffer){
        console.log("Failed to create buffer object");
        return -1;
    }

    initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color');
    initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal');

    //Write the indices to buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

 function initNormalHelpers(gl, geometryPrimitive){

    var verticesIn = geometryPrimitive.vertices;
    var normals = geometryPrimitive.normals;
    var vertices = new Float32Array(verticesIn.length*2);

    let i = 0;
    let j = 0;
    while(j < verticesIn.length){
        // Vertex x, y, z
        vertices[i] = verticesIn[j];
        vertices[i+1] = verticesIn[j+1];
        vertices[i+2] = verticesIn[j+2];

        // Vertex + Normal x, y, z
        vertices[i+3] = verticesIn[j] + normals[j];
        vertices[i+4] = verticesIn[j+1] + normals[j+1];
        vertices[i+5] = verticesIn[j+2] + normals[j+2];

        /*
        console.log(vertices[i] +', '+ vertices[i+1] +', '+ vertices[i+2] +
        '\t to \t' + vertices[i+3] +', '+ vertices[i+4] +', '+ vertices[i+5])
        */

        i = i + 6;
        j = j + 3;
    }

    initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');

    return vertices.length/3; // 3 numbers per point
}
