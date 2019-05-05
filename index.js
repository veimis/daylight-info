// Depends on dataLoader.js, graph.js

const data = dataLoader.load();

const selection = d3.select('svg');
graph.render(selection, data);

