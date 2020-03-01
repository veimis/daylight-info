// Daylight saving time start and end times
const date = new Date();
const currentYear = date.getFullYear();
const startOfDaylightSavingTime = getStartOfDaylightSavingTime();
const endOfDaylightSavingTime = getEndOfDaylightSavingTime();
const hourInSeconds = 3600;

function getStartOfDaylightSavingTime()
{
	const lastOfMarch = new Date(`${currentYear}-03-31 00:00:00`);
	return getLastSunday(lastOfMarch);
}

function getEndOfDaylightSavingTime() {
	const lastOfOctober = new Date(`${currentYear}-10-31 00:00:00`);
	return getLastSunday(lastOfOctober);
}

function getLastSunday(lastOfMonth) {
	const dayOfTheWeek = lastOfMonth.getDay();
	lastOfMonth.setDate(31 - dayOfTheWeek);
	return lastOfMonth;
}

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
	return dates[i] >= startOfDaylightSavingTime && dates[i] < endOfDaylightSavingTime;
}
