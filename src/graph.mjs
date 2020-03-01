import * as d3 from 'https://unpkg.com/d3?module'

const svgWidth = 800;
const svgHeight = 400
const margins = {top: 30, right: 30, bottom: 20, left: 50};
const colors = ['steelblue', 'red'];

export default function(chart, data, dates) {

	chart = chart.attr('width', svgWidth)
		.attr('height', svgHeight);

	addPath(chart, data);
	addXaxis(chart, getScaleXwithDates(dates));
	addYaxis(chart);
	addLegends(chart);
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

	chart.selectAll('path')
		// For each item in data array
		.data(data) 
		.enter()
		// Add new path to the SVG
		.append('path') 
		.attr('fill', (d, i, nodes) => colors[i])
		// The SVG d attribute defines a path to be drawn. 
		.attr('d', area)
		.on('mouseover', show)
		.on('mousemove', updateCoordinates)
		.on('mouseout', hide);
}

function show(d, i) {
	d3.select(this).attr('opacity', 0.5);
	var div = d3.select('#tooltip')
	div.style('opacity', 1);
}

function updateCoordinates(d, i) {
	const div = d3.select('#tooltip');
	const coordinates = d3.mouse(chart);
	const x = coordinates[0];
	const y = coordinates[1];
	div.html(x + ', ' + y);
}

function hide(d, i) {
	d3.select(this).attr('opacity', 1);
	var div = d3.select('#tooltip')
	div.style('opacity', 0);
}

// Take the dates of each data item (domain) and translate to scaled values (range)
const scaleX = (d3.scaleLinear()
	.domain([0, 364]) // One year
	.range([margins.left, svgWidth - margins.right]));

// Take minutes per day (domain) and translate to scaled values (range)
const scaleY = (d3.scaleLinear()
	.domain([0, 24 * 60]) // from 0 to 24h * 60 min/h
	.range([svgHeight - margins.bottom, margins.top]));


function parseTime(time) {
	return time / 60; // seconds to minutes
}

function addXaxis(chart, scaleXdates) {
	chart.append('g')
		.attr('transform', `translate(0, ${svgHeight - margins.bottom})`)
		.call(d3.axisBottom(scaleXdates).ticks(12))
		.call(g => g.select('.domain').remove());
}

function addYaxis(chart) {
	chart.append('g')
		.attr('transform', `translate(${margins.left - 10}, 0)`)	
		.call(d3.axisLeft(scaleY)
			.tickFormat(formatTime))
		.call(g => g.select('.domain').remove());
}

function formatTime(d) {
	const toStr = num => num.toString().padStart(2, '0');

	let hours = toStr(Math.floor(d / 60));
	let minutes = toStr(d % 60);

	return `${hours}:${minutes}`;
};

function addLegends(chart) {
	const baseX = 680;
	const baseY = 50;
	const fontSize = '15px';
	const radius = 6;
	const alignment  = 'middle';

	chart.append('circle').attr('cx', baseX).attr('cy',baseY).attr('r', radius).style('fill', colors[0]);
	chart.append('circle').attr('cx', baseX).attr('cy',baseY + 30).attr('r', radius).style('fill', colors[1]);
	chart.append('text').attr('x', baseX + 20).attr('y', baseY).text('talviaika').style('font-size', fontSize).attr('alignment-baseline', alignment);
	chart.append('text').attr('x', baseX + 20).attr('y', baseY + 30).text('kesäaika').style('font-size', fontSize).attr('alignment-baseline', alignment);
}
