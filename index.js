// Depends on dataLoader.js, graph.js

const start = new Date('2019-03-30');
const end = new Date('2019-10-26');

const data = dataLoader.load();

const summerData = data.map(summerize);
const summer = d3.select('#summer');
graph.render(summer, summerData);

const winterData = data.map(normalize);
const winter = d3.select('#winter');
graph.render(winter, winterData);

function summerize(item) {
	if(!isDaylightSavingDate(item)) {
		return {
			date: item.date,
			rise: addOneHour(item.rise),
			set: addOneHour(item.set)
		};
	}

	return item;
}

function normalize(item) {
	if(isDaylightSavingDate(item)) {
		return {
			date: item.date,
			rise: removeOneHour(item.rise),
			set: removeOneHour(item.set)
		};
	}
	
	return item;
}

function removeOneHour(time) {
	const splitTime = time.split(':');
	const hours = parseInt(splitTime[0]) - 1;
	const minutes = parseInt(splitTime[1]);
	
	return toString(hours, minutes);
}

function addOneHour(time) {
	const splitTime = time.split(':');
	const hours = parseInt(splitTime[0]) + 1;
	const minutes = parseInt(splitTime[1]);

	return toString(hours, minutes);
}

function isDaylightSavingDate(item) {
	return item.date > start && item.date < end;
}

function toString(hours, minutes) {
	return hours.toString().padStart(2, '0') + ":" + minutes;
}

