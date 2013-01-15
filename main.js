var sideLength = 2.5;
var sideNormalRadius = Math.sqrt(3)*sideLength/2.0;

window.onload=start;
var canvas;
var $canvas;
var gl,shaderProg;
var vb;
var pMatrix = mat4.create();
var mvMatrix = mat4.create();
var pos = vec3.create([0.0, 0.0, 1.5]);


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        alert("bad");
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    var shader;

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

function initVertexBuffers() { 
    var vBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
    var vertices = [
             0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vBuf.itemSize = 3;
    vBuf.numItems = 3;
    return vBuf;
};

function initColorBuffers() {
	var cBuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuf);
	var cols = [
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cols), gl.STATIC_DRAW);
	cBuf.itemSize = 3;
	cBuf.numItems = 3;
	return cBuf;
};

function initShaders() {
    var fragShader = getShader(gl, "shader-fs");
    var vertShader = getShader(gl, "shader-vs");
    shaderProg = gl.createProgram();
    gl.attachShader(shaderProg, vertShader);
    gl.attachShader(shaderProg, fragShader);
    gl.linkProgram(shaderProg);
    if (!gl.getProgramParameter(shaderProg, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProg);
    shaderProg.pMatrixUniform = gl.getUniformLocation(shaderProg, "uPMatrix");
    shaderProg.mvMatrixUniform = gl.getUniformLocation(shaderProg, "uMVMatrix");
};
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProg.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProg.mvMatrixUniform, false, mvMatrix);
};
    
function handleMouseWheel(event) {
	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta) {
		delta = event.wheelDelta/120;
	} else if (event.detail) {
		delta = -event.detail/3;
	}
	if (delta) zoom(delta);
	if (event.preventDefault) event.preventDefault();
	event.returnValue=false;
}
function zoom(dz) {
	if (pos[2]+dz < 0.1) {
		pos[2] = 0.1;
		return;
	}
	pos.set([pos[0],pos[1],pos[2]+dz]);
}
	
function start() {
	canvas = document.getElementById("display");
	$canvas = $("#display");
	$canvas.bind('mousewheel DOMMouseScroll', function(e) {
    var scrollTo = null;

    if (e.type == 'mousewheel') {
        scrollTo = (e.originalEvent.wheelDelta * -1);
    }
    else if (e.type == 'DOMMouseScroll') {
        scrollTo = 40 * e.originalEvent.detail;
    }

    if (scrollTo) {
        e.preventDefault();
        $(this).scrollTop(scrollTo + $(this).scrollTop());
    }
});
	$(canvas).bind('mousewheel', function(event) {
    zoom(event.originalEvent.wheelDelta/1000);
	});
    
	if (canvas.addEventListener) {
		canvas.addEventListener("DOMMouseScroll",handleMouseWheel, false);
	}
    gl = WebGLUtils.setupWebGL(canvas, {depth: false});
    vb = initVertexBuffers();
    initShaders();
    gl.clearColor(0.0,0.0,0.0,1.0);
	
	
	mat4.identity(mvMatrix);
	gl.viewport(0, 0, canvas.width, canvas.height);
	
	var ratio = canvas.width / canvas.height;
	
	mat4.frustum(-ratio, ratio, -1.0, 1.0, 0.1, 100.0, pMatrix);
	render();
};

function update() {
	//update labels
	var $posLabel = $("#posLabel");
	$posLabel.text("pos: "+pos[0]+", "+pos[1]+", "+pos[2]);
	var $lookLabel = $("#lookLabel");
	$lookLabel.text("look: 0, 0, 0");
	//
	
	if (pos[2] < 0.1) pos[2] = 0.1;
}
function render() {
    update();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.identity(mvMatrix);

    mat4.lookAt(pos,[0,0,0],[0,1,0],mvMatrix);//
	
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.vertexAttribPointer(shaderProg.vertexPositionAttribute, vb.itemSize, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(shaderProg.vertexPositionAttribute);
	
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, vb.numItems);
	
	requestAnimFrame(render, canvas);
};







