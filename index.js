// Depends on dataLoader.js, graph.js

const rawData = dataLoader.load();
const data = dataTransformer.transform(rawData);

const summer = d3.select('#summer');
graph.render(summer, data.summer);

const winter = d3.select('#winter');
graph.render(winter, data.winter);

