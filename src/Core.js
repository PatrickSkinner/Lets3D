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
        return null;
    }

    // Bind object to array buffer target
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Write data to buffer
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Get location of attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if(a_attribute < 0){
        console.log('Failed retrieve storage position for attribute ' + attribute);
        return null;
    }

    // Assign buffer to attribute variable and enable assignment
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    return buffer; // Success
}

/**
 * Create a Vector3 from given components.
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 * @returns 
 */
function createVector3(x, y, z){
    let v = vec3.create();
    vec3.set(v, x, y, z);
    return v;
}

/**
 * Return the normalized input Vector3.
 * @param {*} vec A Vector3
 * @returns 
 */
function normalizeVector3(vec){
    let v = vec3.create();
    vec3.normalize(v, vec);
    return v;
}

/**
 * Create a Vector4 from given components.
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 * @param {*} w 
 * @returns 
 */
function createVector4(x, y, z, w){
    let v = vec4.create();
    vec4.set(v, x, y, z, w);
    return v;
}

/**
 * Return the normalized input Vector4.
 * @param {*} vec A Vector4
 * @returns 
 */
function normalizeVector4(vec){
    let v = vec4.create();
    createVector4.normalize(v, vec);
    return v;
}