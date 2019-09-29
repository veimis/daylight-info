import * as d3 from 'https://unpkg.com/d3-time-format?module'

// Create dataLoader object to global scope
// match = ['23.4.2019 - 5:40 - 21:09', '23.4.2019', '5:40', '21:09']
const re = /(\d{1,2}\.\d{1,2}\.\d{4}) - (\d{1,2}:\d{1,2}) - (\d{1,2}:\d{1,2})/g; 

const d3DateParser = d3.timeParse("%d.%m.%Y");

// Loads sample data and returns array of data elements
export default function(dataUrl, done) {

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

// Recursively parse data
function parseData(data, results) {
	let match = re.exec(data);
	if(!match){
		return results;
	}

	const date = d3DateParser(match[1].trim());
	results.dates.push(date);

	const dataElement = newDataElement(match[2], match[3]);
	results.values.push(dataElement);

	return parseData(data, results);
};

function newDataElement(riseTime, setTime) {
	return {
		rise:	toSeconds(riseTime.trim()),
		set: toSeconds(setTime.trim())
	}
}

function toSeconds(time) {
	const splitTime = time.split(":"); // "hh:mm" -> ["hh", "mm"]
	const hours = parseInt(splitTime[0]);
	const minutes = parseInt(splitTime[1]);

	return hours * 60 * 60 + minutes * 60;
}
