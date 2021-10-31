import Plot from 'react-plotly.js';
import styles from './Graph.module.css';

export default function Graph({amplData}) {
	const x = amplData.map(({price}) => price);
	const y = amplData.map(({totalSupply}) => totalSupply);
	const z = amplData.map(({totalVolume}) => totalVolume);
	const days = amplData.map(({daysSinceStart}) => daysSinceStart);
	const data = [
		{
			x,
			y,
			z,
			type: 'scatter3d',
			mode: 'lines+markers',
			marker: {
				color: days,
				colorscale: 'Rainbow',
				size: 3
			},
			text: days.map(value => `Day ${value}`)
		}
	];
	const layout = {
		autosize: true,
		title: 'AMPL historical data',
		scene: {
			aspectratio: {
				x: 1,
				y: 1,
				z: 1
			},
			xaxis: {
				title: {
					text: 'Price'
				}
			},
			yaxis: {
				title: {
					text: 'Total Supply'
				},
				type: 'log',
				autorange: true
			},
			zaxis: {
				title: {
					text: 'Total Volume'
				},
				type: 'log',
				autorange: true
			}
		}
	};
	return (
		<Plot data={data} layout={layout} useResizeHandler={true} className={styles.plot}/>
	);
}
