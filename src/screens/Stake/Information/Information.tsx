import { useSelector } from "react-redux";
import { RootState } from 'reducers'

import Card from "components/Card"
import Title from "components/Title"
import { formatCurrency } from "lib";

const Information = () => {
    const { APY }  = useSelector((state: RootState) => state.APY);

    const initialReward = 76924719527063029689120n;
    const inflationStart = 1625875200000;
    const decayStart = 52;
    const decayEnd = 172;
    const decayRate = 0.0125;
    const terminalSupplyRateAnnual = 0.05;

    // function terminalInflationSupply(totalSupply, numOfWeeks) {
    //     // rate = (1 + weekly rate) ^ num of weeks
    //     let effectiveCompoundRate = Math.pow(1+terminalSupplyRateAnnual/52, numOfWeeks);

    //     // return Supply * (effectiveRate - 1) for extra supply to issue based on number of weeks
    //     return totalSupply * (effectiveCompoundRate - 1);
    // }

    function tokenDecaySupplyForWeek(counter) {
        let effectiveDecay = Math.pow((1-decayRate), counter);
        let supplyForWeek = initialReward * BigInt(effectiveDecay);

        return supplyForWeek;
    }

    function getWeekCounter() {
        const now = new Date();
        const start = new Date(inflationStart);
        const weeks = (now.getTime() - start.getTime())/(1000*60*60*24*7);
        return Math.floor(weeks);
    }

    function getWeeklyReward() {
        let currentWeek = getWeekCounter();

        if (currentWeek < decayStart) {
            return initialReward;
        } else if (currentWeek <= decayEnd) {
            let decayCount = currentWeek - (decayStart - 1);

            return tokenDecaySupplyForWeek(decayCount);
        } else {
            // return terminalInflationSupply(currentTotalSupply, remainingWeeksToMint);
            return 0n;
        }
    }
    const weeklyReward = formatCurrency(getWeeklyReward());

    return <Card>
                <div className="flex lg:gap-5">
                    <div className="flex flex-col w-1/2">
                        <Title>PERI APY</Title>
                        <div className="flex flex-col">
                            <div className="text-2xl lg:text-4xl font-medium text-gray-500">
                            {APY}%
                            </div>
                            <div className="text-sm font-normal text-gray-700">
                            Est. APY
                            </div>
                        </div>
                        <div className="flex flex-col lg:mt-5">
                            <div className="text-lg font-medium text-gray-700">
                            {weeklyReward}
                            </div>
                            <div className="text-base font-normal text-gray-700">
                            PERI Weekly Reward
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-1/2 pl-5">
                        <Title>　　　　　　　</Title>
                        <div className="flex flex-col">
                            <div className="text-2xl lg:text-4xl font-medium text-gray-500">
                            　
                            </div>
                            <div className="text-sm font-normal text-gray-700">
                            　
                            </div>
                        </div>
                        <div className="flex flex-col lg:mt-5">
                            <div className="text-lg font-medium text-gray-700">
                            
                            </div>
                            <div className="text-base font-normal text-gray-700">
                            
                            </div>
                        </div>
                    </div>
                </div>
           </Card>
}
export default Information;