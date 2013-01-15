
function Grid (templateTypes) {
	this.index = 0;
	this.TILE_WIDTH = 5;
	this.TILE_HALF_WIDTH = this.TILE_WIDTH/2;
	this.MAX_ROW_SIZE = 30;
	this.MAX_ROWS = 39;
	this.MAX_TILES = 1024;
	this.active = false;
	this.types = [];

	if (templateTypes) {
		this.types = templateTypes;
		return;
	}
	
	var ls = readFile("final.txt").split("\n");

	for (i=0; i < this.MAX_TILES; i++) {
		this.types[i] = tileType[1*((ls[i].split(" "))[0])];
	}
	
	// function Grid(templateTypes) {
		// this.types = templateTypes;
	// }
}



// enum "tileType" describes the placement of the tile on the grid
tileType = {
		0:"CENTER", 1:"TOP_CORNER", 2:"UL_EDGE", 3:"UR_EDGE", 
		4:"UL_CORNER", 5:"UR_CORNER", 6:"LL_CORNER", 7:"LR_CORNER", 
		8:"LL_EDGE", 9:"LR_EDGE", 10:"BOTTOM_CORNER", 11:"SPLIT_LEFT", 12:"SPLIT_RIGHT" //split left/right refers to REMAINING half of tile, relative to initial tile numbering (right to left, top to bottom)
	}
Grid.prototype.typeList = function() { return this.types; }
Grid.prototype.isActive = function() { return this.active; }
Grid.prototype.setActive = function(a) { this.active = a; }
Grid.prototype.toggleActive = function() { this.active = !this.active; }
Grid.prototype.index = function() { return this.index; }

function getType(i) { return tileType[i]; }