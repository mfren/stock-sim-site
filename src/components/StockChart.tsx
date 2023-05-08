import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions, ChartData } from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function StockChart(props: { data: ChartData<"line", { x: string, y: number }[], string> }) {

    const options = useMemo<ChartOptions>(() => {
        return {
            responsive: true,
            scale: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    type: 'linear',
                    min: 0,
                }
            },
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart',
                },
            },
        };
    }, []);
    

    return (
        <Line
            options={options}
            data={props.data}
        />
    )
}
