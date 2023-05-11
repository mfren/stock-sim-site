import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { ticker: string } }) {
    return NextResponse.json(
        [
            "GOOG",
            "AAPL"
        ],
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "s-maxage=1, stale-while-revalidate"
            }
        }
    );
}