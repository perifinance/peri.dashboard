import { getSupportedNetworks } from "configure/network/getSupportedNetworks";

import { addDays } from "date-fns";

import { formatDay } from "lib/format";

import { debtCaches } from "../queries";
import { get } from "../service";
export const getDebtCaches = async () => {
	let day = 30;
	let searchDate = Number((new Date().getTime() / 1000).toFixed(0)) - 60 * 60 * 24 * day;
	let promise = [];
	const datas = {};
	const supportedNetworks = getSupportedNetworks();

	supportedNetworks.forEach((networkId) => {
		promise.push(
			(async () => {
				return (datas[networkId.toString()] = await get(debtCaches({ searchDate, networkId })));
			})()
		);
	});

	return await Promise.all(promise).then((debtCaches) => {
		let days = [];

		// 측정 기간 1개월
		for (let a = 1; a < day + 1; a++) {
			let day = addDays(new Date(Number(searchDate) * 1000), a);
			days.push(formatDay(Number(day) / 1000));
		}

		// console.log(debtCaches);

		// 데이터 변환 로직
		return days.map((day) => {
			let previous = [];
			let returnValue = {};
			let tempDebtBalanceToNumber = 14611.70139393982;

			debtCaches.forEach((e: any[], i: number) => {
				e.forEach((element) => {
					if (!previous[i]) {
						previous[i] = element;
					}

					if (element.network === "ETHEREUM" ) {
						if (tempDebtBalanceToNumber < 10) {
							element.debtBalanceToNumber = tempDebtBalanceToNumber;
						} else {
							tempDebtBalanceToNumber = element.debtBalanceToNumber;
						}
					}

					if (day === element.date) {
						returnValue["date"] = element.date.split("/").splice(1).join("/");
						// returnValue[supportedNetworks[i].toString()] = element.debtBalanceToNumber;
						returnValue[element.network] = element.debtBalanceToNumber;
						previous[i] = element;
					} else {
						// returnValue[supportedNetworks[i].toString()] = previous[i].debtBalanceToNumber;
						returnValue[element.network] = previous[i].debtBalanceToNumber;
					}
				});
			});

			return {
				...returnValue,
				min: Math.min(
					...Object.values(returnValue).map((e) => {
						if (typeof e === "string") return 1000000000000000000;
						return Number(e);
					})
				),
				max: Math.max(
					...Object.values(returnValue).map((e) => {
						if (typeof e === "string") return null;
						return Number(e);
					})
				),
			};
		});
	});
};
