# Bitcoin Liquidation Long/Short Tracker

A web app that tracks Bitcoin long and short liquidation data and shows it on a simple chart. Helps you see which side of the market is getting liquidated more.

## Why I Built This

I wanted to learn more about how crypto markets work, especially liquidations. I've heard traders talk about "long squeezes" and "short squeezes" but never really understood what that meant in terms of actual numbers. So I built this tool to visualize the data and make it easier to understand.

Also, this was a good excuse to practice vanilla JavaScript and work with Chart.js without using React or any frameworks.

## Features

- Fetches Bitcoin liquidation data (currently using mock data for demo)
- Separates long vs short liquidations
- Shows total volumes and percentage difference
- Bar chart visualization (green = longs, red = shorts)
- Switch between 1h, 4h, and 24h timeframes
- Dark theme that looks crypto-ish
- Works on mobile and desktop
- Basic error handling

## Tech Stack

- HTML/CSS/JavaScript (no frameworks)
- Chart.js for the bar chart
- Mock API data (ready to connect to real API like Coinglass)

## Installation

No installation needed! Just download the files.

## How to Run

1. Open `index.html` in your browser (just double-click it)
2. That's it!

If you want to use a local server:
```bash
# Python
python -m http.server 8000

# Node
npx http-server
```

## How It Works

1. App requests liquidation data from API (currently mock data)
2. Data gets separated into longs and shorts
3. Calculates totals for each side
4. Percentage formula: `((longs - shorts) / (longs + shorts)) * 100`
   - Positive = more longs liquidated (bearish)
   - Negative = more shorts liquidated (bullish)
5. Chart.js renders the bar chart
6. Summary cards show the formatted numbers

## Known Issues

- Using mock data right now - needs real API integration
- Only shows Bitcoin, could add other coins
- No historical data or date picker
- Percentage calculation doesn't account for position sizes
- Could use some loading indicators

## Future Ideas

- Connect to real API (Coinglass, Binance, etc.)
- Add more coins (ETH, SOL, etc.)
- Historical data with date range
- Show breakdown by exchange
- Line chart for trends over time
- Auto-refresh every minute
- Export data to CSV
- Alerts for big liquidations

## Screenshots

*Will add screenshots after deployment*

## Project Structure

```
bitcoin-liquidation-tracker/
├── index.html          # Main HTML structure
├── style.css           # Styling and dark theme
├── script.js           # Application logic and data processing
└── README.md           # This file
```

## License

MIT - feel free to use this for learning

---

Built as a learning project to understand crypto market liquidations. Not financial advice!
