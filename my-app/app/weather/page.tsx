'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/card';
import { getCurrentWeather, getForecast, WeatherData, ForecastData } from '@/services/weatherService';

const cities = [
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
];

interface CityWeather {
  current: WeatherData | null;
  forecast: ForecastData[] | null;
  loading: boolean;
  error: string | null;
}

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState<Record<string, CityWeather>>(
    cities.reduce((acc, city) => ({
      ...acc,
      [city.name]: { current: null, forecast: null, loading: true, error: null }
    }), {})
  );

  useEffect(() => {
    const fetchWeatherData = async () => {
      for (const city of cities) {
        try {
          const [current, forecast] = await Promise.all([
            getCurrentWeather(city.lat, city.lon),
            getForecast(city.lat, city.lon)
          ]);

          setWeatherData(prev => ({
            ...prev,
            [city.name]: {
              current,
              forecast,
              loading: false,
              error: null
            }
          }));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setWeatherData(prev => ({
            ...prev,
            [city.name]: {
              current: null,
              forecast: null,
              loading: false,
              error: 'Failed to fetch weather data'
            }
          }));
        }
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Weather Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => {
          const data = weatherData[city.name];
          
          return (
            <Card key={city.name} className="p-6">
              <h2 className="text-xl font-semibold mb-4">{city.name}</h2>
              
              {data.loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : data.error ? (
                <div className="text-red-500 text-center">{data.error}</div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Temperature</p>
                        <p className="text-2xl font-bold">{data.current?.temp.toFixed(1)}°C</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Humidity</p>
                        <p className="text-2xl font-bold">{data.current?.humidity}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Conditions</p>
                      <p className="text-lg">{data.current?.conditions}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Wind Speed</p>
                      <p className="text-lg">{data.current?.windSpeed.toFixed(1)} km/h</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Pressure</p>
                      <p className="text-lg">{data.current?.pressure} hPa</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">5-Day Forecast</h3>
                    <div className="space-y-2">
                      {data.forecast?.map((day, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                          <span>{day.date}</span>
                          <div className="flex items-center gap-2">
                            <span>{day.temp.toFixed(1)}°C</span>
                            <span className="text-gray-600">{day.conditions}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherPage; 