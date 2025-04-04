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
      const data = await response.json();
      
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
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${coins.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    );
    const data = await response.json();
    
    return coins.map(coin => ({
      id: coin,
      name: coin.charAt(0).toUpperCase() + coin.slice(1),
      current_price: data[coin].usd,
      price_change_percentage_24h: data[coin].usd_24h_change,
      market_cap: data[coin].usd_market_cap,
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
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