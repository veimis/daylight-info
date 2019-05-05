// Depends on d3js

// Create dataLoader object to global scope
var dataLoader = (function(){
	const parseDate = d3.timeParse("%d.%m.%Y");
	const re = /\d{1,2}\.\d{1,2}\.\d{4}( - \d{1,2}:\d{1,2}){2}/g;

	// Data element
	function newDataElement(dataRow) {
		return {
			date: parseDate(dataRow[0].trim()),
			rise:	dataRow[1].trim(),
			set: dataRow[2].trim()
		}
	}

	function parseItem(line) {
		let parts = line.split('-');
		return newDataElement(parts);
	};

	function parseData(data, results) {
		let match = re.exec(data);
		if(!match){
			return results;
		}

		results.push(parseItem(match[0]));
		return parseData(data, results);
	};

	// dataLoader object
	return {
		// Loads sample data and returns array of data elements
		load: function() {

			const http = new XMLHttpRequest();
			http.open('GET', 'file:///C:/Users/ilkvei/projects/daylight-info/sample-data.htm', false);
			http.send();
			const buffer = http.responseText;

			return parseData(buffer, []);
		}
	}
}());

