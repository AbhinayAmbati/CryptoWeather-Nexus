'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/card';
import PriceChart from '@/components/ui/PriceChart';
import { getCryptoData, getCryptoHistory, CryptoData } from '@/services/cryptoService';

const cryptocurrencies = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', color: '#00FFA3' },
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

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Cryptocurrency Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptocurrencies.map((crypto) => {
          const data = cryptoData[crypto.id];
          
          return (
            <Card key={crypto.id} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{data.name}</h2>
                <span className="text-gray-600">{data.symbol}</span>
              </div>
              
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
                        <p className="text-sm text-gray-600">Current Price</p>
                        <p className="text-2xl font-bold">
                          ${data.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">24h Change</p>
                        <p className={`text-2xl font-bold ${data.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.priceChange24h >= 0 ? '+' : ''}{data.priceChange24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Market Cap</p>
                      <p className="text-lg">
                        ${(data.marketCap / 1e9).toFixed(2)}B
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">24h Volume</p>
                      <p className="text-lg">
                        ${(data.volume24h / 1e9).toFixed(2)}B
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Circulating Supply</p>
                      <p className="text-lg">
                        {(data.circulatingSupply / 1e6).toFixed(2)}M {data.symbol}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Price Chart (24h)</h3>
                    <div className="h-40 bg-gray-100 rounded-lg">
                      {data.history.length > 0 ? (
                        <PriceChart data={data.history} color={crypto.color} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">Loading chart data...</p>
                        </div>
                      )}
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

export default CryptoPage; 