var controls = (function() {
	// http://moisio.fi/aurinkokalenteri.php?/mode=1&amp;zc=37&amp;paikka=Tampere&amp;latdeg=61.5&amp;long=23.75&amp;dy=4&amp;mn=8&amp;yr=2019&amp;kk=12
	const re = /^.*\/aurinkokalenteri\.php\?(.*)$/;

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
			const rawUrl = [...rowItems.pop().children].pop().href;
			const url = `/data/taivas/aurinkokalenteri.php?${re.exec(rawUrl)[1]}`;

			places.push({name, url});
		});

		return places;
	}

	function createResultList(places) {
		let list = document.createElement('ul');

		// <li><a href="place.url">place.name</a></li>
		places.forEach(place => {
			let listItem = document.createElement('li');
			let link = document.createElement('a');
			link.href = place.url;
			link.appendChild(document.createTextNode(place.name));
			listItem.appendChild(link);
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
