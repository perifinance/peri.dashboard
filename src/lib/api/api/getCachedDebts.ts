import { getSupportedNetworks } from "configure/network";

import { getCachedDebt } from "../queries";
import { get } from "../service";
export const getCachedDebts = async () => {
	const promise = [];

	await getSupportedNetworks().forEach((networkId) => {
		promise.push(get(getCachedDebt({ networkId })));
	});

	return await Promise.all(promise).then((item) => {
		let totalDebt = 0n;
		let debtInfo = {};

		item.forEach((e) => {
			if (!debtInfo[e.networkId]) {
				debtInfo[e.networkId] = {};
			}
			debtInfo[e.networkId]["total"] = e.debt;
			totalDebt = totalDebt + e.debt;
		});

		return {
			total: {
				total: totalDebt,
			},
			...debtInfo,
		};
	});
};
