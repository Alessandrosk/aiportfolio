import { MarketData } from "../types";
import { COINGECKO_MAP } from "../constants";

export const fetchMarketData = async (
    assets: string[],
    apiKey: string,
    provider: 'coingecko' | 'twelvedata'
): Promise<MarketData[]> => {
    
    if (provider === 'coingecko') {
        const ids = assets
            .map(a => COINGECKO_MAP[a] || null)
            .filter(id => id !== null);
        
        if (ids.length === 0) return [];

        const idsString = ids.join(',');
        // Construct the URL with the API key query param
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd&include_24hr_change=true&x_cg_demo_api_key=${apiKey}`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("CoinGecko API Failed");
            const data = await res.json();
            
            // Map back to our MarketData format
            const result: MarketData[] = [];
            assets.forEach(symbol => {
                const id = COINGECKO_MAP[symbol];
                if (id && data[id]) {
                    result.push({
                        symbol: symbol,
                        price: data[id].usd,
                        change24h: data[id].usd_24h_change
                    });
                }
            });
            return result;
        } catch (e) {
            console.error(e);
            // Fallback or empty return
            return [];
        }
    } else {
        // TwelveData logic (Batch request is complex, so we do simple parallel requests for demo)
        // Note: TwelveData free tier limits rate. For demo purposes we simulate a batch or handle sequentially.
        // Or strictly use user provided key.
        const promises = assets.map(async (symbol) => {
            const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;
            try {
                const res = await fetch(url);
                const data = await res.json();
                if(data.code) return null; // Error

                return {
                    symbol: symbol,
                    price: parseFloat(data.close || "0"), // Quote endpoint gives real time price
                    change24h: parseFloat(data.percent_change || "0") // TwelveData returns percent_change for rolling 24h usually
                } as MarketData;
            } catch {
                return null;
            }
        });

        const results = await Promise.all(promises);
        return results.filter((r): r is MarketData => r !== null);
    }
}