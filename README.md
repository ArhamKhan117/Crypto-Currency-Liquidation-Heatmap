# Crypto Liquidation Heatmap

A web app that visualizes cryptocurrency liquidation data in a heatmap format. Shows liquidation intensity across different price levels and time periods for BTC, ETH, SOL, and BNB.

## Why I Built This

I was looking at Coinglass liquidation heatmaps and thought it would be cool to build something similar. Wanted to understand how liquidations cluster around certain price levels and how that changes over time. Plus it was a good way to practice working with real-time data from Binance API.

## Features

- Real-time price data from Binance API
- Heatmap visualization showing liquidation intensity
- 4 cryptocurrencies: Bitcoin, Ethereum, Solana, BNB
- Multiple timeframes: 15m, 1h, 4h, 24h
- View modes: Combined, Longs Only, Shorts Only
- User authentication with favorite crypto feature
- Dark/Light theme toggle
- Market insights (hottest zone, long/short ratio, peak hour)
- Interactive tooltips on hover

## Tech Stack

- HTML/CSS/JavaScript (vanilla, no frameworks)
- Binance API for real-time prices
- LocalStorage for user data
- Google Fonts (Inter)

## Installation

Just clone and open in browser:

```bash
git clone https://github.com/yourusername/crypto-liquidation-heatmap.git
cd crypto-liquidation-heatmap
```

## How to Run

1. Open `index.html` in your browser
2. You can browse as guest or create an account
3. Select crypto and timeframe to view liquidations

Or use a local server:
```bash
# Python
python -m http.server 8000

# Node
npx http-server
```

Then go to `http://localhost:8000`

## How It Works

1. Fetches current price from Binance API every 5 seconds
2. Generates liquidation data based on price ranges (±5% of current)
3. Creates a 20x24 grid (20 price levels, 24 time intervals)
4. Colors cells based on liquidation intensity (green = longs, red = shorts)
5. Calculates market insights from the data
6. User can login to save favorite crypto

The heatmap uses a normalized intensity scale (1-6) where darker colors mean higher liquidation volumes at that price/time.

## Project Structure

```
crypto-liquidation-heatmap/
├── index.html              # Login/signup page
├── auth.css                # Authentication styling
├── auth.js                 # Login/signup logic
├── heatmap.html            # Main heatmap page
├── heatmap.css             # Heatmap styling
├── heatmap.js              # Heatmap logic and Binance API
├── ARCHITECTURE.md         # Technical architecture docs
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
├── LICENSE                 # MIT License
└── README.md               # This file
```

## Known Limitations

- Liquidation data is simulated (not real liquidation events)
- Only supports 4 cryptocurrencies
- LocalStorage for user data (not a real backend)
- No historical data persistence
- Binance API rate limits might affect updates

## Future Improvements

- Connect to real liquidation data API
- Add more cryptocurrencies
- Backend for user authentication
- Historical data with date picker
- Export heatmap as image
- Price alerts and notifications
- Mobile app version

## Screenshots

*Coming soon*

## Contributing

Feel free to open issues or submit PRs. This is a learning project so any feedback is appreciated.

## License

MIT License - see LICENSE file

---

**Disclaimer:** This is for educational purposes only. Not financial advice. The liquidation data shown is simulated and not actual market data.
