import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';

interface NewsResponse {
  results: Array<{
    title: string;
    description: string;
    link: string;
    pubDate: string;
    source_id: string;
    category: string[];
  }>;
}

export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string[];
}

export const getCryptoNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await axios.get<NewsResponse>(BASE_URL, {
      params: {
        apikey: API_KEY,
        q: 'cryptocurrency OR bitcoin OR ethereum',
        language: 'en',
        category: 'business,technology',
        size: 8,
      },
    });

    return response.data.results.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: new Date(item.pubDate).toLocaleDateString(),
      source: item.source_id,
      category: item.category,
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const getMarketAnalysis = async (): Promise<NewsItem[]> => {
  try {
    const response = await axios.get<NewsResponse>(BASE_URL, {
      params: {
        apikey: API_KEY,
        q: 'cryptocurrency market analysis OR crypto market forecast',
        language: 'en',
        category: 'business',
        size: 3,
      },
    });

    return response.data.results.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: new Date(item.pubDate).toLocaleDateString(),
      source: item.source_id,
      category: item.category,
    }));
  } catch (error) {
    console.error('Error fetching market analysis:', error);
    throw error;
  }
}; 