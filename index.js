// Depends on dataLoader.js, graph.js

const start = new Date('2019-03-30');
const end = new Date('2019-10-26');

const rawData = dataLoader.load();
const data = dataTransformer.transform(rawData);

const summer = d3.select('#summer');
graph.render(summer, data.summer);

const winter = d3.select('#winter');
graph.render(winter, data.winter);
