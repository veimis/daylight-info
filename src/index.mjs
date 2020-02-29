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
			const sleepTime = 79200; // 22:00

			const chart = d3.select('#chart');
			const wakeUp = generateWakeUpData(data.winter, wakeUpTime);
			const sleep = generateSleepData(rawData.values, sleepTime);
			render(chart, [data.winter, data.summer, wakeUp, sleep], dates);
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
