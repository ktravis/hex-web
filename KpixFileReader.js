function bitMask(marker, high, low) {
	mask = (2 << (high - low)) - 1;
	return (marker >> low) & mask;
}
function initReader() {
	var fr = new FileReader();
	fr.onload = function(){ KpixFileReader.init(this.result); };
	var f = document.getElementById("infile").files[0];
	fr.readAsArrayBuffer(f);
	return fr;
}
function step() {
	if (!KpixFileReader.mapFile) {
		initReader();
		return;
	}
	var rec = KpixFileReader.readRecord();
	
	var intext = "<pre>" + rec + "\n";
	if (rec.recordType == "DATA") {
		intext += "CHANNEL - BUCKET: ADC\n";
		var samples = rec.getSamples();
		
		for (var i = 0; i < samples.size(); i++) {
			var samp = samples.get(i);
			intext += samp.channel + " - " + samp.bucket + ": " + samp.adc + "\n"; 
		}
	}
	intext += "</pre>";
	$("#dataview").html(intext);
}
var KpixFileReader = {
	C : { 	KpixRecordType : ["DATA", "CONFIG", "STATUS", "RUNSTART", "RUNSTOP"],
			KpixSampleType : ["KPIX", "TEMPERATURE", "SAMPLE"],
			ADCRange : ["NORMAL", "LOWGAIN"],
			TriggerSource : ["EXTERNAL", "SELF"],
		},
	mapFile : null,
	means : [],
	init : function(ba) { 
		var buff = new ByteBuffer(ba,ByteBuffer.LITTLE_ENDIAN);
		this.mapFile = buff;
	},
	rewind : function() {
		this.mapFile.front();
	},
	hasNextRecord : function() {
		return this.mapFile.index < this.mapFile.length; //should this be < or <=?
	},
	readRecord : function() {
		if (!this.hasNextRecord()) throw "No record to read.";
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
		if (trailer != 0) throw "Unexpected data in event trailer.";
		return { recordType : KpixFileReader.C.KpixRecordType[type], recordLength : length, eventNumber : eventNum, timestamp : time, data : data, toString : function() { return "Record type: "+this.recordType+"\nRecord length: "+this.recordLength+"\nEvent number: "+this.eventNumber+"\nTime stamp: "+this.timestamp; }, getSamples : function() { return new SampleList(this);}, };
	},
	readXMLRecord : function(type, length) {
		var bytes = this.mapFile.read(length);
		return { recordType : KpixFileReader.C.KpixRecordType[type], recordLength : length, xml : String.fromCharCode.apply(String, bytes), toString : function() { return "Record type: "+this.recordType+"\nRecord length: "+this.recordLength+"\nXML: "+this.xml; }, getSamples : function() { return new SampleList(this);}, };
	},	
	calibrate : function() {
		var oldIndex;
		this.means = Array(1024);
		var counts = Array(1024);
		// this.rewind();
		while (this.hasNextRecord()) {
			var rec = this.readRecord();
			if (rec.recordType != "DATA" || rec.recordLength < 1024) continue;
			var samples = rec.getSamples();
			for (var i = 0; i < samples.size(); i++) {
				var s = samples.get(i);
				if (!this.means[s.channel]) {
					var buckets = [0,0,0,0];
					buckets[s.bucket] = s.adc;
					this.means[s.channel] = buckets;
				} else {
					this.means[s.channel][s.bucket] += s.adc;
				}
				if (!counts[s.channel]) {
					var bCounts = [0,0,0,0];
					bCounts[s.bucket]++;
					counts[s.channel] = bCounts;
				} else {
					counts[s.channel][s.bucket]++;
				}
			}
		}
		var intext = "<pre>Means:\n";
		for (var c in this.means) {
			for (var b = 0; b < 4; b++) {
				this.means[c][b] /= counts[c][b];

			}
		}
		for (var c in this.means) {
			intext += c + this.means[c].toString() + "\n";
		}
		intext += "</pre>";
		$("#dataview-means").html(intext);
	},
}

function SampleList(record) {
	if (record.recordType != "DATA") throw "Record Type Error: Cannot read samples from non-data record.";
	this.data = record.data;
}
SampleList.prototype.get = function(index) {
		var type = bitMask(this.data[2*index], 31, 28);
		var data0 = this.data[2 * index];
		var data1 = this.data[2 * index + 1];
		switch (type) {
			case 0:
			case 1:
			case 2:
				return {
					type : KpixFileReader.C.KpixSampleType[type],
					address : bitMask(data0, 27, 16),
					empty : bitMask(data0, 15, 15) != 0,
					badEvent : bitMask(data0, 14, 14) != 0,
					adcRange : KpixFileReader.C.ADCRange[bitMask(data0, 13, 13)],
					triggerSource : KpixFileReader.C.TriggerSource[bitMask(data0, 12, 12)],
					bucket : bitMask(data0, 11, 10),
					channel : bitMask(data0, 9, 0),
					time : bitMask(data1, 28, 16),
					adc : bitMask(data1, 12, 0),
				}
			default: 
				throw "Unknown sample type: " + type;
		}
	};
SampleList.prototype.size = function() { return this.data.length/2; };