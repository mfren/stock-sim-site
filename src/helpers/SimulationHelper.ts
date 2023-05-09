



export async function calculateDiffs(data: any[]): Promise<number[]> {
    return data.map(item => (
        item.close - item.open
    )) as number[];
}

export async function predictPrices(diffs: number[]): Promise<number[]> {


    let avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    let std = Math.sqrt(diffs.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / diffs.length);
    console.log(avg, std)

    let prices = []

    for (let i = 0; i < 100; i++) {
        let lastPrice: number = prices[prices.length - 1] || 1;
        let price: number = lastPrice //+ avg //+ std * Math.random();
        prices.push(price);
    }

    return prices;
}
