'use client';

import React, { useEffect, useState } from 'react';
import {Card} from '@/components/ui/card';
import { getCurrentWeather, getForecast, WeatherData, ForecastData } from '@/services/weatherService';
import { Cloud, CloudRain, Droplets, Wind, Gauge, Sun, Thermometer, Calendar, Loader, Globe } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

const cities = [
  { name: 'New York', lat: 40.7128, lon: -74.0060, icon: '🌆', color: '#4361ee' },
  { name: 'London', lat: 51.5074, lon: -0.1278, icon: '🏰', color: '#3a0ca3' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, icon: '🗼', color: '#f72585' },
];

// Helper function to determine which weather icon to display
const getWeatherIconComponent = (condition: string | undefined) => {
  if (!condition) return <Cloud />;
  condition = condition.toLowerCase();
  
  if (condition.includes('rain') || condition.includes('drizzle')) return <CloudRain />;
  if (condition.includes('cloud')) return <Cloud />;
  if (condition.includes('clear') || condition.includes('sunny')) return <Sun />;
  return <Cloud />;
};

const WeatherPage = () => {
  const { showNotification } = useNotifications();
  const [weatherData, setWeatherData] = useState<Record<string, {
    current: WeatherData | null;
    forecast: ForecastData[];
    loading: boolean;
    error: string | null;
    lastConditions?: string;
  }>>({});

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherPromises = cities.map(async (city) => {
          const [current, forecast] = await Promise.all([
            getCurrentWeather(city.lat, city.lon),
            getForecast(city.lat, city.lon)
          ]);

          // Check for condition changes
          const oldData = weatherData[city.name];
          if (oldData?.current && !oldData.loading && !oldData.error) {
            if (oldData.current.conditions !== current.conditions) {
              showNotification(
                'weather_alert',
                `Weather in ${city.name} has changed from ${oldData.current.conditions} to ${current.conditions}`
              );
            }

            // Check for significant temperature changes (more than 5°C)
            const tempChange = current.temp - oldData.current.temp;
            if (Math.abs(tempChange) >= 5) {
              const direction = tempChange > 0 ? 'increased' : 'decreased';
              showNotification(
                'weather_alert',
                `Temperature in ${city.name} has ${direction} by ${Math.abs(tempChange).toFixed(1)}°C`
              );
            }
          }

          return {
            name: city.name,
            data: {
              current,
              forecast,
              loading: false,
              error: null,
              lastConditions: current.conditions
            }
          };
        });

        const results = await Promise.all(weatherPromises);
        const newWeatherData = results.reduce((acc, { name, data }) => ({
          ...acc,
          [name]: data
        }), {});

        setWeatherData(newWeatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherData(prev => {
          const newState = { ...prev };
          cities.forEach(city => {
            newState[city.name] = {
              ...newState[city.name],
              loading: false,
              error: 'Failed to fetch weather data'
            };
          });
          return newState;
        });
      }
    };

    // Initialize weather data
    cities.forEach(city => {
      setWeatherData(prev => ({
        ...prev,
        [city.name]: {
          current: null,
          forecast: [],
          loading: true,
          error: null
        }
      }));
    });

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Debug log when state changes
  useEffect(() => {
    console.log('Weather data state updated:', weatherData);
  }, [weatherData]);

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (dateStr : any) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <Globe className="mr-3 text-indigo-600 w-8 h-8" />
            Weather Dashboard
          </h1>
          <p className="text-gray-600">Real-time weather updates for major cities</p>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => {
            const data = weatherData[city.name];
            
            // Log data for each city render
            console.log(`Rendering ${city.name} with data:`, data);
            
            return (
              <Card key={city.name} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Card Header with Gradient */}
                <div 
                  className="p-6 text-white"
                  style={{ 
                    background: `linear-gradient(135deg, ${city.color}, ${city.color}dd)`,
                    boxShadow: `0 4px 12px ${city.color}66`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{city.name}</h2>
                      <p className="text-white/75 text-sm">
                        {formatDate(new Date().toISOString())}
                      </p>
                    </div>
                    <span className="text-4xl drop-shadow-md">{city.icon}</span>
                  </div>
                </div>
                
                <div className="p-6 bg-white">
                  {data?.loading ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                  ) : data?.error ? (
                    <div className="text-red-500 text-center p-6 bg-red-50 rounded-lg">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <p className="font-medium">{data.error}</p>
                        <p className="text-red-400 text-sm mt-1">Please try again later</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-6">
                        {/* Current Weather */}
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center">
                            <div className="mr-4">
                              {getWeatherIconComponent(data?.current?.conditions)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">{data?.current?.conditions}</p>
                              <div className="flex items-baseline">
                                <Thermometer size={16} className="text-gray-400 mr-1" />
                                <p className="text-4xl font-bold text-gray-800">{data?.current?.temp.toFixed(1)}°C</p>
                              </div>
                            </div>
                          </div>
                          
                          {data?.current?.icon && (
                            <img
                              src={getWeatherIcon(data.current.icon)}
                              alt={data.current.conditions}
                              className="w-16 h-16 drop-shadow-lg"
                            />
                          )}
                        </div>
                        
                        {/* Weather Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                            <Droplets size={18} className="text-blue-500 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Humidity</p>
                              <p className="text-sm font-semibold">{data?.current?.humidity}%</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-3 bg-green-50 rounded-lg">
                            <Wind size={18} className="text-green-500 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Wind Speed</p>
                              <p className="text-sm font-semibold">{data?.current?.windSpeed.toFixed(1)} km/h</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                            <Gauge size={18} className="text-purple-500 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Pressure</p>
                              <p className="text-sm font-semibold">{data?.current?.pressure} hPa</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                            <Sun size={18} className="text-amber-500 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Feels Like</p>
                              <p className="text-sm font-semibold">{data?.forecast?.[0]?.temp?.toFixed(1) || '—'}°C</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Forecast Section */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center mb-4">
                            <Calendar size={16} className="text-gray-500 mr-2" />
                            <h3 className="text-md font-medium text-gray-700">5-Day Forecast</h3>
                          </div>
                          
                          <div className="space-y-2">
                            {data?.forecast?.map((day, index) => {
                              console.log(`Rendering forecast day ${index}:`, day);
                              return (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                  <span className="font-medium text-gray-700 text-sm">{formatDate(day.date)}</span>
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={getWeatherIcon(day.icon)}
                                      alt={day.conditions}
                                      className="w-8 h-8"
                                    />
                                    <div className="text-right">
                                      <span className="font-semibold text-gray-800">{day.temp.toFixed(1)}°C</span>
                                      <p className="text-xs text-gray-500">{day.conditions}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;