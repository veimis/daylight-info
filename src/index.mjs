import * as d3 from 'https://unpkg.com/d3-selection?module'
import load from './dataLoader.mjs'
import transform from './dataTransformer.mjs'
import render from './graph.mjs'
import {
	ELEMENT_ID_CHART,
	ELEMENT_ID_WAKEUP,
	ELEMENT_ID_GETOFFWORK,
	ELEMENT_ID_EVENINGINFO,
	ELEMENT_ID_MORNINGINFO,
	ELEMENT_ID_DATA_SOURCE
} from './constants.mjs'

export default function(dataUrl) {
	load(
		dataUrl,
		rawData => 
		{
			const dates = rawData.dates;
			const data = transform(rawData.values, dates);

			const morningDiff = findDifferenceInLightMornings(dates, data.winter, data.summer);
			const eveningDiff = findDifferenceInLightAfterWork(dates, data.winter, data.summer);

			const chart = d3.select(`#${ELEMENT_ID_CHART}`);
			render(chart, [data.winter, data.summer, morningDiff, eveningDiff], dates);

			setSource(dataUrl);
		});
}

export function findDifferenceInLightMornings(dates, winter, summer){
	const time = document.getElementById(ELEMENT_ID_WAKEUP).value;
	const wakeUpTime = toSeconds(time);

	const diff = dates.map((item, i) => {
		if(winter[i].rise < wakeUpTime && summer[i].rise > wakeUpTime) {
			return {
				date: item,
				rise: 0,
				set: wakeUpTime
			};
		}
		
		return null;
	});

	const count = diff.filter(item => item != null).length;
	d3.select(`#${ELEMENT_ID_MORNINGINFO}`).html(
		`Talviajassa valoisia aamuja olisi vuosittain ${count} enemmän, kuin kesäajassa, jos herätään ${time} aamulla. (Aamuja jolloin talviajassa aurinko on noussut ennen ${time}, mutta kesäajassa ei)`
	);

	return diff.map((item, i) => item === null ? {rise: wakeUpTime, set: wakeUpTime - 100} : item);
}

export function findDifferenceInLightAfterWork(dates, winter, summer) {
	const time = document.getElementById(ELEMENT_ID_GETOFFWORK).value;
	const getOfWorkTime = toSeconds(time);
	
	const diff = dates.map((item, i) => {
		if(winter[i].set < getOfWorkTime
			&& summer[i].set > getOfWorkTime){
			return {
				rise: getOfWorkTime,
				set: 24*60*60
			}
		}

		return null;
	});
	
	const count = diff.filter(item => item != null).length;
	d3.select(`#${ELEMENT_ID_EVENINGINFO}`).html(
		`Kesäajassa valoisia "iltoja" olisi vuosittain ${count} enemmän, kuin talviajassa, jos töistä pääsee ${time}. (Iltoja, jolloin kesäajassa aurinko ei ole laskenut ennen ${time}, mutta talviajassa on)`
	);

	return diff.map((item, i) => item === null ? {rise: getOfWorkTime, set: getOfWorkTime + 100} : item);
}

function setSource(url) {
	let div = d3.select(`#${ELEMENT_ID_DATA_SOURCE}`);

	// Strip /data from the beginning of string as its used by the nginx web server
	// to reroute to moisio.fi
	// i.e. /data/taivas/... -> http.moisio.fi/taivas/...
	div.html(`<a href="http://moisio.fi${url.substring(5)}">tietolähde</a>`);
}

function toSeconds(time) {
	const splitTime = time.split(":"); // "hh:mm" -> ["hh", "mm"]
	const hours = parseInt(splitTime[0]);
	const minutes = parseInt(splitTime[1]);

	return hours * 60 * 60 + minutes * 60;
}
