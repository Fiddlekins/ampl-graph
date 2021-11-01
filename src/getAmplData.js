import {ApolloClient, gql, InMemoryCache} from '@apollo/client';

const dayMs = 1000 * 60 * 60 * 24;
export const client = new ApolloClient({
	uri: 'https://api.thegraph.com/subgraphs/name/aalavandhan/ampleforth',
	cache: new InMemoryCache(),
});

export const GET_REBASES = gql`
  query getRebases($first: Int, $lastEpoch: BigInt!) {
    rebases(first: $first, orderBy: epoch, where: { epoch_gte: $lastEpoch }) {
      id,
      supply,
      epoch
    }
  }
`;

async function getTotalSupplyData() {
	const data = [];
	const ids = new Set();
	const first = 1000;
	let iterate = true;
	let lastEpoch = 0;
	while (iterate) {
		const rebasesResponse = await client.query({
			query: GET_REBASES,
			variables: {
				first,
				lastEpoch
			}
		});
		const {rebases} = rebasesResponse.data;
		iterate = rebases.length >= first;
		lastEpoch = parseInt(rebases[rebases.length - 1].epoch, 10);
		for (const rebase of rebases) {
			if (!ids.has(rebase.id)) {
				data.push(rebase);
				ids.add(rebase.id);
			}
		}
	}
	return data.map(({supply, epoch}) => {
		return {
			epoch: parseInt(epoch, 10),
			totalSupply: parseFloat(supply)
		};
	});
}

async function getMarketData() {
	const res = await fetch(`https://api.coingecko.com/api/v3/coins/ampleforth/market_chart?vs_currency=usd&days=max`);
	return res.json();
}

export default async function getAmplData() {
	const [totalSupplyData, marketData] = await Promise.all([
		getTotalSupplyData(),
		getMarketData()
	]);
	const {market_caps, prices, total_volumes} = marketData;
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
	return sortedTimestamps.map((timestamp, index) => {
		const {market_cap, price, total_volume} = aggregatedData[timestamp];
		// Reuse previous day's supply during the period between coingecko updating and rebase happening
		const {totalSupply} = totalSupplyData[index] || totalSupplyData[index - 1];
		const daysSinceStart = (timestamp - timestampStart) / dayMs;
		return {
			marketCap: market_cap,
			price,
			totalVolume: total_volume,
			totalSupply,
			daysSinceStart
		};
	});
}
