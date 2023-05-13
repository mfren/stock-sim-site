"use client";

import StockChart from "@/components/StockChart";
import StockPicker from "@/components/StockPicker";
import { calculateDiffs, predictPrices } from "@/helpers/SimulationHelper";
import { Alert, Button, Container, Divider, Grid, Link, Paper, Skeleton, Snackbar, TextField, Typography } from "@mui/material";
import { ChartData } from "chart.js";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";


const fetcher = (url: URL) => fetch(url).then(r => r.json())

export default function Home() {

    // Fetch data from API
    const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>(false)
    const [numSims, setNumSims] = useState<number>(1_000);
    const [stock, setStock] = useState<string | null>("GOOG")
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

    useEffect(() => {
        if (!error) return;

        alert(`There was an issue getting stock data`)
    })


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
        <Container maxWidth="md">
            <Typography variant="h1" sx={{ fontSize: 40, textAlign: "center" }}>
                Stock Price Simulator
            </Typography>
            <Typography variant="h2" sx={{ fontSize: 24, textAlign: "center" }}>
                Developed by <Link href="https://mattfrench.dev" target="_blank" rel="noopener">Matt French</Link> | <Link href="" target="_blank" rel="noopener">Read the blog post</Link>
            </Typography>

            <Grid container spacing={5} sx={{ mt: 1 }}>
                <Grid item xs={9}>
                    {isLoading || error ? 
                        <Skeleton variant="rounded" sx={{ minHeight: "100%" }} /> : 
                        <StockChart data={chartData!} />
                    }
                </Grid>

                <Grid item xs={3}>
                    <Paper sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    Settings
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <StockPicker 
                                    value={stock} 
                                    onChange={setStock}
                                />
                            </Grid>
                            <Divider />
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-number"
                                    label="Number of Simulations"
                                    type="number"
                                    value={numSims}
                                    onChange={e => setNumSims(parseFloat(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={runSim}>
                                    Run
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            
            <Snackbar open={snackbarIsOpen} autoHideDuration={6000} onClose={() => setSnackbarIsOpen(false)}>
                <Alert onClose={() => setSnackbarIsOpen(false)} severity="error" sx={{ width: '100%' }}>
                    There was an error getting stock data: {error}
                </Alert>
            </Snackbar>
        </Container>
    )
}
