// Depends on d3js

// Define graph in global scope
var graph = (function() {
	const svgWidth = 800;
	const svgHeight = 400
	const margins = {top: 30, right: 30, bottom: 20, left: 50};

	function parseTime(time) {
		const hours = parseInt(time.split(':')[0]);
		const minutes = parseInt(time.split(':')[1]);
		return hours * 60 + minutes;
	}

	return {
		render: function(data) {
		
			const scaleX = d3.scaleTime()
				.domain(d3.extent(data, d => d.date))
				.range([margins.left, svgWidth - margins.right]);

			const scaleY = d3.scaleLinear()
				.domain([0, 24 * 60]) // from 0 to 24h * 60 min/h
				.range([svgHeight - margins.bottom, margins.top]);

			const chart = d3.select('svg')
				.attr('width', svgWidth)
				.attr('height', svgHeight);

			const area = d3.area()
				.curve(d3.curveStep)
				.x(d => scaleX(d.date))
				.y0(d => scaleY(parseTime(d.rise)))
				.y1(d => scaleY(parseTime(d.set)));

			// Add graph line
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
		}
	}
}());
