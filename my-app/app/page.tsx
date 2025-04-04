'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWeatherData, fetchCryptoData, fetchNewsData, WeatherData, CryptoData, NewsData } from '@/utils/api';
import { Cloud, CloudRain, Sun, Droplet, Wind, TrendingUp, TrendingDown, BarChart3, Globe, Clock } from 'lucide-react';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weather, crypto, news] = await Promise.all([
          fetchWeatherData(['New York', 'London', 'Tokyo']),
          fetchCryptoData(['bitcoin', 'ethereum', 'solana']),
          fetchNewsData(),
        ]);

        setWeatherData(weather);
        setCryptoData(crypto);
        setNewsData(news);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M`;
    return formatPrice(marketCap);
  };

  const getWeatherIcon = (conditions: string) => {
    const condition = conditions.toLowerCase();
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return <CloudRain className="w-10 h-10 text-blue-500" />;
    } else if (condition.includes('cloud')) {
      return <Cloud className="w-10 h-10 text-gray-500" />;
    } else {
      return <Sun className="w-10 h-10 text-yellow-500" />;
    }
  };

  const getCryptoIcon = (id: string) => {
    switch (id.toLowerCase()) {
      case 'bitcoin':
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
            <span className="text-amber-600 text-lg font-bold">₿</span>
          </div>
        );
      case 'ethereum':
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
            <span className="text-purple-600 text-lg font-bold">Ξ</span>
          </div>
        );
      case 'solana':
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
            <span className="text-green-600 text-lg font-bold">◎</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            <BarChart3 className="w-6 h-6 text-gray-600" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <Globe className="mr-3 text-indigo-600 w-8 h-8" />
            Dashboard
          </h1>
          <p className="text-gray-600">Real-time updates across weather, crypto, and news</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weather Section */}
          <Card className="overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-xl border-0 shadow-lg hover:translate-y-[-5px]">
            <CardHeader className="pb-2 sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <Cloud className="w-6 h-6 mr-2 text-blue-500" />
                Weather Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[520px] overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-100">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                weatherData.map((weather) => (
                  <div key={weather.city} className="flex p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="mr-4">
                      {getWeatherIcon(weather.conditions)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">{weather.city}</h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p className="flex items-center">
                          <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-medium text-lg text-blue-700">{weather.temperature}°C</span>
                        </p>
                        <p className="flex items-center">
                          <Droplet className="w-4 h-4 mr-2 text-blue-600" />
                          <span>{weather.humidity}% Humidity</span>
                        </p>
                        <p className="flex items-center">
                          <Wind className="w-4 h-4 mr-2 text-blue-600" />
                          <span>{weather.conditions}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Cryptocurrency Section */}
          <Card className="overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-xl border-0 shadow-lg hover:translate-y-[-5px]">
            <CardHeader className="pb-2 sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-amber-500" />
                Cryptocurrency
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[520px] overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-100">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                cryptoData.map((crypto) => (
                  <div key={crypto.id} className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start">
                      <div className="mr-4">
                        {getCryptoIcon(crypto.id)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 text-lg">{crypto.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            crypto.price_change_percentage_24h >= 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {crypto.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="w-4 h-4 inline mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 inline mr-1" />
                            )}
                            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-2">
                          <p className="flex items-center">
                            <span className="text-xl font-bold text-gray-800">
                              {formatPrice(crypto.current_price)}
                            </span>
                          </p>
                          <p className="flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2 text-amber-600" />
                            Market Cap: <span className="font-medium ml-1">{formatMarketCap(crypto.market_cap)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* News Section */}
          <Card className="overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-xl border-0 shadow-lg hover:translate-y-[-5px]">
            <CardHeader className="pb-2 sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-indigo-500" />
                Latest News
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[520px] overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 rounded-lg bg-gray-100 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                newsData.map((news, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <h3 className="font-semibold text-gray-800 mb-2 hover:text-indigo-700 transition-colors">
                      <a href={news.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {news.title}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{news.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-indigo-500" />
                        {news.pubDate}
                      </span>
                      <a 
                        href={news.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors font-medium"
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;