# CryptoWeatherNexus

A modern dashboard application that provides real-time cryptocurrency prices, weather updates, and relevant news in a unified interface.

## 🚀 Features

- **Real-time Cryptocurrency Tracking**
  - Live price updates for Bitcoin, Ethereum, and Solana
  - Price change notifications
  - Visual price charts with trend indicators
  - Market cap and volume statistics

- **Weather Monitoring**
  - Current weather conditions for major cities
  - 5-day weather forecast
  - Temperature, humidity, and wind speed metrics
  - Weather change notifications

- **News Integration**
  - Latest cryptocurrency news
  - Market analysis
  - Real-time updates
  - Categorized news sections

- **Smart Notifications System**
  - Real-time price alerts (≥1% changes)
  - Weather condition changes
  - Temperature shift alerts (≥5°C changes)
  - Custom styled notifications by type

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom configurations
- **State Management**: React Hooks and Context API
- **Real-time Updates**: WebSocket connections
- **Notifications**: Sonner toast notifications
- **Icons**: Lucide React icons
- **Charts**: Recharts for data visualization

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/AbhinayAmbati/CryptoWeather-Nexus.git
cd CryptoWeather-Nexus
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── crypto/            # Cryptocurrency page
│   ├── weather/           # Weather page
│   ├── news/              # News page
│   └── page.tsx           # Dashboard page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── Navbar.tsx        # Navigation component
├── contexts/             # React contexts
│   └── NotificationContext.tsx
├── services/             # API services
│   ├── cryptoService.ts
│   ├── weatherService.ts
│   └── newsService.ts
└── utils/               # Utility functions
```

## 🎨 Design Decisions

### Architecture
- **App Router**: Utilizing Next.js 14's App Router for improved performance and better SEO
- **Server Components**: Leveraging server components where possible for better initial load times
- **Client Components**: Using client components for interactive features and real-time updates

### State Management
- **Context API**: Used for global state like notifications
- **Local State**: React useState for component-specific state
- **Real-time Updates**: WebSocket connections for live cryptocurrency data

### UI/UX Decisions
- **Responsive Design**: Mobile-first approach with tailored layouts for different screen sizes
- **Dark Theme**: Dark navigation with light content for better contrast
- **Card Layout**: Consistent card-based design for unified appearance
- **Loading States**: Skeleton loading for better user experience
- **Notifications**: 
  - Top-right position for visibility
  - Color-coded by type (amber for crypto, blue for weather)
  - Auto-dismissal with manual close option
  - Stacking support for multiple notifications

### Performance Optimizations
- **Image Optimization**: Next.js Image component for optimal loading
- **Dynamic Imports**: Lazy loading for better initial page load
- **Debounced Updates**: Throttled API calls for better performance
- **Caching**: API response caching where appropriate

## 🔄 Real-time Updates

The application uses different methods for real-time updates:
- **Cryptocurrency**: WebSocket connection for live price updates
- **Weather**: Polling every 5 minutes
- **News**: Refresh every 5 minutes

## 🚨 Notification System

The notification system is built using Sonner and supports:
- **Types**: 
  - Price alerts (💰)
  - Weather alerts (🌤️)
- **Triggers**:
  - Crypto price changes ≥1%
  - Weather condition changes
  - Temperature changes ≥5°C
- **Testing**: Available through the "Test Alerts" button in navigation

## 🔐 Security

- API keys are stored in environment variables
- CORS policies are properly configured
- Rate limiting implemented for API calls
- Secure WebSocket connections

## 📱 Mobile Responsiveness

- Responsive navigation with hamburger menu
- Adaptive layouts for different screen sizes
- Touch-friendly interface
- Optimized charts for mobile viewing

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
