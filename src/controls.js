var controls = (function() {
	return {

		fetchPlaces: function() {
			event && event.preventDefault();

			const xhr = new XMLHttpRequest();
			xhr.open('GET', 'locations.html');
			//xhr.open('GET', getQuery());
			xhr.responseType = 'document';
			xhr.send();

			xhr.onload = () => {
				const places = parseData(xhr.response);
				const results = createResultList(places);

				updateResultsList(results);
			}

			xhr.onerror = () => {
				console.log(xhr);
				console.log('Failed to fetch places');
			}
		}
	}

	function getQuery() {
		const place = document.getElementById('place').value;
		const date = new Date();
		const day = date.getDate();
		const month = date.getMonth() + 1; // getMonth returns 0-11, we need 1-12
		const year = date.getFullYear();

		return `/data/taivas/?paikka=${place}&dy=${day}&mn=${month}&yr=${year}`;
	}

	function parseData(data) {
		// HTMLCollection is converted to an array with [...HTMLCollection]

		const tables = data.body.getElementsByTagName('table');

		const tableRows = [...tables[2].tBodies[0].children]; 
		tableRows.shift(); // Remove header row

		return getPlaces(tableRows);
	}

	function getPlaces(tableRows) {
		let places = [];

		tableRows.forEach(row => {
			const rowItems = [...row.children];
			const name = rowItems[2].childNodes[0].nodeValue.trim();
			const link = [...rowItems.pop().children].pop().href;
			places.push({name, link});
		});

		return places;
	}

	function createResultList(places) {
		let list = document.createElement('ul');

		places.forEach(place => {
			let listItem = document.createElement('li');
			listItem.appendChild(document.createTextNode(place.name));
			list.appendChild(listItem);
		});

		return list;
	}

	function updateResultsList(results) {
		const listElement = document.getElementById('places');

		while(listElement.firstChild) {
			listElement.removeChild(listElement.firstChild);
		}

		listElement.appendChild(results);
	}

}());
