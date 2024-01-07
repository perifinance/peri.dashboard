import { gql } from "@apollo/client";

export const lastRate = ({currencyKeys, networkId}) => {

	const withoutUSD = currencyKeys.filter((currencyKey) => currencyKey !== "pUSD");
	const currencyName = withoutUSD.map((currencyKey) => {
		return currencyKey[0] === "p" ? currencyKey === "p1INCH" ? "INCH" : currencyKey.substring(1) : currencyKey;
	});

	const variables = { currencyKeys: currencyName };

	const RateMapping = (data) => {
		const name = data.currencyName === "INCH" ? "1INCH" : data.currencyName;
        return {currencyKey:name, price: BigInt(data.price) * 10n ** 10n, timestamp: data.timestamp};
    };

    return {
        url: ``,
        query: gql`
			query {
				aggregatorLastRates(
					currencyKeys: ${JSON.stringify(variables.currencyKeys)},
				) {
					id
					currencyName
					decimals
					price
					timestamp
				}
			}
		`,
        variables,
        mapping: ({ data }) => {
			const aggregatorLastRates = data.aggregatorLastRates;
            return aggregatorLastRates.map((item) => RateMapping(item));
        },
        errorCallback: () => {
            return [];
        },
		networkId,
    };
};
