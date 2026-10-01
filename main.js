// TradePro Main JavaScript File - Enhanced Interactions

// Global variables for better interaction management
let tradingChart = null;
let portfolioCharts = {};
let analyticsCharts = {};
let currentWatchlist = [];
let currentHoldings = [];
let currentScreenerResults = [];

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Initializing TradePro Application...');
    
    // Initialize all components
    initScrollReveal();
    initLiquidBackground();
    initTradingDashboard();
    initPortfolioCharts();
    initAnalyticsCharts();
    initWatchlist();
    initHoldingsTable();
    initScreenerResults();
    initEventListeners();
    initButtonHandlers();
    
    // Start real-time data updates
    startRealTimeUpdates();
    
    console.log('TradePro Application Initialized Successfully');
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add staggered animation for cards
                if (entry.target.classList.contains('trading-card') || 
                    entry.target.classList.contains('glass-card')) {
                    anime({
                        targets: entry.target,
                        translateY: [20, 0],
                        opacity: [0, 1],
                        duration: 600,
                        delay: Math.random() * 200,
                        easing: 'easeOutQuad'
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Liquid Background Animation
function initLiquidBackground() {
    const canvas = document.getElementById('liquidCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Trading Dashboard Initialization
function initTradingDashboard() {
    if (document.getElementById('tradingChart')) {
        createTradingChart();
    }
}

function createTradingChart() {
    const chartDom = document.getElementById('tradingChart');
    if (!chartDom) return;
    
    tradingChart = echarts.init(chartDom, 'dark');
    
    // Generate sample candlestick data
    const data = generateCandlestickData();
    
    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: data.dates,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            scale: true,
            splitArea: {
                show: true
            }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 50,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                top: '90%',
                start: 50,
                end: 100
            }
        ],
        series: [
            {
                name: 'AAPL',
                type: 'candlestick',
                data: data.values,
                itemStyle: {
                    color: '#00ff88',
                    color0: '#ff4444',
                    borderColor: '#00ff88',
                    borderColor0: '#ff4444'
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        }
    };
    
    tradingChart.setOption(option);
    
    // Handle timeframe buttons
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.timeframe-btn').forEach(b => {
                b.classList.remove('bg-yellow-400', 'text-black');
                b.classList.add('bg-gray-700', 'text-white');
            });
            this.classList.remove('bg-gray-700', 'text-white');
            this.classList.add('bg-yellow-400', 'text-black');
            
            // Update chart data based on timeframe
            const timeframe = this.dataset.timeframe;
            updateChartTimeframe(timeframe);
        });
    });
}

function generateCandlestickData() {
    const dates = [];
    const values = [];
    const basePrice = 175;
    
    for (let i = 0; i < 100; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (100 - i));
        dates.push(date.toISOString().split('T')[0]);
        
        const open = basePrice + (Math.random() - 0.5) * 10;
        const close = open + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 3;
        const low = Math.min(open, close) - Math.random() * 3;
        
        values.push([open, close, low, high]);
    }
    
    return { dates, values };
}

function updateChartTimeframe(timeframe) {
    if (!tradingChart) return;
    
    // This would normally fetch real data based on timeframe
    const newData = generateCandlestickData();
    tradingChart.setOption({
        xAxis: {
            data: newData.dates
        },
        series: [{
            data: newData.values
        }]
    });
}

// Portfolio Charts
function initPortfolioCharts() {
    if (document.getElementById('allocationChart')) {
        createAllocationChart();
    }
    if (document.getElementById('performanceChart')) {
        createPerformanceChart();
    }
    if (document.getElementById('sectorChart')) {
        createSectorChart();
    }
}

function createAllocationChart() {
    const chartDom = document.getElementById('allocationChart');
    if (!chartDom) return;
    
    portfolioCharts.allocation = echarts.init(chartDom, 'dark');
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% ({d}%)'
        },
        series: [
            {
                name: 'Asset Allocation',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#1a1a1a',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 65.2, name: 'Stocks', itemStyle: { color: '#4a90e2' } },
                    { value: 22.8, name: 'ETFs', itemStyle: { color: '#00ff88' } },
                    { value: 8.5, name: 'Bonds', itemStyle: { color: '#ffa500' } },
                    { value: 3.5, name: 'Cash', itemStyle: { color: '#d4af37' } }
                ]
            }
        ]
    };
    
    portfolioCharts.allocation.setOption(option);
}

function createPerformanceChart() {
    const chartDom = document.getElementById('performanceChart');
    if (!chartDom) return;
    
    portfolioCharts.performance = echarts.init(chartDom, 'dark');
    
    // Generate sample performance data
    const dates = [];
    const portfolioData = [];
    const benchmarkData = [];
    
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (30 - i));
        dates.push(date.toISOString().split('T')[0]);
        
        portfolioData.push(100 + Math.sin(i * 0.1) * 10 + Math.random() * 5);
        benchmarkData.push(100 + Math.sin(i * 0.1) * 8 + Math.random() * 3);
    }
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['Portfolio', 'S&P 500'],
            textStyle: {
                color: '#ffffff'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLine: {
                lineStyle: {
                    color: '#666'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#666'
                }
            }
        },
        series: [
            {
                name: 'Portfolio',
                type: 'line',
                data: portfolioData,
                lineStyle: {
                    color: '#d4af37'
                },
                itemStyle: {
                    color: '#d4af37'
                }
            },
            {
                name: 'S&P 500',
                type: 'line',
                data: benchmarkData,
                lineStyle: {
                    color: '#4a90e2'
                },
                itemStyle: {
                    color: '#4a90e2'
                }
            }
        ]
    };
    
    portfolioCharts.performance.setOption(option);
}

function createSectorChart() {
    const chartDom = document.getElementById('sectorChart');
    if (!chartDom) return;
    
    portfolioCharts.sector = echarts.init(chartDom, 'dark');
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#666'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Utilities'],
            axisLine: {
                lineStyle: {
                    color: '#666'
                }
            }
        },
        series: [
            {
                name: 'Allocation',
                type: 'bar',
                data: [35.2, 18.5, 15.3, 12.8, 8.7, 9.5],
                itemStyle: {
                    color: function(params) {
                        const colors = ['#4a90e2', '#00ff88', '#ffa500', '#d4af37', '#ff4444', '#9b59b6'];
                        return colors[params.dataIndex];
                    }
                }
            }
        ]
    };
    
    portfolioCharts.sector.setOption(option);
}

// Analytics Charts
function initAnalyticsCharts() {
    if (document.getElementById('heatMapChart')) {
        createHeatMapChart();
    }
    if (document.getElementById('sentimentChart')) {
        createSentimentChart();
    }
}

function createHeatMapChart() {
    const chartDom = document.getElementById('heatMapChart');
    if (!chartDom) return;
    
    analyticsCharts.heatMap = echarts.init(chartDom, 'dark');
    
    const sectors = ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Utilities'];
    const companies = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];
    const data = [];
    
    for (let i = 0; i < sectors.length; i++) {
        for (let j = 0; j < companies.length; j++) {
            data.push([j, i, Math.random() * 10 - 5]);
        }
    }
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            position: 'top',
            formatter: function(params) {
                return companies[params.data[0]] + ' in ' + sectors[params.data[1]] + ': ' + params.data[2].toFixed(2) + '%';
            }
        },
        grid: {
            height: '50%',
            top: '10%'
        },
        xAxis: {
            type: 'category',
            data: companies,
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: sectors,
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: -5,
            max: 5,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            inRange: {
                color: ['#ff4444', '#1a1a1a', '#00ff88']
            }
        },
        series: [{
            name: 'Performance',
            type: 'heatmap',
            data: data,
            label: {
                show: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    analyticsCharts.heatMap.setOption(option);
}

function createSentimentChart() {
    const chartDom = document.getElementById('sentimentChart');
    if (!chartDom) return;
    
    analyticsCharts.sentiment = echarts.init(chartDom, 'dark');
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: 'Market Sentiment',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#1a1a1a',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 73, name: 'Bullish', itemStyle: { color: '#00ff88' } },
                    { value: 18, name: 'Neutral', itemStyle: { color: '#ffa500' } },
                    { value: 9, name: 'Bearish', itemStyle: { color: '#ff4444' } }
                ]
            }
        ]
    };
    
    analyticsCharts.sentiment.setOption(option);
}

// Watchlist Initialization
function initWatchlist() {
    const watchlistContainer = document.getElementById('watchlist');
    if (!watchlistContainer) return;
    
    currentWatchlist = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: -1.23, changePercent: -0.32 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: 3.67, changePercent: 2.64 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.78, change: -2.45, changePercent: -1.65 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 238.45, change: 8.90, changePercent: 3.88 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.23, change: 12.34, changePercent: 2.56 }
    ];
    
    currentWatchlist.forEach(stock => {
        const stockElement = createWatchlistItem(stock);
        watchlistContainer.appendChild(stockElement);
    });
}

function createWatchlistItem(stock) {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors watchlist-item';
    div.dataset.symbol = stock.symbol;
    
    const changeClass = stock.change >= 0 ? 'price-positive' : 'price-negative';
    const changeSign = stock.change >= 0 ? '+' : '';
    
    div.innerHTML = `
        <div>
            <div class="text-white font-semibold">${stock.symbol}</div>
            <div class="text-gray-400 text-sm">${stock.name}</div>
        </div>
        <div class="text-right">
            <div class="text-white font-semibold price-display" style="font-family: 'JetBrains Mono', monospace;">$${stock.price.toFixed(2)}</div>
            <div class="text-sm ${changeClass} change-display">${changeSign}${stock.change.toFixed(2)} (${changeSign}${stock.changePercent.toFixed(2)}%)</div>
        </div>
    `;
    
    div.addEventListener('click', () => {
        // Update trading chart with selected stock
        updateTradingChart(stock.symbol);
        
        // Highlight selected item
        document.querySelectorAll('.watchlist-item').forEach(item => {
            item.classList.remove('bg-yellow-400', 'bg-opacity-20');
        });
        div.classList.add('bg-yellow-400', 'bg-opacity-20');
    });
    
    return div;
}

function updateTradingChart(symbol) {
    if (!tradingChart) return;
    
    // Update chart title
    const chartTitle = document.querySelector('h3:contains("-")');
    if (chartTitle) {
        chartTitle.textContent = `${symbol} - Stock Analysis`;
    }
    
    // Generate new data for the selected stock
    const newData = generateCandlestickData();
    tradingChart.setOption({
        series: [{
            name: symbol,
            data: newData.values
        }]
    });
    
    showNotification(`Chart updated for ${symbol}`, 'success');
}

// Holdings Table
function initHoldingsTable() {
    const holdingsTable = document.getElementById('holdingsTable');
    if (!holdingsTable) return;
    
    currentHoldings = [
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 500, avgCost: 165.23, currentPrice: 175.43, marketValue: 87715.00, pnl: 5100.00, weight: 10.35 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 300, avgCost: 365.78, currentPrice: 378.91, marketValue: 113673.00, pnl: 3939.00, weight: 13.42 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 200, avgCost: 135.67, currentPrice: 142.56, marketValue: 28512.00, pnl: 1378.00, weight: 3.36 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 150, avgCost: 148.90, currentPrice: 145.78, marketValue: 21867.00, pnl: -468.00, weight: 2.58 },
        { symbol: 'TSLA', name: 'Tesla Inc.', shares: 100, avgCost: 225.34, currentPrice: 238.45, marketValue: 23845.00, pnl: 1311.00, weight: 2.81 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 80, avgCost: 478.90, currentPrice: 495.23, marketValue: 39618.40, pnl: 1306.40, weight: 4.68 }
    ];
    
    currentHoldings.forEach(holding => {
        const row = createHoldingsRow(holding);
        holdingsTable.appendChild(row);
    });
}

function createHoldingsRow(holding) {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-700 hover:bg-gray-700 transition-colors holdings-row';
    row.dataset.symbol = holding.symbol;
    
    const pnlClass = holding.pnl >= 0 ? 'price-positive' : 'price-negative';
    const pnlSign = holding.pnl >= 0 ? '+' : '';
    
    row.innerHTML = `
        <td class="py-3 px-4 text-white font-semibold">${holding.symbol}</td>
        <td class="py-3 px-4 text-white">${holding.name}</td>
        <td class="py-3 px-4 text-right text-white shares-display" style="font-family: 'JetBrains Mono', monospace;">${holding.shares}</td>
        <td class="py-3 px-4 text-right text-white avg-cost-display" style="font-family: 'JetBrains Mono', monospace;">$${holding.avgCost.toFixed(2)}</td>
        <td class="py-3 px-4 text-right text-white current-price-display" style="font-family: 'JetBrains Mono', monospace;">$${holding.currentPrice.toFixed(2)}</td>
        <td class="py-3 px-4 text-right text-white market-value-display" style="font-family: 'JetBrains Mono', monospace;">$${holding.marketValue.toLocaleString()}</td>
        <td class="py-3 px-4 text-right ${pnlClass} pnl-display" style="font-family: 'JetBrains Mono', monospace;">${pnlSign}$${holding.pnl.toLocaleString()}</td>
        <td class="py-3 px-4 text-right text-white weight-display" style="font-family: 'JetBrains Mono', monospace;">${holding.weight.toFixed(2)}%</td>
        <td class="py-3 px-4 text-center">
            <button class="px-3 py-1 bg-yellow-400 text-black rounded text-sm font-semibold hover:bg-yellow-500 transition-colors trade-btn" data-symbol="${holding.symbol}">Trade</button>
        </td>
    `;
    
    // Add trade button functionality
    const tradeBtn = row.querySelector('.trade-btn');
    tradeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showTradeModal(holding.symbol);
    });
    
    return row;
}

// Screener Results
function initScreenerResults() {
    const screenerResults = document.getElementById('screenerResults');
    if (!screenerResults) return;
    
    currentScreenerResults = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24, pe: 28.5, marketCap: '2.8T' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: -1.23, changePercent: -0.32, pe: 32.1, marketCap: '2.9T' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: 3.67, changePercent: 2.64, pe: 25.8, marketCap: '1.8T' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.78, change: -2.45, changePercent: -1.65, pe: 45.2, marketCap: '1.5T' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 238.45, change: 8.90, changePercent: 3.88, pe: 67.3, marketCap: '758B' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.23, change: 12.34, changePercent: 2.56, pe: 89.4, marketCap: '1.2T' }
    ];
    
    currentScreenerResults.forEach(stock => {
        const row = createScreenerRow(stock);
        screenerResults.appendChild(row);
    });
}

function createScreenerRow(stock) {
    const row = document.createElement('tr');
    row.className = 'stock-row border-b border-gray-700 hover:bg-gray-700 transition-colors';
    row.dataset.symbol = stock.symbol;
    
    const changeClass = stock.change >= 0 ? 'price-positive' : 'price-negative';
    const changeSign = stock.change >= 0 ? '+' : '';
    
    row.innerHTML = `
        <td class="py-3 px-4 text-white font-semibold">${stock.symbol}</td>
        <td class="py-3 px-4 text-white">${stock.name}</td>
        <td class="py-3 px-4 text-right text-white price-display" style="font-family: 'JetBrains Mono', monospace;">$${stock.price.toFixed(2)}</td>
        <td class="py-3 px-4 text-right ${changeClass} change-display" style="font-family: 'JetBrains Mono', monospace;">${changeSign}${stock.change.toFixed(2)} (${changeSign}${stock.changePercent.toFixed(2)}%)</td>
        <td class="py-3 px-4 text-right text-white pe-display" style="font-family: 'JetBrains Mono', monospace;">${stock.pe}</td>
        <td class="py-3 px-4 text-right text-white market-cap-display" style="font-family: 'JetBrains Mono', monospace;">${stock.marketCap}</td>
        <td class="py-3 px-4 text-center">
            <button class="px-3 py-1 bg-yellow-400 text-black rounded text-sm font-semibold hover:bg-yellow-500 transition-colors mr-2 add-btn" data-symbol="${stock.symbol}">Add</button>
            <button class="px-3 py-1 border border-yellow-400 text-yellow-400 rounded text-sm hover:bg-yellow-400 hover:text-black transition-colors chart-btn" data-symbol="${stock.symbol}">Chart</button>
        </td>
    `;
    
    // Add button functionality
    const addBtn = row.querySelector('.add-btn');
    const chartBtn = row.querySelector('.chart-btn');
    
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToWatchlist(stock.symbol);
    });
    
    chartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showStockChart(stock.symbol);
    });
    
    return row;
}

// Button Handlers
function initButtonHandlers() {
    // Hero buttons
    const startTradingBtn = document.querySelector('button:contains("Start Trading")');
    const viewDemoBtn = document.querySelector('button:contains("View Demo")');
    
    if (startTradingBtn) {
        startTradingBtn.addEventListener('click', () => {
            showNotification('Welcome to TradePro! Trading features coming soon.', 'info');
        });
    }
    
    if (viewDemoBtn) {
        viewDemoBtn.addEventListener('click', () => {
            showNotification('Demo mode activated! Explore the platform.', 'success');
        });
    }
    
    // Order placement buttons
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.includes('Place Buy Order')) {
            button.addEventListener('click', () => {
                handleOrderPlacement('buy');
            });
        }
        
        if (button.textContent.includes('Place Sell Order')) {
            button.addEventListener('click', () => {
                handleOrderPlacement('sell');
            });
        }
        
        // Add to watchlist button
        if (button.textContent.includes('Add Symbol')) {
            button.addEventListener('click', () => {
                showAddSymbolModal();
            });
        }
        
        // Export buttons
        if (button.textContent.includes('Export')) {
            button.addEventListener('click', () => {
                handleExport();
            });
        }
    });
}

function handleOrderPlacement(type) {
    const quantityInput = document.querySelector('input[placeholder="Quantity"]');
    const priceInput = document.querySelector('input[placeholder="Price"]');
    
    if (!quantityInput || !priceInput) {
        showNotification('Please fill in order details', 'error');
        return;
    }
    
    const quantity = parseFloat(quantityInput.value);
    const price = parseFloat(priceInput.value);
    
    if (!quantity || !price) {
        showNotification('Please enter valid quantity and price', 'error');
        return;
    }
    
    const orderType = type === 'buy' ? 'Buy' : 'Sell';
    showNotification(`${orderType} order placed: ${quantity} shares at $${price}`, 'success');
    
    // Clear inputs
    quantityInput.value = '';
    priceInput.value = '';
}

function showAddSymbolModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay';
    modal.innerHTML = `
        <div class="glass-card p-8 max-w-md w-full mx-4 modal-content">
            <h3 class="text-xl font-semibold text-white mb-6">Add Symbol to Watchlist</h3>
            <div class="space-y-4">
                <input type="text" id="symbolInput" placeholder="Enter symbol (e.g., AAPL)" class="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none">
                <div class="flex space-x-3">
                    <button id="confirmAddSymbol" class="flex-1 bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Add</button>
                    <button id="cancelAddSymbol" class="flex-1 border border-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus on input
    const symbolInput = document.getElementById('symbolInput');
    symbolInput.focus();
    
    // Handle modal actions
    document.getElementById('confirmAddSymbol').addEventListener('click', () => {
        const symbol = symbolInput.value.toUpperCase().trim();
        if (symbol) {
            addToWatchlist(symbol);
            modal.remove();
        }
    });
    
    document.getElementById('cancelAddSymbol').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Animate modal in
    anime({
        targets: modal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

function addToWatchlist(symbol) {
    // Check if symbol already exists
    if (currentWatchlist.find(stock => stock.symbol === symbol)) {
        showNotification(`${symbol} is already in your watchlist`, 'warning');
        return;
    }
    
    // Add new stock to watchlist
    const newStock = {
        symbol: symbol,
        name: `${symbol} Corp.`,
        price: Math.random() * 500 + 100,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5
    };
    
    currentWatchlist.push(newStock);
    
    const watchlistContainer = document.getElementById('watchlist');
    if (watchlistContainer) {
        const stockElement = createWatchlistItem(newStock);
        watchlistContainer.appendChild(stockElement);
        
        // Animate new item
        anime({
            targets: stockElement,
            translateX: [-300, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutQuad'
        });
    }
    
    showNotification(`${symbol} added to watchlist`, 'success');
}

function showTradeModal(symbol) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay';
    modal.innerHTML = `
        <div class="glass-card p-8 max-w-lg w-full mx-4 modal-content">
            <h3 class="text-xl font-semibold text-white mb-6">Trade ${symbol}</h3>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm text-gray-300 mb-2">Order Type</label>
                        <select id="orderType" class="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none">
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-300 mb-2">Order Style</label>
                        <select id="orderStyle" class="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none">
                            <option value="market">Market</option>
                            <option value="limit">Limit</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm text-gray-300 mb-2">Quantity</label>
                    <input type="number" id="tradeQuantity" placeholder="Enter quantity" class="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none">
                </div>
                <div>
                    <label class="block text-sm text-gray-300 mb-2">Price</label>
                    <input type="number" id="tradePrice" placeholder="Enter price" class="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none">
                </div>
                <div class="flex space-x-3">
                    <button id="confirmTrade" class="flex-1 bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Place Order</button>
                    <button id="cancelTrade" class="flex-1 border border-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle modal actions
    document.getElementById('confirmTrade').addEventListener('click', () => {
        const orderType = document.getElementById('orderType').value;
        const orderStyle = document.getElementById('orderStyle').value;
        const quantity = parseFloat(document.getElementById('tradeQuantity').value);
        const price = parseFloat(document.getElementById('tradePrice').value);
        
        if (!quantity || !price) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        placeOrder(symbol, orderType, orderStyle, quantity, price);
        modal.remove();
    });
    
    document.getElementById('cancelTrade').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Animate modal in
    anime({
        targets: modal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

function placeOrder(symbol, type, style, quantity, price) {
    const orderType = type === 'buy' ? 'Buy' : 'Sell';
    const orderStyle = style.charAt(0).toUpperCase() + style.slice(1);
    
    showNotification(`${orderType} ${orderStyle} order placed: ${quantity} shares of ${symbol} at $${price}`, 'success');
}

function showStockChart(symbol) {
    showNotification(`Opening chart for ${symbol}`, 'info');
    // In a real app, this would open a detailed chart view
}

function handleExport() {
    showNotification('Export feature coming soon!', 'info');
}

// Event Listeners
function initEventListeners() {
    // Filter buttons in analytics
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update heatmap based on filter
            if (analyticsCharts.heatMap) {
                // Regenerate data with different metrics
                createHeatMapChart();
            }
        });
    });
    
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Button hover effects with anime.js
    document.querySelectorAll('.btn-primary, .glass-card, .trading-card').forEach(element => {
        element.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        element.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Performance chart timeframe buttons
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent === '1M' || button.textContent === '3M' || 
            button.textContent === '6M' || button.textContent === '1Y' || button.textContent === 'ALL') {
            button.addEventListener('click', function() {
                // Update performance chart timeframe
                document.querySelectorAll('button').forEach(b => {
                    if (b.textContent === '1M' || b.textContent === '3M' || 
                        b.textContent === '6M' || b.textContent === '1Y' || b.textContent === 'ALL') {
                        b.classList.remove('bg-yellow-400', 'text-black');
                        b.classList.add('bg-gray-700', 'text-white');
                    }
                });
                this.classList.remove('bg-gray-700', 'text-white');
                this.classList.add('bg-yellow-400', 'text-black');
                
                showNotification(`Performance chart updated to ${this.textContent}`, 'info');
            });
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 notification ${type}`;
    notification.textContent = message;
    
    // Set colors based on type
    const colors = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-600 text-black',
        info: 'bg-blue-600 text-white'
    };
    
    notification.className += ` ${colors[type]}`;
    
    document.body.appendChild(notification);
    
    // Animate notification
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuad',
        complete: () => {
            setTimeout(() => {
                anime({
                    targets: notification,
                    translateX: [0, 300],
                    opacity: [1, 0],
                    duration: 500,
                    easing: 'easeInQuad',
                    complete: () => notification.remove()
                });
            }, 3000);
        }
    });
}

// Real-time data simulation
function startRealTimeUpdates() {
    setInterval(() => {
        updateWatchlistPrices();
        updateMarketCards();
        updateHoldingsPrices();
        updateScreenerResults();
    }, 3000); // Update every 3 seconds for demo
}

function updateWatchlistPrices() {
    const watchlistItems = document.querySelectorAll('.watchlist-item');
    
    watchlistItems.forEach((item, index) => {
        if (currentWatchlist[index]) {
            const stock = currentWatchlist[index];
            const priceElement = item.querySelector('.price-display');
            const changeElement = item.querySelector('.change-display');
            
            if (priceElement && changeElement) {
                // Simulate price change
                const oldPrice = stock.price;
                stock.price += (Math.random() - 0.5) * 2;
                stock.change = stock.price - oldPrice;
                stock.changePercent = (stock.change / oldPrice) * 100;
                
                priceElement.textContent = `$${stock.price.toFixed(2)}`;
                
                const changeClass = stock.change >= 0 ? 'price-positive' : 'price-negative';
                const changeSign = stock.change >= 0 ? '+' : '';
                changeElement.className = `text-sm ${changeClass} change-display`;
                changeElement.textContent = `${changeSign}${stock.change.toFixed(2)} (${changeSign}${stock.changePercent.toFixed(2)}%)`;
            }
        }
    });
}

function updateMarketCards() {
    const marketCards = document.querySelectorAll('.trading-card');
    
    marketCards.forEach(card => {
        const priceElement = card.querySelector('.text-2xl');
        const changeElements = card.querySelectorAll('.text-sm');
        
        if (priceElement && changeElements.length >= 2) {
            const currentPrice = parseFloat(priceElement.textContent.replace(/,/g, ''));
            const change = (Math.random() - 0.5) * 5;
            const newPrice = currentPrice + change;
            const changePercent = (change / currentPrice) * 100;
            
            priceElement.textContent = newPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            const changeClass = change >= 0 ? 'price-positive' : 'price-negative';
            const changeSign = change >= 0 ? '+' : '';
            
            changeElements[0].className = `text-sm ${changeClass}`;
            changeElements[0].textContent = `${changeSign}${changePercent.toFixed(2)}%`;
            changeElements[1].textContent = `${changeSign}${change.toFixed(2)}`;
        }
    });
}

function updateHoldingsPrices() {
    const holdingsRows = document.querySelectorAll('.holdings-row');
    
    holdingsRows.forEach((row, index) => {
        if (currentHoldings[index]) {
            const holding = currentHoldings[index];
            const priceElement = row.querySelector('.current-price-display');
            const marketValueElement = row.querySelector('.market-value-display');
            const pnlElement = row.querySelector('.pnl-display');
            
            if (priceElement && marketValueElement && pnlElement) {
                // Update price
                holding.currentPrice += (Math.random() - 0.5) * 2;
                priceElement.textContent = `$${holding.currentPrice.toFixed(2)}`;
                
                // Update market value
                const newMarketValue = holding.shares * holding.currentPrice;
                marketValueElement.textContent = `$${newMarketValue.toLocaleString()}`;
                
                // Update P&L
                holding.pnl = (holding.currentPrice - holding.avgCost) * holding.shares;
                const pnlClass = holding.pnl >= 0 ? 'price-positive' : 'price-negative';
                const pnlSign = holding.pnl >= 0 ? '+' : '';
                pnlElement.className = `py-3 px-4 text-right ${pnlClass} pnl-display`;
                pnlElement.textContent = `${pnlSign}$${holding.pnl.toLocaleString()}`;
            }
        }
    });
}

function updateScreenerResults() {
    const screenerRows = document.querySelectorAll('.stock-row');
    
    screenerRows.forEach((row, index) => {
        if (currentScreenerResults[index]) {
            const stock = currentScreenerResults[index];
            const priceElement = row.querySelector('.price-display');
            const changeElement = row.querySelector('.change-display');
            
            if (priceElement && changeElement) {
                // Update price
                stock.price += (Math.random() - 0.5) * 2;
                priceElement.textContent = `$${stock.price.toFixed(2)}`;
                
                // Update change
                stock.change = (Math.random() - 0.5) * 5;
                stock.changePercent = (stock.change / stock.price) * 100;
                
                const changeClass = stock.change >= 0 ? 'price-positive' : 'price-negative';
                const changeSign = stock.change >= 0 ? '+' : '';
                changeElement.className = `text-sm ${changeClass} change-display`;
                changeElement.textContent = `${changeSign}${stock.change.toFixed(2)} (${changeSign}${stock.changePercent.toFixed(2)}%)`;
            }
        }
    });
}

// Resize handler for charts
window.addEventListener('resize', () => {
    // Resize all charts
    Object.values(tradingChart || {}).forEach(chart => {
        if (chart && chart.resize) chart.resize();
    });
    
    Object.values(portfolioCharts).forEach(chart => {
        if (chart && chart.resize) chart.resize();
    });
    
    Object.values(analyticsCharts).forEach(chart => {
        if (chart && chart.resize) chart.resize();
    });
});

// Initialize tooltips and additional interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add tooltips to elements
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
});

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-50 tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
}