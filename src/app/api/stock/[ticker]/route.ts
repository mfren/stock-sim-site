import { NextResponse } from "next/server";
import twelvedata from "twelvedata";

export async function GET(req: Request, { params }: { params: { ticker: string } }) {

    const client = twelvedata({
        key: process.env.TWELVEDATA_API_KEY,
    });

    const data = await client.timeSeries({
        symbol: params.ticker,
        interval: "1day",
        outputsize: 100,
    });

    console.log(data);

    return NextResponse.json(
        data,
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "s-maxage=1, stale-while-revalidate"
            }
        }
    );
}