window.onload=start;
var canvas;
var $canvas;
var gl,shaderProg, vertexPositionAttribute;
var vb;
var ib;
var pMatrix = mat4.create();
var mvMatrix = mat4.create();
var mvStack = [mvMatrix];
var detector;
var pos = vec3.create([0.0, 0.0, 200]);

	$("#vshader-field").text($("#shader-vs").text());
	$("#vshader-field").bind("input propertychange", function(){ $("#shader-vs").text(this.value); initShaders(); }
	$("#fshader-field").text($("#shader-fs").text());
	$("#fshader-field").bind("input propertychange", function(){ $("#shader-fs").text(this.value); initShaders(); }


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
    var vertices = Detector.prototype.getArrays("ALL")[0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vBuf.itemSize = 3;
    vBuf.numItems = 80;
    return vBuf;
};

function initIndexBuffers() {
	var iBuf = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf);
	
	var indList = {
		"CENTER" : Detector.prototype.getIndexArrays("CENTER"),
		"TOP_CORNER" : Detector.prototype.getIndexArrays("TOP_CORNER"),
		"UL_CORNER" : Detector.prototype.getIndexArrays("UL_CORNER"),
		"UR_CORNER" : Detector.prototype.getIndexArrays("UR_CORNER"),
		"UL_EDGE" : Detector.prototype.getIndexArrays("UL_EDGE"),
		"UR_EDGE" : Detector.prototype.getIndexArrays("UR_EDGE"),
		"LL_CORNER" : Detector.prototype.getIndexArrays("LL_CORNER"),
		"LR_CORNER" : Detector.prototype.getIndexArrays("LR_CORNER"),
		"LL_EDGE" : Detector.prototype.getIndexArrays("LL_EDGE"),
		"LR_EDGE" : Detector.prototype.getIndexArrays("LR_EDGE"),
		"BOTTOM_CORNER" : Detector.prototype.getIndexArrays("BOTTOM_CORNER"),
		"SPLIT_LEFT" : Detector.prototype.getIndexArrays("SPLIT_LEFT"),
		"SPLIT_RIGHT" : Detector.prototype.getIndexArrays("SPLIT_RIGHT"),
	}

	var indices = indList["CENTER"];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	iBuf.itemSize = 1;
	iBuf.numItems = indices.length;
	return iBuf;
}

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
	
	vertexPositionAttribute = gl.getAttribLocation(shaderProg, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
    shaderProg.pMatrixUniform = gl.getUniformLocation(shaderProg, "uPMatrix");
    shaderProg.mvMatrixUniform = gl.getUniformLocation(shaderProg, "uMVMatrix");
};
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProg.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProg.mvMatrixUniform, false, mvMatrix);
};
    
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
		detector.changeZoom(event.originalEvent.wheelDelta/100);
	});

	canvas.oncontextmenu = function() { return false; }
	if (canvas.addEventListener) {
		canvas.addEventListener("DOMMouseScroll",handleMouseWheel, false);
		canvas.addEventListener("mousedown", handleMouseDown, true);
		canvas.addEventListener("mouseup", handleMouseUp, false);
		canvas.addEventListener("mouseout", handleMouseUp, false);
		canvas.addEventListener("mousemove", handleMouseDrag, false);
	}
    gl = WebGLUtils.setupWebGL(canvas, {depth: false});
    
    initShaders();
	vb = initVertexBuffers();
	ib = initIndexBuffers();

    gl.clearColor(0.0,0.0,0.0,1.0);
	
	
	mat4.identity(mvMatrix);
	gl.viewport(0, 0, canvas.width, canvas.height);
	
	var ratio = canvas.width / canvas.height;
	
	mat4.perspective(45, ratio, .1, 1000, pMatrix);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vb);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
	detector = new Detector();
	
	render();
};

function update() {
	//update labels
	var $posLabel = $("#zoomLabel");
	$posLabel.text("zoom: "+Math.round(detector.zoom));
	var $lookLabel = $("#axisLabel");
	$lookLabel.text("axis: "+Math.round(detector.xOffset)+", "+Math.round(detector.yOffset));
	//
	
	if (Inputs.dragging) {
		if (Inputs.button == "right") detector.moveAxis(Inputs.dx, Inputs.dy);
		else if (Inputs.button == "left") detector.updateOrientation(-Inputs.dy, Inputs.dx);
		Inputs.dx = 0;
		Inputs.dy = 0;
		Inputs.dragging = false;
	}
	detector.update();
}
function render() {
    update();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.identity(mvMatrix);
    
	detector.draw(gl);
	
	requestAnimFrame(render, canvas);
};






