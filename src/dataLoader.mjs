import * as d3 from 'https://unpkg.com/d3-time-format?module'
import { DAY_AS_SECONDS } from './constants.mjs'

// 22.5.2020 - 2:59 - 23:32 - 1:44
// match = ['23.4.2019 - 5:40 - 21:09', '23.4.2019', '5:40', '21:09']
// 6.6.2020 -   -   -   -   -   -
// match = ['6.6.2020 - - - -', '6.6.2020', '-', '-'] # for polar days
//const re = /(\d{1,2}\.\d{1,2}\.\d{4}) - (\d{1,2}:\d{1,2}|\s*-\s*) - (\d{1,2}:\d{1,2}|\s*-)/g;
const re = /(\d{1,2}\.\d{1,2}\.\d{4}) - (\d{1,2}:\d{1,2}|(?:&nbsp;){2}-(?:&nbsp;){2}) - (\d{1,2}:\d{1,2}\*?|(?:&nbsp;){2}-(?:&nbsp;){2})/g;
const NO_DATA_SYMBOL = '&nbsp;&nbsp;-&nbsp;&nbsp;';
const SUNSET_AFTER_MIDNIGHT_INDICATOR = '*';
const currentYear = new Date().getFullYear();
const firstOfMarch = new Date(`${currentYear}-03-01`);
const firstOfOctober = new Date(`${currentYear}-10-01`);

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

	const dataElement = newDataElement(
		match[2].trim(), 
		match[3].trim(),
		isPolarNightDate(date));
	results.values.push(dataElement);

	return parseData(data, results);
};

function isPolarNightDate(date) {
	return date < firstOfMarch || date > firstOfOctober;
}

function newDataElement(riseTime, setTime, isPolarNightDate) {
	return {
		rise:	noData(riseTime) ? 0 : toSeconds(riseTime),
		set: noData(setTime) ? getPolarNightOrDayValue(isPolarNightDate) : toSeconds(setTime)
	}
}

function noData(time) {
	// Source data has NO_DATA_SYMBOL instead of a value when the sun does not rise or set
	// When sun sets after midnight, there is an asterisk after the value
	return time === NO_DATA_SYMBOL || time.includes(SUNSET_AFTER_MIDNIGHT_INDICATOR);
}

// During polar night the sun does not rise, during polar day the sun does not set
function getPolarNightOrDayValue(isPolarNight) {
	return isPolarNight ? 0 : DAY_AS_SECONDS;
}

export function toSeconds(time) {
	const splitTime = time.split(":"); // "hh:mm" -> ["hh", "mm"]
	const hours = parseInt(splitTime[0]);
	const minutes = parseInt(splitTime[1]);

	return hours * 60 * 60 + minutes * 60;
}
