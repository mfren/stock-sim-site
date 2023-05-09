"use client";

import StockChart from "@/components/StockChart";
import { calculateDiffs, predictPrices } from "@/helpers/SimulationHelper";
import { ChartData } from "chart.js";
import { useEffect, useState } from "react";
import useSWR from "swr";


const fetcher = (url: URL) => fetch(url).then(r => r.json())

export default function Home() {


    // Fetch data from API
    const { data, error, isLoading } = useSWR('/api/stock/GOOG', fetcher)
    const [predictionData, setPredictionData] = useState<Map<number, number[]>>();


    let chartData: ChartData<"line", { x: string, y: number }[], string>;
    if (data) {
        console.log("Data 2:");
        console.log(data);
        chartData = {
            datasets: [
                {
                    label: 'Historical',
                    data: data.values.map((d: any) => ({ x: new Date(d.datetime).toDateString(), y: d.close })),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },   
            ]
        };

        if (predictionData) {

            predictionData.forEach((value, key) => {
                let endDate = new Date(data.values[data.values.length - 1].datetime);
                endDate.setDate(endDate.getDate() + 1);

                let endValue: number = data.values[data.values.length - 1].close;

                let mappedData = value.map((n: number, i: number) => {
                    endDate.setDate(endDate.getDate() + 1);
                    return {
                        x: `${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()}`,
                        y: endValue * n
                    }
                })

                chartData.datasets.push({
                    label: `Predicted ${key}`,
                    data: mappedData,
                    borderColor: 'rgb(99, 255, 132)',
                    backgroundColor: 'rgba(99, 255, 132, 0.5)',
                });
            })

            
        }

        console.log("Chart Data:");
        console.log(chartData);
    }
    
    const runSim = async () => {
        calculateDiffs(data.values)
        .then((diffs: number[]) => {
            return predictPrices(diffs, 1_000, [10, 50, 90]);
        })
        .then((prices: Map<number, number[]>) => {
            setPredictionData(prices);
        })
        .catch((err: any) => {
            console.error(err);
        });
    }

    useEffect(() => {
        // Simulate future prices
        if (!data?.values) return;

    }, [data]);

    return (
        <div className="container-md mx-auto p-4">
            <h1>Home</h1>

            <div className="flex flex-row">

                <div className="basis-9/12">
                    {isLoading ? <p>Loading...</p> : <StockChart data={chartData!} />}
                </div>

                <div className="basis-3/12">
                    <div className="flex flex-col">
                        <div>
                            <h2>Stock</h2>
                        </div>
                        <div>
                            <h2>Simulation Settings</h2>
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
