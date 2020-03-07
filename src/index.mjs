import * as d3 from 'https://unpkg.com/d3-selection?module'
import load from './dataLoader.mjs'
import transform from './dataTransformer.mjs'
import render from './graph.mjs'

export default function(dataUrl) {
	load(
		dataUrl,
		rawData => 
		{
			const dates = rawData.dates;
			const data = transform(rawData.values, dates);
			const wakeUpTime = 25200; // 07:00
			const getOfWorkTime = 61200; // 17:00

			const morningDiff = findDifferenceInLightMornings(dates, data.winter, data.summer, wakeUpTime);
			const eveningDiff = findDifferenceInLightAfterWork(dates, data.winter, data.summer, getOfWorkTime);

			const chart = d3.select('#chart');
			render(chart, [data.winter, data.summer, morningDiff, eveningDiff], dates);

			setSource(dataUrl);
		});
}

function findDifferenceInLightMornings(dates, winter, summer, wakeUpTime){
	const diff = dates.map((item, i) => {
		if(winter[i].rise < wakeUpTime 
			&& summer[i].rise > wakeUpTime) {
			return {
				date: item,
				rise: 0,
				set: wakeUpTime
			};
		}
		
		return null;
	});

	const count = diff.filter(item => item != null).length;
	d3.select('#lightMorningsInfo').html(
		`Talviajassa valoisia aamuja olisi vuosittain ${count} enemmän, kuin kesäajassa, jos herätään 07:00 aamulla. (Aamuja jolloin talviajassa aurinko on noussut ennen 07:00, mutta kesäajassa ei)`
	);

	return diff.map((item, i) => item === null ? {rise: 0, set: 0} : item);
}

function findDifferenceInLightAfterWork(dates, winter, summer, getOfWorkTime) {
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
	d3.select('#lightEveningsInfo').html(
		`Kesäajassa valoisia "iltoja" olisi vuosittain ${count} enemmän, kuin talviajassa, jos töistä pääsee 17:00. (Iltoja, jolloin kesäajassa aurinko ei ole laskenut ennen 17:00, mutta talviajassa on)`
	);

	return diff.map((item, i) => item === null ? {rise: 0, set: 0} : item);
}

function setSource(url) {
	let div = d3.select('#source');
	div.html(`<a href="${url}">tietolähde</a>`);
}
