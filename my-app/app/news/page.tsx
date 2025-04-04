'use client';

import React, { useEffect, useState } from 'react';
import {Card} from '@/components/ui/card';
import { fetchNewsData, NewsData } from '@/utils/api';

const NewsPage = () => {
  const [topHeadlines, setTopHeadlines] = useState<NewsData[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch general news for top headlines
        const headlines = await fetchNewsData();
        setTopHeadlines(headlines);

        // Fetch market-specific news for analysis section
        const analysis = await fetchNewsData();
        setMarketAnalysis(analysis);
      } catch (error) {
        console.error('Error fetching news data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Latest News</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Headlines</h2>
          <div className="space-y-6">
            {loading ? (
              // Loading skeleton
              [1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : topHeadlines.length > 0 ? (
              topHeadlines.map((news, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    <a 
                      href={news.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {news.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 mb-2">{news.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>NewsData.io</span>
                    <span>{news.pubDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No headlines available at the moment.
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
          <div className="space-y-6">
            {loading ? (
              // Loading skeleton
              [1, 2, 3].map((index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : marketAnalysis.length > 0 ? (
              marketAnalysis.map((news, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    <a 
                      href={news.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {news.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 mb-2">{news.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>NewsData.io</span>
                    <span>{news.pubDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No market analysis available at the moment.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewsPage; 