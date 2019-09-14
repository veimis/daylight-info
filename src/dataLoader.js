// Depends on d3js

// Create dataLoader object to global scope
var dataLoader = (function(){
	const re = /\d{1,2}\.\d{1,2}\.\d{4}( - \d{1,2}:\d{1,2}){2}/g; // 23.4.2019 - 5:40 - 21:09
	const d3DateParser = d3.timeParse("%d.%m.%Y");

	return {
		// Loads sample data and returns array of data elements
		load: function(dataUrl, done) {

			const xhr = new XMLHttpRequest();
			xhr.open('GET', dataUrl);
			xhr.send();
			
			xhr.onload = () => {
				const data = parseData(xhr.responseText, {dates: [], values: []})
				done(data);
			};

			xhr.onerror = () => {
				console.log(xhr); 
				console.log("Failed to fetch graph data.");
			};
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

