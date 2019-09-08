// Depends on dataLoader.js, graph.js

function refresh(dataUrl) {
	dataLoader.load(
		dataUrl,
		rawData => 
		{
			const dates = rawData.dates;
			const data = dataTransformer.transform(rawData.values, dates);
			const wakeUpTime = 25200; // 07:00

			const summer = d3.select('#summer');
			const summerWakeUp = generateWakeUpData(data.summer, wakeUpTime);
			graph.render(summer, [data.summer, summerWakeUp], dates);

			const winter = d3.select('#winter');
			const winterWakeUp = generateWakeUpData(data.winter, wakeUpTime);
			graph.render(winter, [data.winter, winterWakeUp], dates);
		});
}

function generateWakeUpData(data, wakeUpTime) {
	return data.map(d => ({
		rise: d.rise < wakeUpTime ? d.rise : wakeUpTime,
		set: wakeUpTime
	}));
}

let url = 'sample-data.htm';
//let url = '/data/taivas/aurinkokalenteriascii.php?mode=1&zc=37&paikka=Tampere&latdeg=61.5&long=23.75&dy=20&mn=01&yr=2019&kk=12';
refresh(url);

