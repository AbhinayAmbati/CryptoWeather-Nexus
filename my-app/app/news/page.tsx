'use client';

import React from 'react';
import Card from '@/components/ui/card';

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Latest News</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Headlines</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Loading headline...
                </h3>
                <p className="text-gray-600 mb-2">
                  Loading description...
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Loading source...</span>
                  <span>Loading date...</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Loading analysis title...
                </h3>
                <p className="text-gray-600 mb-2">
                  Loading analysis content...
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Loading analyst...</span>
                  <span>Loading date...</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewsPage; 