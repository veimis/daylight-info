// Depends on dataLoader.js, graph.js

const rawData = dataLoader.load();
const data = dataTransformer.transform(rawData);

const wakeUpLine = data.summer.map(d => ({
	date: d.date,
	rise: "07:00",
	set: "07:01"
	}));

const summer = d3.select('#summer');
graph.render(summer, [data.summer, wakeUpLine]);

const winter = d3.select('#winter');
graph.render(winter, [data.winter, wakeUpLine]);

