var Inputs = {
	clicking : false,
	dragging : false,
	button : "left",
	dx : 0,
	dy : 0,
	lastx: 0,
	lasty: 0,
}

function handleMouseWheel(event) {
	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta) {
		delta = event.wheelDelta/600;
	} else if (event.detail) {
		delta = -event.detail/3;
	}
	if (delta) detector.changeZoom(delta);
	if (event.preventDefault) event.preventDefault();
	event.returnValue=false;
}

//some of this is probably redundant (zeroing dx,dy)
function handleMouseDown(event) {
	Inputs.clicking = true;
	Inputs.button = ["left","middle","right"][event.button];
	Inputs.lastx = event.clientX;
	Inputs.lasty = event.clientY;
	Inputs.dx = 0; 
	Inputs.dy = 0;
}
function handleMouseUp(event) {
	Inputs.clicking = false;
	Inputs.dx = 0; 
	Inputs.dy = 0;
}
function handleMouseDrag(event) {
	Inputs.dragging = Inputs.clicking;
	if (!event) var event = window.event;
	Inputs.dx += (event.clientX - Inputs.lastx)*.35;
	Inputs.dy += (event.clientY - Inputs.lasty)*.35;
	// if (Math.abs(Inputs.dx) < .1) Inputs.dx = 0;
	// if (Math.abs(Inputs.dy) < .1) Inputs.dy = 0;
	Inputs.lastx = event.clientX;
	Inputs.lasty = event.clientY;
}