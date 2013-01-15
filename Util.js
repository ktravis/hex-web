function readFile(path) {
	var result;
	$.ajax({url: path, dataType:"text", async: false, success: function(data) {result = data;}});
	return result;
}