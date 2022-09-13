import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SUPPORTED_NETWORKS } from "configure/network";

export const get = ({ url, query, mapping, variables, errorCallback, networkId }) => {
	// uri: process.env[`REACT_APP_${SUPPORTED_NETWORKS[networkId]}_THEGRAPH_URL`] + url,

	return new ApolloClient({
		uri: "https://dex-api.peri.finance",
		cache: new InMemoryCache(),
		connectToDevTools: true,
	})
		.query({
			query,
			variables,
		})
		.then((data) => mapping(data))
		.catch(errorCallback);
};
