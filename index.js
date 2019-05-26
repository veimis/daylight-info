// Depends on dataLoader.js, graph.js

const rawData = dataLoader.load();
const dates = rawData.dates;
const data = dataTransformer.transform(rawData.values, dates);

const wakeUpLine = dates.map(d => ({
	rise: "07:00",
	set: "07:01"
	}));

const summer = d3.select('#summer');
graph.render(summer, [data.summer, wakeUpLine], dates);

const winter = d3.select('#winter');
graph.render(winter, [data.winter, wakeUpLine], dates);

