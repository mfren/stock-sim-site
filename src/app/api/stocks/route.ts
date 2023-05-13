import { NextResponse } from "next/server";

const STOCKS = [
    { name: "Apple Inc.", ticker: "AAPL"},
    { name: "Alphabet Inc.", ticker: "GOOG"},
    { name: "Microsoft Corp", ticker: "MSFT"},
    { name: "Meta Platforms, Inc.", ticker: "META"}
]

export async function GET(req: Request) {
    return NextResponse.json(
        STOCKS,
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "s-maxage=1, stale-while-revalidate"
            }
        }
    );
}