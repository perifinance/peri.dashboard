import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { utils } from "ethers";
import { formatShortenCurrency, formatNumberToPer } from "lib/format";

import Card from "components/Card";
import Title from "components/Title";
import PieChart from "components/PieChart";
import ColorVerticalLabel from "components/ColorVerticalLabel";

const colors = ["bg-blue-500", "bg-pink-500", "bg-green-500", "bg-pink-700", "bg-blue-700", "bg-orange-500"];

const TradingVolume = ({ togglePUSD }) => {
	const { dexIsReady } = useSelector((state: RootState) => state.app);
	const { exchangeVolumes } = useSelector((state: RootState) => state.exchangeVolumes);
	const [totalVolume, setTotalVolume] = useState(0n);
	const [pynthsByVolumes, setPynthsByVolumes] = useState([]);

	const getPynthsByVolumes = () => {
		let total = 0n;
		const pynthsByVolumes = exchangeVolumes.map((volume) => {
			const pynthsByVolume = volume.reduce((a, b) => {
				return a + b.usdVolume;
			}, 0n);

			if (volume[0].currencyName !== "pUSD") {
				total = total + pynthsByVolume;
			} else if (volume[0].currencyName === "pUSD" && togglePUSD) {
				total = total + pynthsByVolume;
			}

			return {
				...volume[0],
				usdVolume: pynthsByVolume,
			};
		});
		setTotalVolume(total);
		!togglePUSD &&
			pynthsByVolumes.splice(
				pynthsByVolumes.findIndex((el) => el.currencyName === "pUSD"),
				1
			);
		pynthsByVolumes.sort((a, b) => {
			if (a.usdVolume < b.usdVolume) return 1;
			else if (a.usdVolume > b.usdVolume) return -1;
			else return 0;
		});
		let newList = pynthsByVolumes.slice(0, 5);
		let etcList = pynthsByVolumes.slice(5);
		let sum = 0n;
		for (let i = 0; i < etcList.length; i++) {
			sum += etcList[i].usdVolume;
		}
		newList.push({ id: "", currencyName: "ETC", timestamp: "", amount: 0n, usdVolume: sum });

		return newList;
	};

	const init = () => {
		let pynthsByTotalSupplies = getPynthsByVolumes();
		setPynthsByVolumes(pynthsByTotalSupplies);
	};

	useEffect(() => {
		if (dexIsReady) {
			init();
		}
	}, [dexIsReady, exchangeVolumes]);

	return (
		<Card>
			<Title>24H Trading Volume</Title>
			<div className="flex lg:flex-row flex-col lg:justify-between lg:h-[80%]">
				<div className="flex lg:flex-col gap-5 lg:gap-2 lg:items-center justify-between">
					<div className="w-40 lg:w-44 h-40 lg:h-44 my-auto">
						{pynthsByVolumes.length > 0 && (
							<PieChart x={"currencyName"} y={"usdVolume"} data={pynthsByVolumes} colors={colors} total={totalVolume}></PieChart>
						)}
					</div>
					<div className="flex lg:flex-col self-center justify-start lg:items-center w-36 lg:w-52">
						<div className="flex flex-col gap-2 lg:gap-1 items-start lg:items-center">
							<div className="text-2xl text-gray-500 font-medium leading-none">
								${formatShortenCurrency(Number(utils.formatEther(totalVolume)))}
							</div>
							<div className="text-sm text-gray-700 text-left font-normal">Total volume</div>
						</div>
					</div>
				</div>
				<div className="flex flex-wrap lg:flex-col gap-1 lg:w-[25%]">
					{pynthsByVolumes.map((e, i) => (
						<ColorVerticalLabel
							key={i}
							color={colors[i]}
							size="sm"
							text={e.currencyName}
							per={formatNumberToPer(e.usdVolume, totalVolume)}
						></ColorVerticalLabel>
					))}
				</div>
				{/* <div className="hidden lg:flex flex-wrap lg:flex-nowrap flex-col space-y-3">
					{pynthsByVolumes.map((e, i) => (
						<ColorVerticalLabel
							size="sm"
							key={i}
							color={colors[i]}
							text={e.currencyName}
							per={formatNumberToPer(e.usdVolume, totalVolume)}
						></ColorVerticalLabel>
					))}
				</div> */}
			</div>
		</Card>
	);
};
export default TradingVolume;
