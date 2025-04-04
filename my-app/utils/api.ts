const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const NEWSDATA_API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  conditions: string;
}

export interface CryptoData {
  id: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export interface NewsData {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

interface NewsArticle {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
}

interface NewsArticleResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
}

export async function fetchWeatherData(cities: string[]): Promise<WeatherData[]> {
  const weatherData: WeatherData[] = [];
  
  for (const city of cities) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Weather API Response for ${city}:`, data); // Debug log

      // Check if the required data exists
      if (!data.main || !data.weather || !data.weather[0]) {
        console.error(`Invalid weather data structure for ${city}:`, data);
        throw new Error('Invalid weather data structure');
      }

      weatherData.push({
        city,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        conditions: data.weather[0].main,
      });
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
      weatherData.push({
        city,
        temperature: 0,
        humidity: 0,
        conditions: 'N/A',
      });
    }
  }
  
  return weatherData;
}

export async function fetchCryptoData(coins: string[]): Promise<CryptoData[]> {
  try {
    console.log('Fetching crypto data for:', coins);
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${coins.join(',')}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Crypto API Response:', data);

    if (!data || data.length === 0) {
      throw new Error('No data returned from the API');
    }

    return data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
    }));
  } catch (error: any) {
    console.error('Error fetching crypto data:', error);
    // Return empty data instead of throwing to prevent app crash
    return coins.map(coin => ({
      id: coin,
      name: coin.charAt(0).toUpperCase() + coin.slice(1),
      current_price: 0,
      price_change_percentage_24h: 0,
      market_cap: 0,
    }));
  }
}

export async function fetchNewsData(): Promise<NewsData[]> {
  try {
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&language=en&category=technology,business&size=5`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: NewsArticleResponse = await response.json();
    console.log('News API Response:', data); // Debug log

    // Check if data.results exists and is an array
    if (!data.results || !Array.isArray(data.results)) {
      console.error('Invalid news data structure:', data);
      return [];
    }

    return data.results.map((article: NewsArticle) => ({
      title: article.title || 'No title available',
      description: article.description || 'No description available',
      link: article.link || '#',
      pubDate: article.pubDate ? new Date(article.pubDate).toLocaleDateString() : 'Date not available',
    }));
  } catch (error) {
    console.error('Error fetching news data:', error);
    return [];
  }
} 