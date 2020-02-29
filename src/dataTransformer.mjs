// Daylight saving time start and end times
const date = new Date();
const currentYear = date.getFullYear();
const start = new Date(`${currentYear}-03-28`);
const end = new Date(`${currentYear}-10-24`);
const hourInSeconds = 3600;

export default function(data, dates) {
	return {
		winter: data.map(normalize, {dates}),
		summer: data.map(summerize, {dates})
	}
}

function summerize(item, i) {
	if(!isDaylightSavingDate(i, this.dates)) {
		return {
			rise: addOneHour(item.rise),
			set: addOneHour(item.set)
		};
	}

	return item;
}

function normalize(item, i) {
	if(isDaylightSavingDate(i, this.dates)) {
		return {
			rise: removeOneHour(item.rise),
			set: removeOneHour(item.set)
		};
	}

	return item;
}

function removeOneHour(time) {
	return time - hourInSeconds;
}

function addOneHour(time) {
	return time + hourInSeconds;
}

function isDaylightSavingDate(i, dates) {
	return dates[i] > start && dates[i] < end;
}
