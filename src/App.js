import {useEffect, useState} from 'react';
import amplDataFount from './amplDataFount.js';
import styles from './App.module.css';
import Graph from './Graph.js';

function App() {
	const [amplData, setAmplData] = useState([]);
	useEffect(() => {
		const onData = (data) => {
			setAmplData(data);
		}
		amplDataFount.on('data', onData);
		return () => {
			amplDataFount.off('data', onData);
		}
	})
	return (
		<div className={styles.app}>
			<Graph amplData={amplData}/>
		</div>
	);
}

export default App;