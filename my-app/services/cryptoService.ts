import axios from 'axios';

const API_KEY = process.env.COINGECKO_API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3';

interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    circulating_supply: number;
  };
}

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

export const getCryptoData = async (ids: string[]): Promise<CryptoData[]> => {
  try {
    const response = await axios.get<CoinGeckoResponse[]>(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: ids.join(','),
        order: 'market_cap_desc',
        sparkline: false,
        price_change_percentage: '24h',
      },
      headers: {
        'x-cg-pro-api-key': API_KEY,
      },
    });

    return response.data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      currentPrice: coin.market_data.current_price.usd,
      priceChange24h: coin.market_data.price_change_percentage_24h,
      marketCap: coin.market_data.market_cap.usd,
      volume24h: coin.market_data.total_volume.usd,
      circulatingSupply: coin.market_data.circulating_supply,
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

export const getCryptoHistory = async (id: string, days: number = 1): Promise<Array<[number, number]>> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days.toString(),
      },
      headers: {
        'x-cg-pro-api-key': API_KEY,
      },
    });

    return response.data.prices;
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    throw error;
  }
}; 