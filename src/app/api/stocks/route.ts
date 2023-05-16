import { NextResponse } from "next/server";

const STOCKS = [
    { name: "Apple Inc.", ticker: "AAPL"},
    { name: "Alphabet Inc.", ticker: "GOOG"},
    { name: "Microsoft Corp", ticker: "MSFT"},
    { name: "Meta Platforms, Inc.", ticker: "META"},
    { name: "Amazon.com, Inc.", ticker: "AMZN" },
    { name: "Tesla, Inc.", ticker: "TSLA" },
    { name: "NVIDIA Corporation", ticker: "NVDA" },
    { name: "PepsiCo, Inc.", ticker: "PEP" },
    { name: "Costco Wholesale Corporation", ticker: "COST"}
]

export async function GET(req: Request) {
    return NextResponse.json(
        STOCKS,
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "s-maxage=3600, stale-while-revalidate"
            }
        }
    );
}