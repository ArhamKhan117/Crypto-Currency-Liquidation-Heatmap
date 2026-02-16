// Crypto Liquidation Heatmap
// Built this to visualize liquidation data across different price levels and time

let currentSymbol = 'BTC';
let currentTimeframe = '4h';
let currentView = 'combined';
let heatmapData = [];

// Config settings for the grid
const config = {
    priceSteps: 20,  // how many price levels to show
    timeSteps: 24,   // time intervals in the heatmap
    updateInterval: 5000  // refresh every 5 sec
};

// Starting price ranges - these get updated from Binance API
const priceRanges = {
    'BTC': { min: 65000, max: 70000, current: 67000 },
    'ETH': { min: 2400, max: 2800, current: 2600 },
    'SOL': { min: 120, max: 160, current: 140 },
    'BNB': { min: 580, max: 650, current: 612 }
};

// Map our symbols to Binance trading pairs
const binanceSymbols = {
    'BTC': 'BTCUSDT',
    'ETH': 'ETHUSDT',
    'SOL': 'SOLUSDT',
    'BNB': 'BNBUSDT'
};

// Start everything when page loads
async function init() {
    loadUserInfo();
    setupEventListeners();
    setupThemeToggle();
    generateHeatmapGrid();
    
    // Get the real price from Binance first before showing anything
    await fetchRealPrice(currentSymbol);
    
    generatePriceAxis();
    generateTimeAxis();
    loadHeatmapData();
    updateFavoriteButton();
    
    // Keep refreshing data every few seconds
    setInterval(async () => {
        loadHeatmapData();
        await updateCurrentPrice();
    }, config.updateInterval);
}

// Check if user is logged in and load their info
function loadUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('guest-info').style.display = 'none';
        
        document.querySelector('.username').textContent = user.username;
        document.querySelector('.favorite-badge').textContent = user.favoriteCrypto;
        
        // If they have a favorite crypto, show that one by default
        currentSymbol = user.favoriteCrypto;
        
        document.querySelectorAll('.crypto-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.symbol === currentSymbol) {
                btn.classList.add('active');
            }
        });
    } else {
        // Not logged in - show guest mode
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('guest-info').style.display = 'flex';
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// Show login modal when guest tries to use login-only features
function showLoginModal() {
    const shouldLogin = confirm('Please login to access all features including marking favorites.\n\nWould you like to go to the login page?');
    if (shouldLogin) {
        window.location.href = 'index.html';
    }
}

// Toggle favorite crypto
function toggleFavorite() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Guest user - prompt to login
        showLoginModal();
        return;
    }
    
    // Logged in user - update favorite
    const user = JSON.parse(currentUser);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Update user's favorite crypto
    user.favoriteCrypto = currentSymbol;
    
    // Update in users array
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex].favoriteCrypto = currentSymbol;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update current user
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update UI
    document.querySelector('.favorite-badge').textContent = currentSymbol;
    updateFavoriteButton();
    
    // Show feedback
    const btn = document.getElementById('favorite-btn');
    const originalText = btn.querySelector('.text').textContent;
    btn.querySelector('.text').textContent = 'Saved!';
    setTimeout(() => {
        btn.querySelector('.text').textContent = originalText;
    }, 1500);
}

// Update favorite button state
function updateFavoriteButton() {
    const currentUser = localStorage.getItem('currentUser');
    const btn = document.getElementById('favorite-btn');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.favoriteCrypto === currentSymbol) {
            btn.classList.add('is-favorite');
            btn.querySelector('.text').textContent = 'Favorited';
        } else {
            btn.classList.remove('is-favorite');
            btn.querySelector('.text').textContent = 'Mark as Favorite';
        }
    } else {
        btn.classList.remove('is-favorite');
        btn.querySelector('.text').textContent = 'Mark as Favorite';
    }
}

// Setup theme toggle
function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Cryptocurrency selection
    document.querySelectorAll('.crypto-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.crypto-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSymbol = btn.dataset.symbol;
            
            // Fetch real price for new crypto
            await fetchRealPrice(currentSymbol);
            
            generatePriceAxis();
            loadHeatmapData();
            updateFavoriteButton();
        });
    });

    // Timeframe selection
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTimeframe = btn.dataset.time;
            generateTimeAxis();
            loadHeatmapData();
        });
    });

    // View mode selection
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            updateHeatmapDisplay();
        });
    });
}

// Generate the heatmap grid
function generateHeatmapGrid() {
    const grid = document.getElementById('heatmap-grid');
    grid.innerHTML = '';

    for (let row = 0; row < config.priceSteps; row++) {
        for (let col = 0; col < config.timeSteps; col++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add hover effect with tooltip
            cell.addEventListener('mouseenter', (e) => showTooltip(e, row, col));
            cell.addEventListener('mouseleave', hideTooltip);
            
            grid.appendChild(cell);
        }
    }
}

// Generate price axis labels
function generatePriceAxis() {
    const axis = document.getElementById('price-axis');
    axis.innerHTML = '';
    
    const range = priceRanges[currentSymbol];
    const step = (range.max - range.min) / (config.priceSteps - 1);
    
    for (let i = 0; i < config.priceSteps; i++) {
        const price = range.max - (step * i);
        const label = document.createElement('div');
        label.className = 'price-label';
        label.textContent = '$' + price.toFixed(0);
        axis.appendChild(label);
    }
}

// Generate time axis labels
function generateTimeAxis() {
    const axis = document.getElementById('time-axis');
    axis.innerHTML = '';
    
    const intervals = {
        '15m': 15,
        '1h': 60,
        '4h': 240,
        '24h': 1440
    };
    
    const totalMinutes = intervals[currentTimeframe];
    const stepMinutes = totalMinutes / config.timeSteps;
    
    // Show labels for every 4th interval
    for (let i = 0; i < config.timeSteps; i++) {
        if (i % 4 === 0) {
            const minutesAgo = totalMinutes - (stepMinutes * i);
            const label = document.createElement('div');
            label.className = 'time-label';
            
            if (minutesAgo >= 60) {
                label.textContent = Math.floor(minutesAgo / 60) + 'h ago';
            } else {
                label.textContent = minutesAgo + 'm ago';
            }
            
            axis.appendChild(label);
        }
    }
}

// Generate mock liquidation data for the heatmap
// In a real app this would come from an API but for now I'm simulating it
function loadHeatmapData() {
    heatmapData = [];
    
    const range = priceRanges[currentSymbol];
    const priceStep = (range.max - range.min) / config.priceSteps;
    
    for (let row = 0; row < config.priceSteps; row++) {
        heatmapData[row] = [];
        const price = range.max - (priceStep * row);
        
        for (let col = 0; col < config.timeSteps; col++) {
            // Make liquidations more intense near current price and recent times
            // This creates a more realistic looking pattern
            const timeFactor = 1 - (col / config.timeSteps) * 0.5;
            const priceFactor = 1 - Math.abs(row - config.priceSteps / 2) / (config.priceSteps / 2) * 0.3;
            
            const baseVolume = Math.random() * 1000000 * timeFactor * priceFactor;
            const longLiq = baseVolume * (0.3 + Math.random() * 0.7);
            const shortLiq = baseVolume * (0.3 + Math.random() * 0.7);
            
            heatmapData[row][col] = {
                price: price,
                longLiquidations: longLiq,
                shortLiquidations: shortLiq,
                totalVolume: longLiq + shortLiq,
                timestamp: Date.now() - (col * 600000) // each column is 10 min apart
            };
        }
    }
    
    updateHeatmapDisplay();
    updateInsights();
}

// Color the heatmap cells based on liquidation volume
// Had to normalize the values so the colors look good
function updateHeatmapDisplay() {
    const cells = document.querySelectorAll('.heatmap-cell');
    let maxVolume = 0;
    
    // First pass - find the highest volume to normalize against
    heatmapData.forEach(row => {
        row.forEach(cell => {
            let volume = 0;
            if (currentView === 'combined') {
                volume = cell.totalVolume;
            } else if (currentView === 'longs') {
                volume = cell.longLiquidations;
            } else {
                volume = cell.shortLiquidations;
            }
            maxVolume = Math.max(maxVolume, volume);
        });
    });
    
    // Second pass - apply colors based on intensity
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const data = heatmapData[row][col];
        
        let volume = 0;
        let prefix = '';
        
        if (currentView === 'combined') {
            volume = data.totalVolume;
            prefix = 'combined';
        } else if (currentView === 'longs') {
            volume = data.longLiquidations;
            prefix = 'long';
        } else {
            volume = data.shortLiquidations;
            prefix = 'short';
        }
        
        // Map volume to intensity level 1-6
        const normalized = volume / maxVolume;
        let intensity = 1;
        if (normalized > 0.8) intensity = 6;
        else if (normalized > 0.6) intensity = 5;
        else if (normalized > 0.4) intensity = 4;
        else if (normalized > 0.25) intensity = 3;
        else if (normalized > 0.1) intensity = 2;
        
        cell.className = 'heatmap-cell';
        cell.classList.add(`${prefix}-intensity-${intensity}`);
    });
}

// Show tooltip on hover
function showTooltip(event, row, col) {
    const tooltip = document.getElementById('tooltip');
    const data = heatmapData[row][col];
    
    // Update tooltip content
    const timeAgo = Math.floor((Date.now() - data.timestamp) / 60000);
    tooltip.querySelector('.tooltip-time').textContent = timeAgo + ' min ago';
    tooltip.querySelector('.tooltip-price').textContent = '$' + data.price.toFixed(2);
    tooltip.querySelector('.long-value').textContent = '$' + formatNumber(data.longLiquidations);
    tooltip.querySelector('.short-value').textContent = '$' + formatNumber(data.shortLiquidations);
    tooltip.querySelector('.total-value').textContent = '$' + formatNumber(data.totalVolume);
    
    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    
    tooltip.classList.add('visible');
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible');
}

// Calculate and update the insight cards at the bottom
// Shows total liquidations, hottest price zone, long/short ratio, and peak time
function updateInsights() {
    let totalLiq = 0;
    let totalLongs = 0;
    let totalShorts = 0;
    let maxVolume = 0;
    let hotZonePrice = 0;
    let peakHourIndex = 0;
    let peakHourVolume = 0;
    
    const hourlyVolumes = new Array(config.timeSteps).fill(0);
    
    // Loop through all the data to calculate stats
    heatmapData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            totalLiq += cell.totalVolume;
            totalLongs += cell.longLiquidations;
            totalShorts += cell.shortLiquidations;
            hourlyVolumes[colIndex] += cell.totalVolume;
            
            // Track which price level has the most liquidations
            if (cell.totalVolume > maxVolume) {
                maxVolume = cell.totalVolume;
                hotZonePrice = cell.price;
            }
        });
    });
    
    // Find which time period had the most activity
    hourlyVolumes.forEach((volume, index) => {
        if (volume > peakHourVolume) {
            peakHourVolume = volume;
            peakHourIndex = index;
        }
    });
    
    // Update the UI with calculated values
    document.getElementById('total-liq').textContent = '$' + formatNumber(totalLiq);
    document.getElementById('hot-zone').textContent = '$' + hotZonePrice.toFixed(0);
    
    const ratio = (totalLongs / totalShorts).toFixed(2);
    document.getElementById('ls-ratio').textContent = ratio + ':1';
    
    const intervals = {
        '15m': 15,
        '1h': 60,
        '4h': 240,
        '24h': 1440
    };
    const minutesAgo = Math.floor((intervals[currentTimeframe] / config.timeSteps) * peakHourIndex);
    document.getElementById('peak-hour').textContent = minutesAgo + ' min ago';
}

// Fetch live price data from Binance
// This was tricky to figure out but basically just hits their public API
async function fetchRealPrice(symbol) {
    try {
        const binanceSymbol = binanceSymbols[symbol];
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`);
        const data = await response.json();
        
        if (data.price) {
            const price = parseFloat(data.price);
            
            // Update our price range with the real current price
            const range = priceRanges[symbol];
            range.current = price;
            
            // Set min/max to ±5% so the heatmap stays relevant
            range.min = price * 0.95;
            range.max = price * 1.05;
            
            // Show the price on screen
            document.getElementById('avg-price').textContent = '$' + price.toFixed(2);
            
            // Redraw the price axis with new values
            generatePriceAxis();
        }
    } catch (error) {
        console.error('Error fetching price from Binance:', error);
        // If API fails just use simulated prices
        updateCurrentPriceSimulated();
    }
}

// Update current price with live simulation (fallback)
function updateCurrentPriceSimulated() {
    const range = priceRanges[currentSymbol];
    
    // Simulate small price fluctuations
    const fluctuation = (Math.random() - 0.5) * (range.max - range.min) * 0.02;
    range.current = Math.max(range.min, Math.min(range.max, range.current + fluctuation));
    
    // Update display
    document.getElementById('avg-price').textContent = '$' + range.current.toFixed(2);
}

// Update current price - tries real API first, falls back to simulation
async function updateCurrentPrice() {
    await fetchRealPrice(currentSymbol);
}

// Helper to format big numbers into readable format (like 1.5M instead of 1500000)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
