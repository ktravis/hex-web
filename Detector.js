function Detector () {
	var temp = [];
	this.x = [];
	this.y = [];
	
	template = [];
	
	temp = readFile("final.txt");
	temp = temp.split("\n");
	for (var i = 0; i < 1024; i++) {
		var s = temp[i].split(" ");
		template[i] = tileType[parseInt(s[0])]
		this.x[i] = parseFloat(s[1]);
		this.y[i] = parseFloat(s[2]);
	}
	
	// this.vertices = getArrays("ALL");
	this.indices = [];
	for (var i = 0; i < 13; i++) {
		this.indices[i] = this.getIndexArrays(tileType[i]);
	}
	this.indexBuffers = {};
	for (var i = 0; i < 13; i++) {
		this.indexBuffers[tileType[i]] = createIndexBuffer(this.indices[i]);
	}
	
	this.layers = [];
	this.layers.push(new Grid(template));

	this.xOffset = 0;
	this.yOffset = 0;
	this.targetXOffset = 0;
	this.targetYOffset = 0;
	this.pitch = 0;
	this.yaw = 0;
	this.targetPitch = 0;
	this.targetYaw = 0;
	this.zoom = -100;
	this.targetZoom = -200;
}



Detector.prototype.draw = function(gl) {
	// gl.uniform3fv(gl.getUniformLocation(shaderProg, "uHighColor"), [1.0,0.0,0.0]);
	var highlightUniform = gl.getUniformLocation(shaderProg, "uHighlight");
	pushMatrix();
	var currBuffer, lastType;
	mat4.translate(mvMatrix, [this.xOffset, -this.yOffset, this.zoom]);
	mat4.rotateZ(mvMatrix, Math.PI/2, mvMatrix);
	mat4.rotateY(mvMatrix, this.yaw*Math.PI/180, mvMatrix);
	mat4.rotateX(mvMatrix, this.pitch*Math.PI/180, mvMatrix);
	uIndex = gl.getUniformLocation(shaderProg, "uIndex");
	
	for (var i = 0; i < 1024; i++) {
		gl.uniform1i(uIndex, i);
		gl.uniform1f(highlightUniform, i == 10 ? 1.0 : 0.0);
		
		pushMatrix();
		mat4.translate(mvMatrix, [this.y[i]/850, -this.x[i]/850, 0]);
	
		if (this.layers[0].getType(i) != lastType) {
			lastType = this.layers[0].getType(i);
			currBuffer = this.indexBuffers[lastType];
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, currBuffer);
		}
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLE_FAN, currBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		popMatrix();
	}
	popMatrix();
}	

Detector.prototype.update = function(){
	if (Math.abs(this.targetZoom - this.zoom) > 0.01) {
		this.zoom += (this.targetZoom - this.zoom) * 0.1;
	}
	if (Math.abs(this.pitch - this.targetPitch) > 0.01 || Math.abs(this.yaw - this.targetYaw) > 0.01) {
		if (this.pitch > 180) {
			this.pitch += (360 + this.targetPitch - this.pitch)*.1;
		} else {
			this.pitch += (this.targetPitch - this.pitch)*.1;
		}
		if (this.yaw > 180) {
			this.yaw += (360 + this.targetYaw - this.yaw)*.1;
		} else {
			this.yaw += (this.targetYaw - this.yaw)*.1;
		}
	}
	if (Math.abs(this.targetXOffset - this.xOffset) > 0.01 || Math.abs(this.targetYOffset - this.yOffset) > 0.01) {
		this.xOffset += (this.targetXOffset - this.xOffset) * 0.13;
		this.yOffset += (this.targetYOffset - this.yOffset) * 0.13;
	}
}
Detector.prototype.changeZoom = function(dz) {
	this.targetZoom += dz;
}
Detector.prototype.moveAxis = function(dx,dy) {
	this.targetXOffset += dx;
	this.targetYOffset += dy;
}
Detector.prototype.setAxisPosition = function(ox,oy) {
	this.targetXOffset = ox;
	this.targetYOffset = oy;
}
Detector.prototype.updateOrientation = function(dx,dy) {
	this.pitch += (dy/4);
	this.yaw += (dx/4);
	
	this.pitch = this.pitch > 360 ? 0 : this.pitch;
	this.pitch = this.pitch < 0 ? 360 : this.pitch;
	this.yaw = Math.abs(this.yaw) > 360 ? 0 : this.yaw;
	this.yaw = this.pitch < 0 ? 360 : this.yaw; //not sure why the first part says pitch?
	
	this.targetPitch = this.pitch;
	this.targetYaw = this.yaw;
}
Detector.prototype.resetAxis = function() {
	this.setAxisPosition(0,0);
	this.targetZoom = -200;
	this.targetPitch = 0;
	this.targetYaw = 0;
}

Detector.prototype.getIndexArrays = function (type) {
	if (type == null) return null;
	
	var inds = [];
	
	switch(type) {
	
	case "CENTER":
	{
		for (var i = 0; i < 8; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "TOP_CORNER":
	{
		for (var i = 8; i < 8 + 7; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "UL_CORNER":
	{
		for (var i = 15; i < 15 + 7; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "UR_CORNER":
	{
		for (var i = 22; i < 22 + 7; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "UL_EDGE":
	{
		for (var i = 29; i < 29 + 5; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "UR_EDGE":
	{
		for (var i = 34; i < 34 + 5; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "LL_CORNER":
	{
		for (var i = 39; i < 39 + 7; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "LR_CORNER":
	{
		for (var i = 46; i < 46 + 7; i++) {
			inds.push(i);
		}
		return inds;
	}

	case "LL_EDGE":
	{
		for (var i = 53; i < 53 + 5; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "LR_EDGE":
	{
		for (var i = 58; i < 58 + 5; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "BOTTOM_CORNER":
	{
		for (var i = 63; i < 63 + 7; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "SPLIT_LEFT":
	{
		for (var i = 70; i < 70 + 5; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "SPLIT_RIGHT":
	{
		for (var i = 75; i < 75 + 5; i++) {
			inds.push(i);
		}
		return inds;
	}
	}
}

Detector.prototype.getArrays = function (type) {
	if (type == null) return null;
	
	sideLength = Grid.prototype.TILE_HALF_WIDTH;
	sideNormalRadius = Math.sqrt(3)*sideLength/2.0;
	
	var verts;
	var norms;
	
	switch(type) {
	
	case "CENTER":
	{
		verts = [
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "TOP_CORNER":
	{
		verts = [
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "UL_CORNER":
	{
		verts = [
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	case "UR_CORNER":
	{
		verts = [
			0, 0, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			0, sideLength, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "UL_EDGE":
	{
		verts = [
			0, 0, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "UR_EDGE":
	{
		verts = [
			0, 0, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "LL_CORNER":
	{
		verts = [
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "LR_CORNER":
	{
		verts = [
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, sideLength/2, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "LL_EDGE":
	{
		verts = [
			0, 0, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "LR_EDGE":
	{
		verts = [
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "BOTTOM_CORNER":
	{
		verts = [
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "SPLIT_LEFT":
	{
		verts = [
			0, 0, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "SPLIT_RIGHT":
	{
		verts = [
			0, 0, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
		];
		norms = [
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
			0, 0, 1.0,
		];
		return [verts, norms];
	}
	
	case "ALL":
	{
		verts = [
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			
			0, 0, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			0, sideLength, 0,
			
			0, 0, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			
			0, 0, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			sideNormalRadius, sideLength/2, 0,
			
			0, 0, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			
			0, 0, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			
			0, 0, 0,
			0, sideLength, 0,
			-sideNormalRadius, sideLength/2, 0,
			-sideNormalRadius, -sideLength/2, 0,
			0, -sideLength, 0,
			
			0, 0, 0,
			0, -sideLength, 0,
			sideNormalRadius, -sideLength/2, 0,
			sideNormalRadius, sideLength/2, 0,
			0, sideLength, 0,
		];
		
		norms = [];
		for (var i = 0; i < 80; i++) {
			norms.push(0);
			norms.push(0);
			norms.push(1);
		}
		return [verts, norms];
	}
	}
	return null;
}

