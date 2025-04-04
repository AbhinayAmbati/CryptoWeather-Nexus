'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/card';
import { getCurrentWeather, getForecast, WeatherData, ForecastData } from '@/services/weatherService';

const cities = [
  { name: 'New York', lat: 40.7128, lon: -74.0060, icon: '🌆' },
  { name: 'London', lat: 51.5074, lon: -0.1278, icon: '🏰' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, icon: '🗼' },
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

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Dashboard</h1>
        <p className="text-gray-600 mb-8">Real-time weather updates for major cities</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => {
            const data = weatherData[city.name];
            
            return (
              <Card key={city.name} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">{city.name}</h2>
                  <span className="text-3xl">{city.icon}</span>
                </div>
                
                {data.loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : data.error ? (
                  <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {data.error}
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Current Temperature</p>
                          <p className="text-4xl font-bold text-gray-800">{data.current?.temp.toFixed(1)}°C</p>
                        </div>
                        {data.current?.icon && (
                          <img
                            src={getWeatherIcon(data.current.icon)}
                            alt={data.current.conditions}
                            className="w-20 h-20 drop-shadow-lg"
                          />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-600">Humidity</p>
                            <p className="text-lg font-semibold">{data.current?.humidity}%</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-600">Wind Speed</p>
                            <p className="text-lg font-semibold">{data.current?.windSpeed.toFixed(1)} km/h</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-600">Pressure</p>
                            <p className="text-lg font-semibold">{data.current?.pressure} hPa</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-600">Conditions</p>
                            <p className="text-lg font-semibold">{data.current?.conditions}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4 text-gray-800">5-Day Forecast</h3>
                        <div className="space-y-3">
                          {data.forecast?.map((day, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                              <span className="font-medium text-gray-700">{day.date}</span>
                              <div className="flex items-center gap-4">
                                <img
                                  src={getWeatherIcon(day.icon)}
                                  alt={day.conditions}
                                  className="w-10 h-10 drop-shadow-sm"
                                />
                                <div className="text-right">
                                  <span className="font-semibold text-gray-800">{day.temp.toFixed(1)}°C</span>
                                  <span className="text-sm text-gray-600 ml-2">{day.conditions}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage; 