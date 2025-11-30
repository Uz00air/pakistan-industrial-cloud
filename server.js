const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Basic route - FIXED for Vercel
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🏭 Pakistani Industrial Cloud</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f0f8ff; }
            .container { max-width: 800px; margin: 0 auto; text-align: center; }
            .card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            .status { display: inline-block; padding: 10px 20px; background: #00b894; color: white; border-radius: 25px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <h1>🏭 Pakistani Industrial Cloud</h1>
                <p>Your factory monitoring system is <span class="status">RUNNING</span></p>
                <p>Server: Vercel</p>
                <p>Status: ✅ Deployed Successfully</p>
                <div style="margin-top: 20px;">
                    <a href="/dashboard" style="padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">📊 Go to Dashboard</a>
                    <a href="/health" style="padding: 10px 20px; background: #00b894; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">❤️ Health Check</a>
                </div>
            </div>
        </div>
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
    uptime: process.uptime()
  });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

// ESP8266 API endpoints
app.post('/api/connect', (req, res) => {
  const { machineId, factoryId } = req.body;
  
  console.log(`🏭 Factory connecting: ${factoryId}`);
  
  res.json({
    status: 'connected',
    message: '✅ Successfully connected to Vercel Cloud',
    machineId: machineId,
    server: 'Vercel',
    timestamp: Date.now()
  });
});

app.post('/api/data', (req, res) => {
  const { machineId, data } = req.body;
  
  console.log('📊 Received factory data');
  
  res.json({
    status: 'received',
    message: '✅ Data processed successfully',
    dataPoints: data ? Object.keys(data).length : 0,
    timestamp: Date.now()
  });
});

// Catch-all route for Vercel
app.get('*', (req, res) => {
  res.json({
    error: 'Route not found',
    available_routes: [
      'GET /',
      'GET /health', 
      'GET /dashboard',
      'POST /api/connect',
      'POST /api/data'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Pakistani Industrial Cloud running on port ${PORT}`);
  console.log(`📍 Server: Vercel`);
});
