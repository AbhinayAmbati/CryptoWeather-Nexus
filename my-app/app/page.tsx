'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/card';
import { fetchWeatherData, fetchCryptoData, fetchNewsData, WeatherData, CryptoData, NewsData } from '@/utils/api';

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weather Section */}
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weather</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-4 last:border-b-0">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              weatherData.map((weather) => (
                <div key={weather.city} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium">{weather.city}</h3>
                  <div className="text-gray-600">
                    <p>Temperature: {weather.temperature}°C</p>
                    <p>Humidity: {weather.humidity}%</p>
                    <p>Conditions: {weather.conditions}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Cryptocurrency Section */}
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cryptocurrency</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-4 last:border-b-0">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              cryptoData.map((crypto) => (
                <div key={crypto.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium">{crypto.name}</h3>
                  <div className="text-gray-600">
                    <p>Price: {formatPrice(crypto.current_price)}</p>
                    <p className={crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                      24h Change: {crypto.price_change_percentage_24h.toFixed(2)}%
                    </p>
                    <p>Market Cap: {formatMarketCap(crypto.market_cap)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* News Section */}
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Latest News</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border-b pb-4 last:border-b-0">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              newsData.map((news, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-800">
                    <a href={news.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      {news.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600">{news.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{news.pubDate}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
