"use client";

import StockChart from "@/components/StockChart";
import StockPicker from "@/components/StockPicker";
import { calculateDiffs, predictPrices } from "@/helpers/SimulationHelper";
import { TextField } from "@mui/material";
import { ChartData } from "chart.js";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import useSWR from "swr";


const fetcher = (url: URL) => fetch(url).then(r => r.json())

export default function Home() {


    // Fetch data from API
    const [numSims, setNumSims] = useState<number>(1_000);
    const [stock, setStock] = useState<string>("GOOG")
    const [percentiles, setPercentiles] = useState<number[]>([50])
    const { data, error, isLoading } = useSWR(`/api/stock/${stock}`, fetcher)
    const [predictionData, setPredictionData] = useState<Map<number, number[]>>();
    const [historicalDataSet, setHistoricalDataSet] = useState<{ x: Date, y: number }[]>()
    const [predicitionDataSets, setPredicitionDataSets] = useState<{ p: number, ds: { x: Date, y: number }[]}[]>()

    const runSim = async () => {
        calculateDiffs(data.values)
        .then((diffs: number[]) => {
            return predictPrices(diffs, numSims, percentiles);
        })
        .then((prices: Map<number, number[]>) => {
            setPredictionData(prices);
        })
        .catch((err: any) => {
            console.error(err);
        });
    }

    useEffect(() => {
        if (!predictionData) return

        let datasets: { p: number; ds: { x: Date; y: number; }[]; }[] = []

        predictionData.forEach((value, key) => {

            // Get the end date/value for each simulation
            let endDate = new Date(data.values[0].datetime);
            let endValue: number = data.values[0].close;

            let mappedData = value.map((n: number, i: number) => {
                let newDate = new Date()
                newDate.setDate(endDate.getDate() + i)
                return {
                    x: newDate,
                    y: endValue * n
                }
            })

            datasets.push({
                p: key,
                ds: mappedData
            })
        })  

        setPredicitionDataSets(datasets)

    }, [predictionData])

    useEffect(() => {
        // Simulate future prices
        if (!data?.values) return;

        setHistoricalDataSet(data.values.map((d: any) => ({ x: new Date(d.datetime), y: d.close })))

        runSim()
    }, [data]);


    let chartData = useMemo(() => {
        let chartData: ChartData<"line", { x: Date, y: number }[], string> = {
            datasets: [
                {
                    label: 'Historical',
                    data: historicalDataSet ?? [],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',    
                }
            ]
        }
    
        if (predicitionDataSets?.length! > 0) {
            for (let predicition of predicitionDataSets!) {
                chartData.datasets.push({
                    label: `Predicition ${predicition.p}%`,
                    data: predicition.ds,
                    borderColor: 'rgb(200, 200, 200)',
                    backgroundColor: 'rgba(200, 200, 200, 0.5)',    
                })
            }
        } 
        
        return chartData
    }, [historicalDataSet, predicitionDataSets])


    return (
        <div className="container-md mx-auto p-4">
            <h1>Home</h1>

            <div className="flex flex-row">

                <div className="basis-9/12">
                    {isLoading ? <p>Loading...</p> : <StockChart data={chartData!} />}
                </div>

                <div className="basis-3/12">
                    <div className="flex flex-col gap-2">
                        <div>
                            <h2>Stock</h2>
                            <StockPicker value={stock} onChange={setStock} />
                        </div>
                        <div className="box ">
                            <h2>Simulation Settings</h2>
                            <input type="number" value={numSims} onChange={e => setNumSims(parseFloat(e.target.value))}/>
                            <button onClick={() => runSim()}>
                                Reload
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
