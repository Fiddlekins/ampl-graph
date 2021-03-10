// Called when the Visualization API is loaded.
function drawVisualization(data) {
	// specify options
	var options = {
		width: `${window.innerWidth}px`,
		height: `${window.innerHeight}px`,
		style: 'line',
		showPerspective: false,
		showGrid: true,
		keepAspectRatio: false,
		verticalRatio: 1.0,
		xLabel: 'Market Cap',
		yLabel: 'Price',
		zLabel: 'Total Volume'
	};

	// create our graph
	var container = document.getElementById('mygraph');
	const graph = new vis.Graph3d(container, data, options);

	graph.setCameraPosition(0.4, undefined, undefined);
}

async function updateData() {
	const res = await fetch(`https://api.coingecko.com/api/v3/coins/ampleforth/market_chart?vs_currency=usd&days=max`);
	const {market_caps, prices, total_volumes} = await res.json();
	const data = new vis.DataSet();
	for (let dayIndex = 0; dayIndex < market_caps.length; dayIndex++) {
		data.add({
			x: Math.log10(market_caps[dayIndex][1]),
			y: prices[dayIndex][1],
			z: Math.log10(total_volumes[dayIndex][1])
		});
	}

	drawVisualization(data);
}

updateData();