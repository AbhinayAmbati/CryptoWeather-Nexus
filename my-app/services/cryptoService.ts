const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
}

export interface CryptoHistory {
  prices: Array<[number, number]>;
  market_caps: Array<[number, number]>;
  total_volumes: Array<[number, number]>;
}

interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
}

export async function getCryptoData(ids: string[]): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CoinGeckoMarketData[] = await response.json();
    console.log('Crypto API Response:', data); // Debug log

    return data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      currentPrice: coin.current_price,
      priceChange24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      circulatingSupply: coin.circulating_supply,
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

export async function getCryptoHistory(id: string): Promise<Array<[number, number]>> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${id}/market_chart?vs_currency=usd&days=1&interval=hourly`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CryptoHistory = await response.json();
    console.log(`Crypto History API Response for ${id}:`, data); // Debug log

    return data.prices;
  } catch (error) {
    console.error(`Error fetching crypto history for ${id}:`, error);
    throw error;
  }
} 