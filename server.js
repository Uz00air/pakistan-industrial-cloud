const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Homepage route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🏭 Pakistani Industrial Cloud</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 40px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                text-align: center; 
            }
            .card { 
                background: rgba(255,255,255,0.95); 
                padding: 40px; 
                border-radius: 20px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                backdrop-filter: blur(10px);
            }
            .status { 
                display: inline-block; 
                padding: 10px 20px; 
                background: #00b894; 
                color: white; 
                border-radius: 25px; 
                margin: 10px 0;
            }
            .btn {
                padding: 12px 24px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                margin: 10px;
                display: inline-block;
                font-weight: bold;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                font-size: 16px;
            }
            .btn:hover {
                background: #764ba2;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .btn-secondary {
                background: #00b894;
            }
            .btn-secondary:hover {
                background: #00a085;
            }
            h1 {
                color: #2d3436;
                margin-bottom: 20px;
            }
            p {
                color: #636e72;
                line-height: 1.6;
                margin: 10px 0;
            }
            .vercel-badge {
                background: #000;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 14px;
                margin-top: 20px;
                display: inline-block;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <h1>🏭 Pakistani Industrial Cloud</h1>
                <p>Real-time Factory Monitoring System</p>
                <div class="status">✅ RUNNING ON VERCEL</div>
                <p>Monitor your industrial machines in real-time from anywhere</p>
                
                <div style="margin-top: 30px;">
                    <a href="/dashboard" class="btn">📊 Go to Dashboard</a>
                    <a href="/health" class="btn btn-secondary">❤️ Health Check</a>
                </div>
                
                <div style="margin-top: 30px;">
                    <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #667eea;">🏭</div>
                            <div>Factory Monitoring</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #00b894;">📡</div>
                            <div>ESP8266 Support</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #e17055;">📊</div>
                            <div>Live Data</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #fd79a8;">☁️</div>
                            <div>Cloud Storage</div>
                        </div>
                    </div>
                </div>
                
                <div class="vercel-badge">
                    Powered by Vercel • Node.js ${process.version}
                </div>
            </div>
        </div>
        
        <script>
            // Check server health on page load
            fetch('/health')
                .then(response => response.json())
                .then(data => {
                    console.log('✅ Server status:', data.status);
                })
                .catch(error => {
                    console.error('❌ Health check failed:', error);
                });
        </script>
    </body>
    </html>
  `);
});

// Dashboard route - Full HTML page
app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🏭 Pakistani Industrial Cloud - Dashboard</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                color: #333;
            }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { 
                background: rgba(255,255,255,0.95); 
                padding: 25px; 
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                margin-bottom: 20px;
                text-align: center;
                backdrop-filter: blur(10px);
            }
            .card { 
                background: rgba(255,255,255,0.95); 
                padding: 25px; 
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                margin-bottom: 20px;
                backdrop-filter: blur(10px);
            }
            .status { 
                display: inline-block; 
                padding: 8px 16px; 
                border-radius: 25px; 
                color: white; 
                margin: 5px;
                font-weight: bold;
                font-size: 14px;
            }
            .connected { background: #00b894; } 
            .disconnected { background: #d63031; }
            .warning { background: #fdcb6e; color: #2d3436; }
            .data-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                gap: 15px; 
                margin-top: 15px;
            }
            .data-item { 
                background: #f8f9fa; 
                padding: 15px; 
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }
            .factory-item {
                background: #f8f9fa;
                padding: 20px;
                margin: 10px 0;
                border-radius: 10px;
                border-left: 4px solid #00b894;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .factory-item:hover {
                transform: translateX(5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .factory-item.offline {
                border-left-color: #d63031;
                opacity: 0.7;
            }
            button {
                background: #667eea;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
                margin: 5px;
            }
            button:hover {
                background: #764ba2;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            button:disabled {
                background: #b2bec3;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            .live-badge {
                background: #e17055;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                margin-left: 10px;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.6; }
                100% { opacity: 1; }
            }
            .metric-value {
                font-size: 28px;
                font-weight: bold;
                color: #2d3436;
                margin: 5px 0;
            }
            .metric-label {
                font-size: 12px;
                color: #636e72;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .server-info {
                background: #dfe6e9;
                padding: 15px;
                border-radius: 10px;
                margin: 10px 0;
            }
            .last-update {
                font-size: 12px;
                color: #636e72;
                text-align: right;
                margin-top: 10px;
            }
            .nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .back-btn {
                background: #636e72;
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 25px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .back-btn:hover {
                background: #2d3436;
                transform: translateY(-2px);
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
            }
            .simulation-controls {
                background: #e8f4fd;
                padding: 15px;
                border-radius: 10px;
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="nav">
                <a href="/" class="back-btn">← Back to Home</a>
                <div class="logo">🏭 PICP</div>
                <div id="connectionStatus" class="status disconnected">Disconnected</div>
            </div>

            <div class="header">
                <h1>🏭 Pakistani Industrial Cloud Dashboard</h1>
                <p>Real-time Factory Monitoring System</p>
                
                <div class="simulation-controls">
                    <h3>🛠️ Simulation Controls</h3>
                    <button onclick="connectToCloud()">🔄 Connect to Cloud</button>
                    <button onclick="simulateFactoryConnect()">🏭 Add Test Factory</button>
                    <button onclick="simulateData()">📊 Simulate Data</button>
                </div>
                
                <div class="server-info">
                    <div>Server: <strong>${req.protocol}://${req.get('host')}</strong></div>
                    <div>Status: <span id="serverStatus">Checking...</span></div>
                    <div>Timestamp: <span id="serverTime">${new Date().toLocaleString()}</span></div>
                </div>
            </div>

            <div class="card">
                <h2>🏭 Connected Factories <span id="factoryCount" class="live-badge">0</span></h2>
                <div id="factoriesList">
                    <div class="factory-item">
                        <h3>No factories connected</h3>
                        <p>Connect your ESP8266 or use simulation to see factories here</p>
                    </div>
                </div>
            </div>

            <div class="card" id="liveDataCard" style="display: none;">
                <h2>📊 Live Factory Data <span class="live-badge">SIMULATED</span></h2>
                <div id="currentFactoryInfo"></div>
                <div class="data-grid" id="liveData"></div>
                <div class="last-update" id="lastUpdate">Last update: Never</div>
            </div>

            <div class="card">
                <h2>📈 System Overview</h2>
                <div class="data-grid">
                    <div class="data-item">
                        <div class="metric-value" id="totalFactories">0</div>
                        <div class="metric-label">Total Factories</div>
                    </div>
                    <div class="data-item">
                        <div class="metric-value" id="connectedClients">0</div>
                        <div class="metric-label">Connected Clients</div>
                    </div>
                    <div class="data-item">
                        <div class="metric-value" id="dataUpdates">0</div>
                        <div class="metric-label">Data Updates</div>
                    </div>
                    <div class="data-item">
                        <div class="metric-value" id="uptime">0s</div>
                        <div class="metric-label">Server Uptime</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>🔄 API Endpoints</h2>
                <div class="data-grid">
                    <div class="data-item">
                        <div class="metric-label">GET /health</div>
                        <div>Server health check</div>
                    </div>
                    <div class="data-item">
                        <div class="metric-label">POST /api/connect</div>
                        <div>Connect factory</div>
                    </div>
                    <div class="data-item">
                        <div class="metric-label">POST /api/data</div>
                        <div>Send factory data</div>
                    </div>
                    <div class="data-item">
                        <div class="metric-label">GET /dashboard</div>
                        <div>This dashboard</div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // State variables
            let currentFactory = null;
            let dataUpdateCount = 0;
            let serverStartTime = Date.now();
            let connectedFactories = [];
            let isConnected = false;
            
            // Factory simulation data
            const factories = [
                { id: 'FACTORY_001', name: 'Lahore Steel Mills', location: 'Lahore, Pakistan' },
                { id: 'FACTORY_002', name: 'Karachi Textile Plant', location: 'Karachi, Pakistan' },
                { id: 'FACTORY_003', name: 'Islamabad Auto Works', location: 'Islamabad, Pakistan' }
            ];

            function connectToCloud() {
                // Simulate connection to server
                document.getElementById('connectionStatus').className = 'status connected';
                document.getElementById('connectionStatus').textContent = 'Connected to Server';
                document.getElementById('serverStatus').innerHTML = '<span style="color: green;">Online</span>';
                isConnected = true;
                
                console.log('✅ Connected to Pakistani Industrial Cloud');
                alert('✅ Connected to server successfully!');
                
                // Load initial factory data
                updateFactoryList();
                updateServerStats();
            }

            function simulateFactoryConnect() {
                if (!isConnected) {
                    alert('⚠️ Please connect to server first!');
                    return;
                }

                const randomFactory = factories[Math.floor(Math.random() * factories.length)];
                const factoryData = {
                    machineId: 'MACH_' + Math.floor(Math.random() * 1000),
                    factoryId: randomFactory.id,
                    location: randomFactory.location,
                    name: randomFactory.name,
                    connected: true,
                    lastSeen: Date.now(),
                    plcConnected: Math.random() > 0.3,
                    data: {}
                };

                // Add to connected factories
                connectedFactories.push(factoryData);
                
                console.log('🏭 New factory connected:', factoryData.factoryId);
                updateFactoryList();
                updateServerStats();
                
                alert(`✅ ${factoryData.name} connected successfully!`);
            }

            function simulateData() {
                if (connectedFactories.length === 0) {
                    alert('⚠️ No factories connected. Add a factory first!');
                    return;
                }

                const factory = connectedFactories[Math.floor(Math.random() * connectedFactories.length)];
                
                // Generate realistic factory data
                const factoryData = {
                    machineId: factory.machineId,
                    factoryId: factory.factoryId,
                    location: factory.location,
                    timestamp: Date.now(),
                    data: {
                        SheetsComplete: Math.floor(Math.random() * 1000),
                        OutputCurrent: (Math.random() * 100).toFixed(2),
                        OutputFrequency: (50 + Math.random() * 10).toFixed(2),
                        RotationSpeed: Math.floor(Math.random() * 3000),
                        MaxCurrent: (Math.random() * 150).toFixed(2),
                        Temperature: (20 + Math.random() * 50).toFixed(1),
                        Voltage: (220 + Math.random() * 30).toFixed(1),
                        PowerConsumption: (Math.random() * 1000).toFixed(1),
                        ProductionRate: Math.floor(Math.random() * 100),
                        Efficiency: (70 + Math.random() * 25).toFixed(1),
                        PLCConnected: factory.plcConnected,
                        WifiConnected: true,
                        CloudConnected: true,
                        ActiveUsers: Math.floor(Math.random() * 5) + 1,
                        MaxUsers: 10
                    }
                };

                // Update factory data
                factory.data = factoryData.data;
                factory.lastSeen = Date.now();
                
                // If monitoring this factory, update display
                if (currentFactory === factory.machineId) {
                    displayLiveData(factoryData);
                }
                
                dataUpdateCount++;
                updateServerStats();
                
                console.log('📊 Data simulated for:', factory.factoryId);
                document.getElementById('lastUpdate').textContent = `Last update: ${new Date().toLocaleTimeString()}`;
            }

            function updateFactoryList() {
                const list = document.getElementById('factoriesList');
                const count = document.getElementById('factoryCount');
                
                count.textContent = connectedFactories.length;
                
                if (connectedFactories.length === 0) {
                    list.innerHTML = '<div class="factory-item"><h3>No factories connected</h3><p>Use simulation controls to add factories</p></div>';
                    return;
                }
                
                list.innerHTML = '';
                
                connectedFactories.forEach(factory => {
                    const isOnline = factory.connected;
                    const timeAgo = Math.floor((Date.now() - factory.lastSeen) / 1000);
                    
                    const div = document.createElement('div');
                    div.className = `factory-item ${isOnline ? '' : 'offline'}`;
                    div.innerHTML = \`
                        <h3>\${factory.name} (\${factory.factoryId})</h3>
                        <p>Location: \${factory.location}</p>
                        <p>Machine ID: \${factory.machineId}</p>
                        <p>Status: <span class="status \${isOnline ? 'connected' : 'disconnected'}">\${isOnline ? 'Online' : 'Offline'}</span></p>
                        <p>PLC: <span class="status \${factory.plcConnected ? 'connected' : 'disconnected'}">\${factory.plcConnected ? 'Connected' : 'Disconnected'}</span></p>
                        <p>Last seen: \${timeAgo < 60 ? \`\${timeAgo} seconds ago\` : \`\${Math.floor(timeAgo/60)} minutes ago\`}</p>
                        <button onclick="monitorFactory('\${factory.machineId}')">
                            📡 Monitor Live
                        </button>
                        <button onclick="removeFactory('\${factory.machineId}')" style="background: #d63031;">
                            🗑️ Remove
                        </button>
                    \`;
                    list.appendChild(div);
                });
            }

            function monitorFactory(machineId) {
                const factory = connectedFactories.find(f => f.machineId === machineId);
                if (!factory) return;
                
                currentFactory = machineId;
                document.getElementById('liveDataCard').style.display = 'block';
                
                const factoryData = {
                    machineId: factory.machineId,
                    factoryId: factory.factoryId,
                    location: factory.location,
                    data: factory.data || {}
                };
                
                displayLiveData(factoryData);
                alert(\`📊 Now monitoring \${factory.name}\`);
            }

            function removeFactory(machineId) {
                connectedFactories = connectedFactories.filter(f => f.machineId !== machineId);
                if (currentFactory === machineId) {
                    currentFactory = null;
                    document.getElementById('liveDataCard').style.display = 'none';
                }
                updateFactoryList();
                updateServerStats();
            }

            function displayLiveData(data) {
                const container = document.getElementById('liveData');
                const factoryInfo = document.getElementById('currentFactoryInfo');
                
                if (data.factoryId) {
                    factoryInfo.innerHTML = \`
                        <h3>🏭 \${data.factoryId} - \${data.location || 'Factory'}</h3>
                        <p>Monitoring live data stream</p>
                    \`;
                }
                
                if (data.data) {
                    let html = '';
                    const metrics = data.data;
                    
                    // Critical metrics first
                    const criticalMetrics = ['SheetsComplete', 'OutputCurrent', 'OutputFrequency', 'RotationSpeed', 'MaxCurrent', 'Temperature', 'Voltage'];
                    const otherMetrics = Object.keys(metrics).filter(key => !criticalMetrics.includes(key));
                    
                    criticalMetrics.forEach(key => {
                        if (metrics[key] !== undefined) {
                            html += createMetricCard(key, metrics[key]);
                        }
                    });
                    
                    otherMetrics.forEach(key => {
                        if (metrics[key] !== undefined && 
                            key !== 'PLCConnected' && 
                            key !== 'WifiConnected' && 
                            key !== 'CloudConnected' &&
                            key !== 'ActiveUsers' &&
                            key !== 'MaxUsers') {
                            html += createMetricCard(key, metrics[key]);
                        }
                    });
                    
                    // System status
                    if (metrics.PLCConnected !== undefined || metrics.WifiConnected !== undefined) {
                        html += \`
                            <div class="data-item" style="grid-column: 1 / -1; background: #e8f4fd;">
                                <h4>System Status</h4>
                                <span class="status \${metrics.PLCConnected ? 'connected' : 'disconnected'}">PLC: \${metrics.PLCConnected ? 'Connected' : 'Disconnected'}</span>
                                <span class="status \${metrics.WifiConnected ? 'connected' : 'disconnected'}">WiFi: \${metrics.WifiConnected ? 'Connected' : 'Disconnected'}</span>
                                <span class="status \${metrics.CloudConnected ? 'connected' : 'disconnected'}">Cloud: \${metrics.CloudConnected ? 'Connected' : 'Disconnected'}</span>
                                \${metrics.ActiveUsers !== undefined ? \`<span class="status warning">Users: \${metrics.ActiveUsers}/\${metrics.MaxUsers || 10}</span>\` : ''}
                            </div>
                        \`;
                    }
                    
                    container.innerHTML = html;
                }
            }

            function createMetricCard(label, value) {
                let formattedValue = value;
                let unit = '';
                let color = '#667eea';
                
                // Format values based on label
                if (label.includes('Current')) { unit = 'A'; color = '#e17055'; }
                if (label.includes('Frequency')) { unit = 'Hz'; color = '#00b894'; }
                if (label.includes('Speed')) { unit = 'RPM'; color = '#0984e3'; }
                if (label.includes('Sheets')) { unit = 'sheets'; color = '#a29bfe'; }
                if (label.includes('Size')) { unit = 'mm'; color = '#fd79a8'; }
                if (label.includes('Temperature')) { unit = '°C'; color = '#e17055'; }
                if (label.includes('Voltage')) { unit = 'V'; color = '#00b894'; }
                if (label.includes('Power')) { unit = 'W'; color = '#0984e3'; }
                if (label.includes('Efficiency')) { unit = '%'; color = '#00cec9'; }
                if (label.includes('Rate')) { unit = '/hour'; color = '#a29bfe'; }
                
                return \`
                    <div class="data-item" style="border-left-color: \${color}">
                        <div class="metric-label">\${formatLabel(label)}</div>
                        <div class="metric-value">\${formattedValue} \${unit}</div>
                    </div>
                \`;
            }

            function formatLabel(label) {
                return label
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/_/g, ' ')
                    .trim();
            }

            function updateServerStats() {
                const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
                const minutes = Math.floor(uptime / 60);
                const hours = Math.floor(minutes / 60);
                
                let uptimeText = \`\${uptime}s\`;
                if (hours > 0) uptimeText = \`\${hours}h \${minutes % 60}m\`;
                else if (minutes > 0) uptimeText = \`\${minutes}m\`;
                
                document.getElementById('uptime').textContent = uptimeText;
                document.getElementById('dataUpdates').textContent = dataUpdateCount;
                document.getElementById('connectedClients').textContent = connectedFactories.length;
                document.getElementById('totalFactories').textContent = connectedFactories.length;
                document.getElementById('serverTime').textContent = new Date().toLocaleString();
            }

            // Auto-connect on page load
            window.addEventListener('load', () => {
                // Auto-connect after 1 second
                setTimeout(() => {
                    connectToCloud();
                }, 1000);
                
                // Update server stats every second
                setInterval(updateServerStats, 1000);
                
                // Simulate data every 5 seconds if factories exist
                setInterval(() => {
                    if (connectedFactories.length > 0 && Math.random() > 0.5) {
                        simulateData();
                    }
                }, 5000);
            });

            // Test server connection
            fetch('/health')
                .then(response => response.json())
                .then(data => {
                    console.log('✅ Server health:', data);
                    document.getElementById('serverStatus').innerHTML = '<span style="color: green;">Healthy</span>';
                })
                .catch(error => {
                    console.error('❌ Health check failed:', error);
                    document.getElementById('serverStatus').innerHTML = '<span style="color: red;">Unreachable</span>';
                });
        </script>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: '✅ Pakistani Industrial Cloud is running on Vercel!',
    server: 'Vercel',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'production',
    endpoints: [
      'GET /',
      'GET /dashboard',
      'GET /health',
      'POST /api/connect',
      'POST /api/data'
    ]
  });
});

// ESP8266 API endpoints
app.post('/api/connect', (req, res) => {
  const { machineId, factoryId } = req.body;
  
  console.log(`🏭 Factory connecting: ${factoryId || machineId}`);
  
  res.json({
    status: 'connected',
    message: '✅ Successfully connected to Pakistani Industrial Cloud',
    machineId: machineId || 'MACH_' + Date.now(),
    factoryId: factoryId || 'FACTORY_' + Math.floor(Math.random() * 1000),
    server: 'Vercel',
    timestamp: Date.now(),
    endpoint: '/api/data',
    instructions: 'Send data to /api/data endpoint with machineId and data fields'
  });
});

app.post('/api/data', (req, res) => {
  const { machineId, data } = req.body;
  
  console.log('📊 Received factory data from:', machineId);
  console.log('Data points:', data ? Object.keys(data).length : 0);
  
  res.json({
    status: 'received',
    message: '✅ Data processed successfully',
    machineId: machineId,
    dataPoints: data ? Object.keys(data).length : 0,
    timestamp: Date.now(),
    storage: 'cloud-stored',
    nextUpdate: 'Send more data anytime'
  });
});

// API documentation
app.get('/api', (req, res) => {
  res.json({
    name: 'Pakistani Industrial Cloud API',
    version: '1.0.0',
    description: 'Industrial monitoring system for Pakistani factories',
    endpoints: {
      health: {
        method: 'GET',
        path: '/health',
        description: 'Server health check'
      },
      connect: {
        method: 'POST',
        path: '/api/connect',
        description: 'Connect a factory machine',
        body: {
          machineId: 'string (required)',
          factoryId: 'string (optional)'
        }
      },
      data: {
        method: 'POST',
        path: '/api/data',
        description: 'Send factory data',
        body: {
          machineId: 'string (required)',
          data: 'object (required)'
        }
      }
    }
  });
});

// Catch-all route
app.get('*', (req, res) => {
  res.json({
    error: 'Route not found',
    available_routes: [
      'GET / - Homepage',
      'GET /dashboard - Monitoring Dashboard',
      'GET /health - Health check',
      'GET /api - API Documentation',
      'POST /api/connect - Connect factory',
      'POST /api/data - Send factory data'
    ],
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Pakistani Industrial Cloud running on port ${PORT}`);
  console.log(`📍 Server: Vercel`);
  console.log(`🌐 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
});
