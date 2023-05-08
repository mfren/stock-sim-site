"use client";

import StockChart from "@/components/StockChart";
import { ChartData } from "chart.js";
import useSWR from "swr";



type DataPoint = {
    datetime: string,
    value: number
}


const fetcher = (url: URL) => fetch(url).then(r => r.json())

export default function Home() {


    // Fetch data from API
    const { data, error, isLoading } = useSWR('/api/stock/GOOG', fetcher)

    const chartData: ChartData<"line", { x: string, y: number }[], string> = {
        datasets: [
            {
                label: 'Dataset 1',
                data: data.values.map((d: any) => ({ x: d.datetime, y: d.close })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    
    return (
        <div>
            <h1>Home</h1>

            {isLoading ? <p>Loading...</p> : <StockChart data={data} />}

        </div>
    )
}
