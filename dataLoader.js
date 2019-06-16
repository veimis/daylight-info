// Depends on d3js

// Create dataLoader object to global scope
var dataLoader = (function(){
	const re = /\d{1,2}\.\d{1,2}\.\d{4}( - \d{1,2}:\d{1,2}){2}/g;
	const d3DateParser = d3.timeParse("%d.%m.%Y");

	return {
		// Loads sample data and returns array of data elements
		load: function() {

			const http = new XMLHttpRequest();
			http.open('GET', 'file:///C:/Users/ilkvei/projects/daylight-info/sample-data.htm', false);
			http.send();
			const buffer = http.responseText;

			return parseData(buffer, {dates: [], values: []});
		}
	}

	function parseData(data, results) {
		let match = re.exec(data);
		if(!match){
			return results;
		}

		const parts = parseItem(match[0]);
	
		const date = parseDate(parts[0]);
		results.dates.push(date);

		const dataElement = newDataElement(parts);
		results.values.push(dataElement);
		
		return parseData(data, results);
	};

	function parseItem(line) {
		return line.split('-');
	};
	
	function parseDate(date) {
		return d3DateParser(date.trim());
	}

	// Data element
	function newDataElement(dataRow) {
		return {
			rise:	toSeconds(dataRow[1].trim()),
			set: toSeconds(dataRow[2].trim())
		}
	}

	function toSeconds(time) {
		const splitTime = time.split(":"); // "hh:mm" -> ["hh", "mm"]
		const hours = parseInt(splitTime[0]);
		const minutes = parseInt(splitTime[1]);

		return hours * 60 * 60 + minutes * 60;
	}

}());

