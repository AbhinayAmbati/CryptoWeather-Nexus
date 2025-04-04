'use client';

import React, { useEffect, useState } from 'react';
import {Card} from '@/components/ui/card';
import { getCryptoData, getCryptoHistory, CryptoData } from '@/services/cryptoService';
import { ArrowUp, ArrowDown, DollarSign, BarChart, Layers, Globe } from 'lucide-react';

const cryptocurrencies = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A', icon: '₿' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', icon: 'Ξ' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', color: '#00FFA3', icon: 'Ꙩ' },
];

interface CryptoState extends CryptoData {
  loading: boolean;
  error: string | null;
  history: Array<[number, number]>;
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
            setCryptoData(prev => ({
              ...prev,
              [crypto.id]: {
                ...prev[crypto.id],
                history,
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
            newState[id] = {
              ...newState[id],
              currentPrice: Number(price)
            };
          }
        });
        return newState;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Cryptocurrency Dashboard</h1>
        <p className="text-gray-500 text-center mb-8">Real-time prices and market data</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptocurrencies.map((crypto) => {
            const data = cryptoData[crypto.id];
            
            return (
              <Card key={crypto.id} className="overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
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