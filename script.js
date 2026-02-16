// Bitcoin Liquidation Tracker
// This app fetches liquidation data and shows which side (longs vs shorts) is getting hit harder

let chartInstance = null;
let currentTimeframe = '24h';
let lastData = null; // store last successful data in case API fails

// ============================================================================
// DATA PROCESSING FUNCTIONS
// ============================================================================

// COMMENT 1: Why we separate long and short liquidations
// Long liquidations happen when people betting on price going up get liquidated (bearish sign)
// Short liquidations happen when people betting on price going down get liquidated (bullish sign)
// By separating them, we can see which side of the market is under more pressure
function calculateTotal(liquidations, side) {
    return liquidations
        .filter(entry => entry.side === side)
        .reduce((sum, entry) => sum + entry.volume, 0);
}

// COMMENT 2: How total liquidation volume is calculated
// We filter all the liquidation entries by side (long or short), then use reduce() 
// to sum up all the volume values. This gives us the total USD value liquidated
// for that side of the market
function processLiquidationData(rawData) {
    const liquidations = rawData.data || [];
    
    const longTotal = calculateTotal(liquidations, 'long');
    const shortTotal = calculateTotal(liquidations, 'short');
    const percentageDiff = calculatePercentageDiff(longTotal, shortTotal);
    
    return {
        longTotal,
        shortTotal,
        percentageDiff,
        longFormatted: formatCurrency(longTotal),
        shortFormatted: formatCurrency(shortTotal),
        percentageFormatted: formatPercentage(percentageDiff)
    };
}

// COMMENT 3: How percentage difference is computed
// Formula: ((longs - shorts) / (longs + shorts)) * 100
// Positive % = more longs liquidated (bearish pressure)
// Negative % = more shorts liquidated (bullish pressure)
// The denominator normalizes it relative to total volume
function calculatePercentageDiff(longTotal, shortTotal) {
    if (longTotal + shortTotal === 0) {
        return 0; // avoid division by zero
    }
    return ((longTotal - shortTotal) / (longTotal + shortTotal)) * 100;
}

function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    });
}

function formatPercentage(value) {
    const sign = value >= 0 ? '+' : '';
    return sign + value.toFixed(2) + '%';
}

// ============================================================================
// API CLIENT
// ============================================================================

// COMMENT 4: What the API request is doing
// This function fetches Bitcoin liquidation data from an API endpoint
// Right now it's using mock data for demo purposes, but in production you'd
// replace this with a real API like Coinglass. The timeframe parameter (1h, 4h, 24h)
// tells the API which time period we want to see
async function fetchLiquidationData(timeframe) {
    try {
        // TODO: Replace with real API endpoint
        // const response = await fetch(`https://api.coinglass.com/liquidations?symbol=BTC&timeframe=${timeframe}`);
        
        await new Promise(resolve => setTimeout(resolve, 500)); // simulate network delay
        
        const mockData = generateMockData(timeframe);
        return { success: true, data: mockData };
    } catch (error) {
        console.error('API request failed:', error);
        return { success: false, error: error.message };
    }
}

// COMMENT 5: Assumptions about API data structure
// I'm assuming the API returns an object with a 'data' array containing liquidation entries
// Each entry should have: symbol, side ('long' or 'short'), volume (USD amount), and timestamp
// If the real API has a different structure, this function will need to be adjusted
function generateMockData(timeframe) {
    const multiplier = timeframe === '1h' ? 1 : timeframe === '4h' ? 3 : 8;
    const longCount = Math.floor(Math.random() * 20) + 10;
    const shortCount = Math.floor(Math.random() * 20) + 10;
    
    const data = [];
    
    for (let i = 0; i < longCount; i++) {
        data.push({
            symbol: 'BTCUSDT',
            side: 'long',
            volume: (Math.random() * 500000 + 100000) * multiplier,
            timestamp: Date.now() - Math.random() * 3600000
        });
    }
    
    for (let i = 0; i < shortCount; i++) {
        data.push({
            symbol: 'BTCUSDT',
            side: 'short',
            volume: (Math.random() * 500000 + 100000) * multiplier,
            timestamp: Date.now() - Math.random() * 3600000
        });
    }
    
    return { data };
}

// ============================================================================
// CHART FUNCTIONS
// ============================================================================

// COMMENT 6: How chart configuration works
// Using Chart.js to create a bar chart with 2 bars - green for longs, red for shorts
// The dark theme colors (#00ff88 for green, #ff4444 for red) match the crypto aesthetic
// maintainAspectRatio: false makes the chart fill its container instead of keeping a fixed ratio
function initializeChart() {
    const canvas = document.getElementById('liquidation-chart');
    const ctx = canvas.getContext('2d');
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Long Liquidations', 'Short Liquidations'],
            datasets: [{
                label: 'Liquidation Volume (USD)',
                data: [0, 0],
                backgroundColor: ['#00ff88', '#ff4444'],
                borderColor: ['#00cc66', '#cc0000'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#cccccc',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: { color: '#333333' }
                },
                x: {
                    ticks: { color: '#cccccc' },
                    grid: { color: '#333333' }
                }
            }
        }
    });
}

function updateChart(processedData) {
    if (chartInstance) {
        chartInstance.data.datasets[0].data = [
            processedData.longTotal,
            processedData.shortTotal
        ];
        chartInstance.update();
    }
}

// ============================================================================
// UI UPDATES
// ============================================================================

function updateSummaryCards(processedData) {
    document.getElementById('long-total').textContent = processedData.longFormatted;
    document.getElementById('short-total').textContent = processedData.shortFormatted;
    document.getElementById('percentage-diff').textContent = processedData.percentageFormatted;
}

// COMMENT 7: Error handling reasoning
// Instead of crashing when the API fails, we catch errors and show a user-friendly message
// We also keep the previous data visible (if any exists) so users don't see a blank screen
// The error message auto-hides after 5 seconds so it doesn't clutter the UI
function displayError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// COMMENT 8: Why timeframe filtering is implemented this way
// Each timeframe button triggers a new API request with that specific timeframe parameter
// This lets users compare short-term (1h) vs long-term (24h) liquidation patterns
// We update the button styling to show which timeframe is active, then fetch new data
async function handleTimeframeChange(timeframe) {
    currentTimeframe = timeframe;
    
    // update active button styling
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.timeframe === timeframe) {
            btn.classList.add('active');
        }
    });
    
    await loadData(timeframe);
}

async function loadData(timeframe) {
    const result = await fetchLiquidationData(timeframe);
    
    if (result.success) {
        const processedData = processLiquidationData(result.data);
        lastData = processedData; // save for error recovery
        updateSummaryCards(processedData);
        updateChart(processedData);
    } else {
        displayError('Failed to load liquidation data. Please try again.');
        // keep showing last successful data if available
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Bitcoin Liquidation Tracker loaded');
    
    initializeChart();
    
    // setup button click handlers
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleTimeframeChange(btn.dataset.timeframe);
        });
    });
    
    // load initial data (defaults to 24h)
    loadData(currentTimeframe);
});
