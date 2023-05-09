

function gaussianRandom(mean=0, stdev=1) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1]
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

export async function calculateDiffs(data: any[]): Promise<number[]> {
    return data.map(item => (
        item.close / item.open
    )) as number[];
}

export async function predictPrices(diffs: number[]): Promise<number[]> {
    console.log("Prediction")

    let avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    let std = Math.sqrt(diffs.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / diffs.length);
    console.log(avg, std)

    let prices = []

    let drift = avg - ((std^2)/2)

    for (let i = 0; i < 100; i++) {
        let lastPrice: number = prices[prices.length - 1] || 1;
        let volatilty: number = std * gaussianRandom();
        let price: number = lastPrice * Math.pow(Math.E, drift + volatilty);
        prices.push(price);
    }

    return prices;
}
