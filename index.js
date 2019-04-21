const parseDate = d3.timeParse("%d.%m.%Y");

// Load data
let http = new XMLHttpRequest();
http.open('GET', 'file:///C:/Users/ilkvei/projects/daylight-info/sample-data.htm', false);
http.send();
let buffer = http.responseText;

const re = /\d{1,2}\.\d{1,2}\.\d{4}( - \d{1,2}:\d{1,2}){2}/g;

const parseItem = line => {
	let parts = line.split('-');
	return {
		date: parseDate(parts[0].trim()),
		rise: parts[1].trim(),
		set: parts[2].trim()
	};
};

const parseData = (data, results) => {
	let match = re.exec(data);
	if(!match){
		return results;
	}

	results.push(parseItem(match[0]));
	return parseData(data, results);
};

const data = parseData(buffer, []);

// Parse time value
const parse = time => {
	const hours = parseInt(time.split(':')[0]);
	const minutes = parseInt(time.split(':')[1]);
	return hours * 60 + minutes;
};

const svgWidth = 800;
const svgHeight = 400
const margins = {top: 30, right: 30, bottom: 20, left: 50};

const scaleX = d3.scaleTime()
	.domain(d3.extent(data, d => d.date))
	.range([margins.left, svgWidth - margins.right]);

const scaleY = d3.scaleLinear()
	.domain([0, 24 * 60]) // from 0 to 24h * 60 min/h
	.range([svgHeight - margins.bottom, margins.top]);

const area = d3.area()
	.curve(d3.curveStep)
	.x(d => scaleX(d.date))
	.y0(d => scaleY(parse(d.rise)))
	.y1(d => scaleY(parse(d.set)));

const chart = d3.select('svg')
	.attr('width', svgWidth)
	.attr('height', svgHeight);

// Add graph
chart.append("path")
	.datum(data)
	.attr("fill", "steelblue")
	.attr("d", area);

// Add x-axis
chart.append("g")
	.attr("transform", `translate(0, ${svgHeight - margins.bottom})`)
	.call(d3.axisBottom(scaleX).ticks(12))
	.call(g => g.select(".domain").remove());

const formatTime = d => {
	const toStr = num => num.toString().padStart(2, '0');

	let hours = toStr(Math.floor(d / 60));
	let minutes = toStr(d % 60);

	return `${hours}:${minutes}`;
};

// Add y-axis
chart.append("g")
	.attr("transform", `translate(${margins.left - 10}, 0)`)	
	.call(d3.axisLeft(scaleY)
		.tickFormat(formatTime))
	.call(g => g.select(".domain").remove());

