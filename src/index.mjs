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
			const sleepTime = 72000; // 20:00
			const getOfWorkTime = 61200; // 17:00

			findDifferenceInLightMornings(dates, data.winter, data.summer, wakeUpTime);
			findDifferenceInLightAfterWork(dates, data.winter, data.summer, getOfWorkTime);

			const chart = d3.select('#chart');
			const wakeUp = generateWakeUpData(data.winter, wakeUpTime);
			const sleep = generateSleepData(rawData.values, sleepTime);
			render(chart, [data.winter, data.summer, wakeUp, sleep], dates);

			setSource(dataUrl);
		});
}

function generateWakeUpData(data, wakeUpTime) {
	return data.map(d => ({
		rise: d.rise < wakeUpTime ? d.rise : wakeUpTime,
		set: wakeUpTime
	}));
}

function generateSleepData(data, sleepTime) {
	return data.map(d => ({
		rise: sleepTime,
		set: d.set > sleepTime ? d.set : sleepTime
	}));
}

function findDifferenceInLightMornings(dates, winter, summer, wakeUpTime){
	const diff = dates.map((item, i) => {
		if(winter[i].rise < wakeUpTime 
			&& summer[i].rise > wakeUpTime) {
			return {
				date: item,
				index: i
			};
		}
		
		return null;
	})
	.filter(item => item != null);

	const count = diff.length;
	d3.select('#lightMorningsInfo').html(
		`Talviajassa valoisia aamuja olisi vuosittain ${count} enemmän, kuin kesäajassa, jos herätään 07:00 aamulla. (Aamuja jolloin talviajassa aurinko on noussut ennen 07:00, mutta kesäajassa ei)`
	);
}

function findDifferenceInLightAfterWork(dates, winter, summer, getOfWorkTime) {
	const diff = dates.map((item, i) => {
		if(winter[i].set < getOfWorkTime
			&& summer[i].set > getOfWorkTime){
			return {
				date: item,
				index: i
			}
		}

		return null;
	})
	.filter(item => item != null);
	
	const count = diff.length;
	d3.select('#lightEveningsInfo').html(
		`Kesäajassa valoisia "iltoja" olisi vuosittain ${count} enemmän, kuin talviajassa, jos töistä pääsee 17:00. (Iltoja, jolloin kesäajassa aurinko ei ole laskenut ennen 17:00, mutta talviajassa on)`
	);
}

function setSource(url) {
	let div = d3.select('#source');
	div.html(`<a href="${url}">lähde</a>`);
}
