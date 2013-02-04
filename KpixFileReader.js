function bitMask(marker, high, low) {
	mask = (2 << (high - low)) - 1;
	return (marker >> low) & mask;
}
function inittt() {
	var fr = new FileReader();
	fr.onload = function(){ KpixFileReader.init(this.result); };
	var f = document.getElementById("infile").files[0];
	fr.readAsArrayBuffer(f);
	return fr;
}
function step() {
	if (!KpixFileReader.mapFile) {
		inittt();
	}
	$("#dataview").text(KpixFileReader.readRecord());
}
var KpixFileReader = {
	mapFile : null,
	init : function(ba) { 
		var buff = new ByteBuffer(ba,ByteBuffer.LITTLE_ENDIAN);
		this.mapFile = buff;
	},
	rewind : function() {
		this.mapFile.front();
	},
	readRecord : function() {
		if (this.mapFile.index == this.mapFile.length) return null;
		var marker = this.mapFile.readInt();
		var type = bitMask(marker, 31, 28);
		var length = bitMask(marker, 27, 0);
		switch(type) {
		case 0: return this.readDataRecord(type,length);
		case 1:
		case 2:
		case 3:
		case 4: return this.readXMLRecord(type,length);
		default: throw("Unknown record type "+type);		
		}
	},
	readDataRecord : function(type, length) {
		var head = [];
		for (var i = 0; i < 8; i++) {
			head[i] = this.mapFile.readInt(); 
		}
		var eventNum = head[0];
		var time = head[1];       
		
		for (var i = 2; i < head.length; i++) {
			if (head[i] != 0) throw("Unexpected data in event header.");
		}
		var data = []
		for (var i = 0; i < length - 9; i++) {
			data[i] = this.mapFile.readInt();
		}
		var trailer = this.mapFile.readInt();
		if (trailer != 0) throw("Unexpected data in event trailer.");
		return { recordType : type, recordLength : length, eventNumber : eventNum, timestamp : time, data : data, toString : function() { return "Record type: "+this.type+"\nRecord length: "+this.length+"\nEvent number: "+this.eventNumber+"\nTime stamp: "+this.timestamp+"\nData: "+this.data; }, };
	},
	readXMLRecord : function(type, length) {
		var bytes = this.mapFile.read(length);
		return { recordType : type, recordLength : length, xml : String.fromCharCode.apply(String, bytes), toString : function() { return "Record type: "+this.type+"\nRecord length: "+this.length+"\nXML: "+this.xml; } };
	}
}