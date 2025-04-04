'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getCryptoData, getCryptoHistory, CryptoData } from '@/services/cryptoService';
import { ArrowUp, ArrowDown, DollarSign, BarChart, Layers, Globe, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const cryptocurrencies = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A', icon: '₿' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', icon: 'Ξ' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', color: '#00FFA3', icon: 'Ꙩ' },
];

interface CryptoState extends CryptoData {
  loading: boolean;
  error: string | null;
  history: Array<[number, number]>;
  chartData: Array<{time: string, price: number}>;
}

const CryptoPage = () => {
  const [cryptoData, setCryptoData] = useState<Record<string, CryptoState>>(
    cryptocurrencies.reduce((acc, crypto) => ({
      ...acc,
      [crypto.id]: {
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        currentPrice: 0,
        priceChange24h: 0,
        marketCap: 0,
        volume24h: 0,
        circulatingSupply: 0,
        loading: true,
        error: null,
        history: [],
        chartData: [],
      }
    }), {})
  );

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const data = await getCryptoData(cryptocurrencies.map(c => c.id));
        
        const updatedData = data.reduce((acc, crypto) => ({
          ...acc,
          [crypto.id]: {
            ...crypto,
            loading: false,
            error: null,
            history: [],
            chartData: [],
          }
        }), {});

        setCryptoData(prev => ({
          ...prev,
          ...updatedData
        }));

        // Fetch history for each crypto
        for (const crypto of cryptocurrencies) {
          try {
            const history = await getCryptoHistory(crypto.id);
          
            // if (!Array.isArray(history)) {
            //   throw new Error(`Invalid history data for ${crypto.id}`);
            // }
          
            // Convert history data to chart format
            const chartData = history.map(([timestamp, price]) => {
              const date = new Date(timestamp);
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              return {
                time: `${hours}:${minutes}`,
                price,
                fullTime: date
              };
            });
          
            setCryptoData(prev => ({
              ...prev,
              [crypto.id]: {
                ...prev[crypto.id],
                history,
                chartData,
              }
            }));
          } catch (error) {
            console.error(`Error fetching history for ${crypto.id}:`, error);
          }
          
        }
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setCryptoData(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach(key => {
            newState[key] = {
              ...newState[key],
              loading: false,
              error: 'Failed to fetch crypto data'
            };
          });
          return newState;
        });
      }
    };

    fetchCryptoData();

    // Set up WebSocket connection for real-time updates
    const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCryptoData(prev => {
        const newState = { ...prev };
        Object.entries(data).forEach(([id, price]) => {
          if (newState[id]) {
            const newPrice = Number(price);
            newState[id] = {
              ...newState[id],
              currentPrice: newPrice,
              // Add the new price point to chart data
              chartData: [...newState[id].chartData, {
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                price: newPrice
              }]
            };
            
            // Keep only last 24 hours of data points
            if (newState[id].chartData.length > 24) {
              newState[id].chartData = newState[id].chartData.slice(-24);
            }
          }
        });
        return newState;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  // Custom tooltip for the chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
          <p className="font-semibold">{`${payload[0].payload.time}`}</p>
          <p className="text-gray-700">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <Globe className="mr-3 text-indigo-600 w-8 h-8" />
            Cryptocurrency Dashboard
          </h1>
          <p className="text-gray-600">Real-time prices and market data with 24-hour history</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptocurrencies.map((crypto) => {
            const data = cryptoData[crypto.id];
            
            return (
              <Card key={crypto.id} className="overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: crypto.color }}
                      >
                        {crypto.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{data.name}</h2>
                        <span className="text-gray-500 text-sm">{data.symbol}</span>
                      </div>
                    </div>
                    {!data.loading && !data.error && (
                      <div className={`px-3 py-1 text-sm rounded-full ${data.priceChange24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {data.priceChange24h >= 0 ? '+' : ''}{data.priceChange24h.toFixed(2)}%
                      </div>
                    )}
                  </div>
                  
                  {data.loading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                    </div>
                  ) : data.error ? (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
                      <span className="font-semibold">Error:</span> {data.error}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="text-gray-500" size={18} />
                                <p className="text-sm font-medium text-gray-600">Current Price</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                {data.priceChange24h >= 0 ? 
                                  <ArrowUp className="text-green-500" size={16} /> : 
                                  <ArrowDown className="text-red-500" size={16} />
                                }
                              </div>
                            </div>
                            <p className="text-3xl font-bold mt-1">
                              ${data.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Price history chart */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center space-x-2 mb-3">
                            <TrendingUp className="text-gray-500" size={18} />
                            <p className="text-sm font-medium text-gray-600">24h Price History</p>
                          </div>
                          <div className="h-32">
                            {data.chartData.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.chartData.slice(-24)}>
                                  <XAxis 
                                    dataKey="time" 
                                    tick={{fontSize: 10}}
                                    tickFormatter={(tick) => tick}
                                    interval="preserveStartEnd"
                                  />
                                  <YAxis 
                                    domain={['dataMin', 'dataMax']} 
                                    tick={{fontSize: 10}}
                                    tickFormatter={(tick) => `$${tick.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                                  />
                                  <Tooltip content={CustomTooltip} />
                                  <Line 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke={crypto.color}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                Loading historical data...
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Globe className="text-gray-500" size={16} />
                              <p className="text-sm text-gray-600">Market Cap</p>
                            </div>
                            <p className="text-sm font-semibold">
                              ${(data.marketCap / 1e9).toFixed(2)}B
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <BarChart className="text-gray-500" size={16} />
                              <p className="text-sm text-gray-600">24h Volume</p>
                            </div>
                            <p className="text-sm font-semibold">
                              ${(data.volume24h / 1e9).toFixed(2)}B
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Layers className="text-gray-500" size={16} />
                              <p className="text-sm text-gray-600">Circulating Supply</p>
                            </div>
                            <p className="text-sm font-semibold">
                              {(data.circulatingSupply / 1e6).toFixed(2)}M {data.symbol}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* Card footer with gradient based on price change */}
                {!data.loading && !data.error && (
                  <div 
                    className="h-2" 
                    style={{ 
                      backgroundColor: data.priceChange24h >= 0 ? crypto.color : '#FF4560',
                      opacity: Math.min(Math.abs(data.priceChange24h) / 10, 1) * 0.8 + 0.2
                    }}
                  />
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CryptoPage;