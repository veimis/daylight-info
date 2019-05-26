// Depends on d3js

// Define graph in global scope
var graph = (function() {
	const svgWidth = 800;
	const svgHeight = 400
	const margins = {top: 30, right: 30, bottom: 20, left: 50};
	const colors = ["steelblue", "red"];
	
	// Take the dates of each data item (domain) and translate to scaled values (range)
	const scaleX = (d3.scaleLinear()
		.domain([0, 364]) // One year
		.range([margins.left, svgWidth - margins.right]));
	
	// Take minutes per year (domain) and translate to scaled values (range)
	const scaleY = (d3.scaleLinear()
			.domain([0, 24 * 60]) // from 0 to 24h * 60 min/h
			.range([svgHeight - margins.bottom, margins.top]));

	return {
		render: function(chart, data, dates) {
				
			chart = chart.attr('width', svgWidth)
					.attr('height', svgHeight);
		
			addPath(chart, data);
			addXaxis(chart, getScaleXwithDates(dates));
			addYaxis(chart);
		}
	}	

	function getScaleXwithDates(dates) {
		return d3.scaleTime()
			.domain(d3.extent(dates))
			.range([margins.left, svgWidth - margins.right]);
	}

	function addPath(chart, data) {
		const area = d3.area()
			.curve(d3.curveStep)
			// here d should be a data element defined in dataLoader.js
			.x((d, i) => scaleX(i))
			.y0(d => scaleY(parseTime(d.rise)))
			.y1(d => scaleY(parseTime(d.set)));

		chart.selectAll("path")
			// For each item in data array
			.data(data) 
			.enter()
				// Add new path to the SVG
				.append("path") 
				.attr("fill", (d, i, nodes) => colors[i])
				// The SVG d attribute defines a path to be drawn. 
				.attr("d", area);
	}

	function parseTime(time) {
		const hours = parseInt(time.split(':')[0]);
		const minutes = parseInt(time.split(':')[1]);
		return hours * 60 + minutes;
	}

	function addXaxis(chart, scaleXdates) {
		chart.append("g")
			.attr("transform", `translate(0, ${svgHeight - margins.bottom})`)
			.call(d3.axisBottom(scaleXdates).ticks(12))
			.call(g => g.select(".domain").remove());
	}

	function addYaxis(chart) {
		chart.append("g")
			.attr("transform", `translate(${margins.left - 10}, 0)`)	
			.call(d3.axisLeft(scaleY)
				.tickFormat(formatTime))
			.call(g => g.select(".domain").remove());
	}

	function formatTime(d) {
		const toStr = num => num.toString().padStart(2, '0');

		let hours = toStr(Math.floor(d / 60));
		let minutes = toStr(d % 60);

		return `${hours}:${minutes}`;
	};
}());
