function print(s) { window.console.log(s); }

function readFile(path) {
	var result;
	$.ajax({url: path, dataType:"text", async: false, success: function(data) {result = data;}});
	return result;
}

function createIndexBuffer(ar) {
	var iBuf = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ar), gl.STATIC_DRAW);
	iBuf.itemSize = 1;
	iBuf.numItems = ar.length;
	return iBuf;
}

function pushMatrix(matrix) {
	if (matrix) {
		mvStack.push(mat4.create(matrix));
		mvMatrix = mat4.create(matrix);
	} else {
		mvStack.push(mat4.create(mvMatrix));
	}
}
function popMatrix() {
	if (!mvStack.length) throw("Can't pop from an empty matrix stack.");
	mvMatrix = mvStack.pop();
	return mvMatrix;
}
function loadIdentity() {
	mvMatrix = mat4.identity(mat4.create());
}
	

