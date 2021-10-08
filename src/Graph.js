import Plot from 'react-plotly.js';
import styles from './Graph.module.css';

export default function Graph({amplData}) {
	const x = amplData.map(({price}) => price);
	const y = amplData.map(({market_cap}) => market_cap);
	const z = amplData.map(({total_volume}) => total_volume);
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
			xaxis: {
				title: {
					text: 'Price'
				}
			},
			yaxis: {
				title: {
					text: 'Market Cap'
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
