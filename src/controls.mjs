import { 
	default as refresh,
	findDifferenceInLightMornings,
	findDifferenceInLightAfterWork 
} from './index.mjs';
import { addPaths } from './graph.mjs'
import {
	ELEMENT_ID_PLACESFORM,
	ELEMENT_ID_PLACES,
	ELEMENT_ID_PLACEINPUT,
	ELEMENT_ID_DATA,
	ELEMENT_ID_WAKEUP,
	ELEMENT_ID_GETOFFWORK,
	TAG_NAME_TABLE,
	ELEMENT_ID_CHART
} from './constants.mjs'

// Bind form onsubmit event when hmtl is ready
document.addEventListener('DOMContentLoaded', function(event) {
	document.getElementById(ELEMENT_ID_PLACESFORM).onsubmit = fetchPlaces;
	document.getElementById(ELEMENT_ID_WAKEUP).onchange = render;
	document.getElementById(ELEMENT_ID_GETOFFWORK).onchange = render;
});

function render() {
	const chart = d3.select(`#${ELEMENT_ID_CHART}`);
	
	// Get winter and summer data
	const winter = chart.select('path#winter').data()[0];
	const summer = chart.select('path#summer').data()[0];

	// Calculate diff
	const dates = Array.from({length: 365}, (v, i) => i);
	const morningDiff = findDifferenceInLightMornings(dates, winter, summer);
	const eveningDiff = findDifferenceInLightAfterWork(dates, winter, summer);

	// Refresh graph
	addPaths(chart, [winter, summer, morningDiff, eveningDiff]);
}

// http://moisio.fi/aurinkokalenteri.php?/mode=1&amp;zc=37&amp;paikka=Tampere&amp;latdeg=61.5&amp;long=23.75&amp;dy=4&amp;mn=8&amp;yr=2019&amp;kk=12
const re = /^.*\/aurinkokalenteri\.php\?(.*)$/;

function fetchPlaces() {
	event && event.preventDefault();

	const xhr = new XMLHttpRequest();
	xhr.open('GET', getQuery());
	xhr.responseType = 'document';
	xhr.send();

	xhr.onload = () => {
		const places = parseData(xhr.response);
		const placesElement = document.getElementById(ELEMENT_ID_PLACES);
		const results = createResultList(places, placesElement);

		updateResultsList(results, placesElement);
		showPlaces();
	}

	xhr.onerror = () => {
		console.log(xhr);
		console.log('Failed to fetch places');
	}
}

function getQuery() {
	const place = document.getElementById(ELEMENT_ID_PLACEINPUT).value;
	const date = new Date();
	const day = 1;
	const month = 1;
	const year = date.getFullYear();

	return `/data/taivas/?paikka=${place}&dy=${day}&mn=${month}&yr=${year}`;
}

function parseData(data) {
	// Type HTMLCollection is converted to an array with [...HTMLCollection]

	const tables = data.body.getElementsByTagName(TAG_NAME_TABLE);

	const tableRows = [...tables[2].tBodies[0].children]; 
	tableRows.shift(); // Remove header row

	return getPlaces(tableRows);
}

function getPlaces(tableRows) {
	let places = [];

	// Find location name and url to 12 month daylight data for that location
	tableRows.forEach(row => {
		const rowItems = [...row.children];
		const name = rowItems[2].childNodes[0].nodeValue.trim();
		const rawUrl = [...rowItems.pop().children].pop().href;
		const url = `/data/taivas/aurinkokalenteriascii.php?${re.exec(rawUrl)[1]}`;

		places.push({name, url});
	});

	return places;
}

function createResultList(places, placesElement) {
	let list = document.createElement('ul');

	// <li><a href="place.url">place.name</a></li>
	places.forEach(place => {
		let listItem = document.createElement('li');
		let link = document.createElement('a');
		link.href = place.url;
		link.onclick = () => { 
			refresh(place.url); 
			showGraph();
			return false; }
		link.appendChild(document.createTextNode(place.name));
		listItem.appendChild(link);
		list.appendChild(listItem);
	});

	return list;
}

function updateResultsList(results, placesElement) {
	while(placesElement.firstChild) {
		placesElement.removeChild(placesElement.firstChild);
	}

	placesElement.appendChild(results);
}

function showPlaces() {
	const places = document.getElementById(ELEMENT_ID_PLACES);
	places.style.display = 'block';

	const data = document.getElementById(ELEMENT_ID_DATA);
	data.style.display = 'none';
}

function showGraph() {
	const places = document.getElementById(ELEMENT_ID_PLACES);
	places.style.display = 'none';

	const data = document.getElementById(ELEMENT_ID_DATA);
	data.style.display = 'block';
}
