import { NextResponse } from "next/server";
import twelvedata from "twelvedata";
import { kv } from "@vercel/kv";

type CacheItem = {
    data: string
    cachedAt: Date
}

export async function GET(req: Request, { params }: { params: { ticker: string } }) {

    await new Promise(r => setTimeout(r, 5000));

    const cached = await kv.get<CacheItem>(params.ticker);

    let data;

    if (cached !== null) {
        console.log("Cache HIT")
        data = JSON.parse(cached.data)
    }
    else {
        console.log("Cache MISS")

        const client = twelvedata({
            key: process.env.TWELVEDATA_API_KEY,
        });

        // Get from API
        data = await client.timeSeries({
            symbol: params.ticker,
            interval: "1day",
            outputsize: 100,
        });

        // Store in cache
        kv.set(params.ticker, {
            data: JSON.stringify(data),
            cachedAt: new Date()
        })
    }

    return NextResponse.json(
        data,
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "s-maxage=3600, stale-while-revalidate"
            }
        }
    );
}