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

			const summer = d3.select('#summer');
			const summerWakeUp = generateWakeUpData(data.summer, wakeUpTime);
			render(summer, [data.summer, summerWakeUp], dates);

			const winter = d3.select('#winter');
			const winterWakeUp = generateWakeUpData(data.winter, wakeUpTime);
			render(winter, [data.winter, winterWakeUp], dates);
		});
}

function generateWakeUpData(data, wakeUpTime) {
	return data.map(d => ({
		rise: d.rise < wakeUpTime ? d.rise : wakeUpTime,
		set: wakeUpTime
	}));
}
