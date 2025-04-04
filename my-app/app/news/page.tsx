'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchNewsData, NewsData } from '@/utils/api';
import { Globe, Clock, TrendingUp, FileText, ExternalLink, Rss, BarChart2, Calendar } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Globe className="mr-3 text-indigo-600 w-8 h-8" />
            Latest News
          </h1>
          <p className="text-gray-600 mt-2 ml-11">Stay updated with the latest headlines and market analyses</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Headlines Section */}
          <Card className="overflow-hidden border-0 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <Rss className="w-6 h-6 mr-2 text-blue-600" />
                Top Headlines
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-5">
              <div className="space-y-6">
                {loading ? (
                  // Loading skeleton
                  [1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-full mb-2 animate-pulse"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : topHeadlines.length > 0 ? (
                  topHeadlines.map((news, index) => (
                    <div key={index} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-start">
                        <FileText className="w-5 h-5 mr-2 text-blue-600 mt-1 flex-shrink-0" />
                        <a 
                          href={news.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors flex-1"
                        >
                          {news.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-3 ml-7">{news.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500 ml-7">
                        <span className="flex items-center">
                          <Globe className="w-4 h-4 mr-1 text-blue-500" />
                          NewsData.io
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                          {news.pubDate}
                        </span>
                      </div>
                      <div className="mt-3 text-right">
                        <a 
                          href={news.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-full transition-colors duration-200"
                        >
                          Read more
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg">
                    <Rss className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No headlines available at the moment.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Market Analysis Section */}
          <Card className="overflow-hidden border-0 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-teal-50 p-5">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <BarChart2 className="w-6 h-6 mr-2 text-teal-600" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-5">
              <div className="space-y-6">
                {loading ? (
                  // Loading skeleton
                  [1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-full mb-2 animate-pulse"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : marketAnalysis.length > 0 ? (
                  marketAnalysis.map((news, index) => (
                    <div key={index} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-start">
                        <TrendingUp className="w-5 h-5 mr-2 text-teal-600 mt-1 flex-shrink-0" />
                        <a 
                          href={news.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-teal-600 transition-colors flex-1"
                        >
                          {news.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-3 ml-7">{news.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500 ml-7">
                        <span className="flex items-center">
                          <Globe className="w-4 h-4 mr-1 text-teal-500" />
                          NewsData.io
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-teal-500" />
                          {news.pubDate}
                        </span>
                      </div>
                      <div className="mt-3 text-right">
                        <a 
                          href={news.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm rounded-full transition-colors duration-200"
                        >
                          Read analysis
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg">
                    <BarChart2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No market analysis available at the moment.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data refreshes every 5 minutes. Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;