function Detector () {




}

Detector.prototype.getIndexArrays = function (type) {
	if (type == null) return null;
	
	var inds = [];
	
	switch(type) {
	
	case "CENTER":
	{
		for (var i = 0; i < 24; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "TOP_CORNER":
	{
		for (var i = 24; i < 24 + 21; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "UL_CORNER":
	{
		for (var i = 45; i < 45 + 21; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "UR_CORNER":
	{
		for (var i = 66; i < 66 + 21; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "UL_EDGE":
	{
		for (var i = 87; i < 87 + 15; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "UR_EDGE":
	{
		for (var i = 102; i < 102 + 15; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "LL_CORNER":
	{
		for (var i = 117; i < 117 + 21; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "LR_CORNER":
	{
		for (var i = 138; i < 138 + 21; i++) {
			inds.push(i);
		}
		return inds;
	}

	case "LL_EDGE":
	{
		for (var i = 159; i < 159 + 15; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "LR_EDGE":
	{
		for (var i = 174; i < 174 + 15; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "BOTTOM_CORNER":
	{
		for (var i = 189; i < 189 + 21; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "SPLIT_LEFT":
	{
		for (var i = 210; i < 210 + 15; i++) {
			inds.push(i);
		}
		return inds;
	}
	
	case "SPLIT_RIGHT":
	{
		for (var i = 225; i < 225 + 15; i++) {
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

