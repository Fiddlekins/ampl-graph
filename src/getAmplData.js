const dayMs = 1000 * 60 * 60 * 24;

export default async function getAmplData() {
	const res = await fetch(`https://api.coingecko.com/api/v3/coins/ampleforth/market_chart?vs_currency=usd&days=max`);
	const {market_caps, prices, total_volumes} = await res.json();
	const aggregatedData = {};
	for (const [timestamp, value] of market_caps) {
		if (!aggregatedData[timestamp]) {
			aggregatedData[timestamp] = {timestamp};
		}
		aggregatedData[timestamp].market_cap = value;
	}
	for (const [timestamp, value] of prices) {
		if (!aggregatedData[timestamp]) {
			aggregatedData[timestamp] = {timestamp};
		}
		aggregatedData[timestamp].price = value;
	}
	for (const [timestamp, value] of total_volumes) {
		if (!aggregatedData[timestamp]) {
			aggregatedData[timestamp] = {timestamp};
		}
		aggregatedData[timestamp].total_volume = value;
	}
	const sortedTimestamps = Object.keys(aggregatedData).map(key => parseInt(key, 10)).sort((a, b) => a - b);
	const timestampStart = sortedTimestamps[0];
	return sortedTimestamps.map(timestamp => {
		const {market_cap, price, total_volume} = aggregatedData[timestamp];
		return {
			market_cap,
			price,
			total_volume,
			daysSinceStart: (timestamp - timestampStart) / dayMs
		};
	});
}
