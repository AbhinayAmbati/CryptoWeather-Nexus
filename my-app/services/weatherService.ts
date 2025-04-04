import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: Array<{
      main: string;
      icon: string;
    }>;
  }>;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  conditions: string;
  windSpeed: number;
  pressure: number;
  icon: string;
}

export interface ForecastData {
  date: string;
  temp: number;
  conditions: string;
  icon: string;
}

export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get<WeatherResponse>(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return {
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      conditions: response.data.weather[0].main,
      windSpeed: response.data.wind.speed,
      pressure: response.data.main.pressure,
      icon: response.data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getForecast = async (lat: number, lon: number): Promise<ForecastData[]> => {
  try {
    const response = await axios.get<ForecastResponse>(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    // Get daily forecast (one entry per day)
    const dailyForecast = response.data.list.filter((_, index) => index % 8 === 0);

    return dailyForecast.map((item) => ({
      date: new Date(item.dt * 1000).toLocaleDateString(),
      temp: item.main.temp,
      conditions: item.weather[0].main,
      icon: item.weather[0].icon,
    }));
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
}; 