// Depends on dataLoader.js, graph.js

const rawData = dataLoader.load();
const dates = rawData.dates;
const data = dataTransformer.transform(rawData.values, dates);
const wakeUpTime = 25200; // 07:00

const summer = d3.select('#summer');
const summerWakeUp = generateWakeUpData(data.summer, wakeUpTime);
graph.render(summer, [data.summer, summerWakeUp], dates);

const winter = d3.select('#winter');
const winterWakeUp = generateWakeUpData(data.winter, wakeUpTime);
graph.render(winter, [data.winter, winterWakeUp], dates);

function generateWakeUpData(data, wakeUpTime) {
	return data.map(d => ({
		rise: d.rise < wakeUpTime ? d.rise : wakeUpTime,
		set: wakeUpTime
	}));
}
