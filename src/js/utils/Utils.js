let instance = null;

class Utils {
	
	constructor () {

		console.log('UTILS CONSTRUCTOR');

		// singleton
		if (!instance) {
			instance = this;
		}

		return instance;
	}

	/****************************************
	**
	**	Returns all the uniforms and 
	**	attributes that are currently being
	**	stored on the specified gl program.
	**
	**	Taken from:
	**	https://bocoup.com/weblog/counting-uniforms-in-webgl
	**
	**	Note: 
	**	use console.table() on the result;
	**	
	****************************************/

	function getProgramInfo (gl, program) {

	    var result = {
	        attributes: [],
	        uniforms: [],
	        attributeCount: 0,
	        uniformCount: 0
	    },
	        activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS),
	        activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

	    // Taken from the WebGl spec:
	    // http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14
	    var enums = {
	        0x8B50: 'FLOAT_VEC2',
	        0x8B51: 'FLOAT_VEC3',
	        0x8B52: 'FLOAT_VEC4',
	        0x8B53: 'INT_VEC2',
	        0x8B54: 'INT_VEC3',
	        0x8B55: 'INT_VEC4',
	        0x8B56: 'BOOL',
	        0x8B57: 'BOOL_VEC2',
	        0x8B58: 'BOOL_VEC3',
	        0x8B59: 'BOOL_VEC4',
	        0x8B5A: 'FLOAT_MAT2',
	        0x8B5B: 'FLOAT_MAT3',
	        0x8B5C: 'FLOAT_MAT4',
	        0x8B5E: 'SAMPLER_2D',
	        0x8B60: 'SAMPLER_CUBE',
	        0x1400: 'BYTE',
	        0x1401: 'UNSIGNED_BYTE',
	        0x1402: 'SHORT',
	        0x1403: 'UNSIGNED_SHORT',
	        0x1404: 'INT',
	        0x1405: 'UNSIGNED_INT',
	        0x1406: 'FLOAT'
	    };

	    // Loop through active uniforms
	    for (var i=0; i < activeUniforms; i++) {
	        var uniform = gl.getActiveUniform(program, i);
	        uniform.typeName = enums[uniform.type];
	        result.uniforms.push(uniform);
	        result.uniformCount += uniform.size;
	    }

	    // Loop through active attributes
	    for (var i=0; i < activeAttributes; i++) {
	        var attribute = gl.getActiveAttrib(program, i);
	        attribute.typeName = enums[attribute.type];
	        result.attributes.push(attribute);
	        result.attributeCount += attribute.size;
	    }

	    return result;
	}

}

export default Utils;