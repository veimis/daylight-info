// Depends on d3js

// Define graph in global scope
var graph = (function() {
	const svgWidth = 800;
	const svgHeight = 400
	const margins = {top: 30, right: 30, bottom: 20, left: 50};
	const colors = ["steelblue", "red"];

	return {
		// Assumes data is an array of 2 items
		render: function(chart, data) {
				
			chart = chart.attr('width', svgWidth)
					.attr('height', svgHeight);
		
			const scaleX = getScaleX(data);
			const scaleY = getScaleY();

			addPath(chart, data, scaleX, scaleY);
			addXaxis(chart, scaleX);
			addYaxis(chart, scaleY);
		}
	}	

	function getScaleX(data) {
		// Take the dates of each data item (domain) and translate to scaled values (range)
		return d3.scaleTime()
			.domain(d3.extent(data[0], item => item.date))
			.range([margins.left, svgWidth - margins.right])
	}

	function getScaleY() {
		// Take minutes per year (domain) and translate to scaled values (range)
		return d3.scaleLinear()
			.domain([0, 24 * 60]) // from 0 to 24h * 60 min/h
			.range([svgHeight - margins.bottom, margins.top]);
	}

	function addPath(chart, data, scaleX, scaleY) {
		const area = d3.area()
			.curve(d3.curveStep)
			// here d should be a data element defined in dataLoader.js
			.x(d => scaleX(d.date))
			.y0(d => scaleY(parseTime(d.rise)))
			.y1(d => scaleY(parseTime(d.set)));

		chart.selectAll("path")
			.data(data)
			.enter()
				.append("path")
				.attr("fill", (d, i, nodes) => colors[i] )
				.attr("d", area);
	}

	function parseTime(time) {
		const hours = parseInt(time.split(':')[0]);
		const minutes = parseInt(time.split(':')[1]);
		return hours * 60 + minutes;
	}

	function addXaxis(chart, scaleX) {
		chart.append("g")
			.attr("transform", `translate(0, ${svgHeight - margins.bottom})`)
			.call(d3.axisBottom(scaleX).ticks(12))
			.call(g => g.select(".domain").remove());
	}

	function addYaxis(chart, scaleY) {
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
