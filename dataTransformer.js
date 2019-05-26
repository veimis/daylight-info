var dataTransformer = (function() {
	// Daylight saving time start and end times
	const start = new Date('2019-03-30');
	const end = new Date('2019-10-26');

	return {
		transform: function(data, dates) {
			return {
				winter: data.map(normalize),
				summer: data.map(summerize)
			}
		}
	}

	function summerize(item, i) {
		if(!isDaylightSavingDate(i)) {
			return {
				rise: addOneHour(item.rise),
				set: addOneHour(item.set)
			};
		}

		return item;
	}

	function normalize(item, i) {
		if(isDaylightSavingDate(i)) {
			return {
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

	function isDaylightSavingDate(i) {
		return dates[i] > start && dates[i] < end;
	}

	function toString(hours, minutes) {
		return hours.toString().padStart(2, '0') + ":" + minutes;
	}
}());
