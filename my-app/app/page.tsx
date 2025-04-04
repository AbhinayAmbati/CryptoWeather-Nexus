'use client';

import React from 'react';
import Card from '@/components/ui/card';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weather Section */}
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weather</h2>
          <div className="space-y-4">
            {['New York', 'London', 'Tokyo'].map((city) => (
              <div key={city} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium">{city}</h3>
                <div className="text-gray-600">
                  <p>Temperature: --°C</p>
                  <p>Humidity: --%</p>
                  <p>Conditions: --</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cryptocurrency Section */}
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cryptocurrency</h2>
          <div className="space-y-4">
            {['Bitcoin', 'Ethereum', 'Solana'].map((crypto) => (
              <div key={crypto} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium">{crypto}</h3>
                <div className="text-gray-600">
                  <p>Price: $--</p>
                  <p>24h Change: --%</p>
                  <p>Market Cap: $--</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* News Section */}
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Latest News</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium text-gray-800">Loading headline...</h3>
                <p className="text-sm text-gray-600">Loading description...</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
