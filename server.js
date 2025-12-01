const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Remove this line if you're not using public directory:
// app.use(express.static('public'));

// Homepage route
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

// Dashboard route - serve the full HTML directly
app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🏭 Pakistani Industrial Cloud - Dashboard</title>
        <style>
            /* Paste your full CSS here */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                color: #333;
            }
            /* ... rest of your CSS ... */
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Paste your full HTML body here -->
            <div class="header">
                <h1>🏭 Pakistani Industrial Cloud</h1>
                <!-- ... rest of your HTML ... -->
            </div>
        </div>

        <script>
            // Paste your full JavaScript here
            let ws = null;
            let currentFactory = null;
            // ... rest of your JavaScript ...
        </script>
    </body>
    </html>
  `);
});

// Keep the rest of your routes as they are...
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: '✅ Pakistani Industrial Cloud is running on Vercel!',
    server: 'Vercel',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ... rest of your routes ...

app.listen(PORT, () => {
  console.log(`✅ Pakistani Industrial Cloud running on port ${PORT}`);
});
