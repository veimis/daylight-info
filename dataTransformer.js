var dataTransformer = (function() {
	return {
		transform: function(data) {
			return {
				winter: data.map(normalize),
				summer: data.map(summerize)
			}
		}
	}

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
}());
