const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected factories and clients
const factories = new Map();
const remoteClients = new Map();

app.use(express.json());
app.use(express.static('public'));

// CORS for ESP8266
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    server: 'Pakistani Industrial Cloud - Render',
    timestamp: Date.now(),
    factories: factories.size,
    clients: remoteClients.size,
    uptime: process.uptime(),
    message: 'Server is running successfully!'
  });
});

// ESP8266 connection endpoint
app.post('/api/connect', (req, res) => {
  try {
    const { machineId, factoryId, location, localIp } = req.body;
    
    console.log(`🏭 Factory connecting: ${factoryId} - ${location}`);
    
    if (!machineId || !factoryId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['machineId', 'factoryId'] 
      });
    }
    
    factories.set(machineId, {
      machineId, 
      factoryId, 
      location: location || 'Unknown Location',
      localIp: localIp || 'Unknown IP',
      lastData: { initial: 'connected' },
      lastSeen: Date.now(),
      connected: true,
      connectionTime: Date.now()
    });
    
    // Notify all remote clients
    broadcastToRemoteClients({
      type: 'factory_connected',
      factory: { 
        machineId, 
        factoryId, 
        location: location || 'Unknown Location',
        localIp: localIp || 'Unknown IP'
      },
      timestamp: Date.now()
    });
    
    res.json({ 
      status: 'connected', 
      message: 'Successfully connected to Pakistani Industrial Cloud',
      server: 'Render.com',
      timestamp: Date.now(),
      machineId: machineId
    });
    
  } catch (error) {
    console.error('❌ Connection error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// ESP8266 data endpoint
app.post('/api/data', (req, res) => {
  try {
    const { machineId, factoryId, timestamp, data, plcConnected } = req.body;
    
    console.log(`📊 Data received from: ${factoryId || 'Unknown Factory'}`);
    
    if (!machineId) {
      return res.status(400).json({ error: 'Missing machineId' });
    }
    
    if (!factories.has(machineId)) {
      // Auto-register factory if not exists
      factories.set(machineId, {
        machineId,
        factoryId: factoryId || 'Unknown Factory',
        location: 'Auto-registered',
        localIp: 'Unknown',
        lastData: null,
        lastSeen: Date.now(),
        connected: true,
        connectionTime: Date.now()
      });
    }
    
    const factory = factories.get(machineId);
    factory.lastData = data || { received: true };
    factory.lastSeen = Date.now();
    factory.timestamp = timestamp || Date.now();
    factory.plcConnected = plcConnected || false;
    factory.factoryId = factoryId || factory.factoryId;
    
    // Broadcast to all remote clients
    broadcastToRemoteClients({
      type: 'realtime_data',
      machineId,
      factoryId: factory.factoryId,
      location: factory.location,
      timestamp: factory.timestamp,
      data: factory.lastData,
      plcConnected: factory.plcConnected
    });
    
    res.json({ 
      status: 'received', 
      message: 'Data processed successfully',
      timestamp: Date.now(),
      dataPoints: factory.lastData ? Object.keys(factory.lastData).length : 0
    });
    
  } catch (error) {
    console.error('❌ Data processing error:', error);
    res.status(500).json({ 
      error: 'Data processing failed',
      message: error.message 
    });
  }
});

// Get list of connected factories
app.get('/api/factories', (req, res) => {
  try {
    const factoryList = Array.from(factories.values()).map(factory => ({
      machineId: factory.machineId,
      factoryId: factory.factoryId,
      location: factory.location,
      localIp: factory.localIp,
      lastSeen: factory.lastSeen,
      connected: (Date.now() - factory.lastSeen) < 120000,
      hasData: factory.lastData !== null,
      plcConnected: factory.plcConnected || false,
      connectionTime: factory.connectionTime
    }));
    
    res.json({ 
      success: true,
      factories: factoryList,
      total: factoryList.length,
      serverTime: Date.now(),
      message: `${factoryList.length} factories found`
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch factories',
      message: error.message 
    });
  }
});

// Serve dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const clientId = generateClientId();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  remoteClients.set(clientId, ws);
  
  console.log(`🌐 Remote client connected: ${clientId} from ${clientIp}`);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    clientId: clientId,
    message: 'Connected to Pakistani Industrial Cloud - Powered by Render',
    serverTime: Date.now(),
    connectedFactories: Array.from(factories.values()).filter(f => (Date.now() - f.lastSeen) < 120000).length,
    version: '1.0.0'
  }));
  
  // Send current factory list
  sendFactoryListToClient(ws);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      handleClientMessage(clientId, data, ws);
    } catch (error) {
      console.error('❌ WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });
  
  ws.on('close', () => {
    remoteClients.delete(clientId);
    console.log(`🌐 Remote client disconnected: ${clientId}`);
  });
  
  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for ${clientId}:`, error);
    remoteClients.delete(clientId);
  });
});

function handleClientMessage(clientId, data, ws) {
  switch (data.type) {
    case 'subscribe':
      if (factories.has(data.machineId)) {
        const factory = factories.get(data.machineId);
        
        ws.send(JSON.stringify({
          type: 'subscribed',
          machineId: data.machineId,
          factoryId: factory.factoryId,
          location: factory.location,
          lastData: factory.lastData,
          timestamp: factory.timestamp,
          message: `Now monitoring ${factory.factoryId}`
        }));
        
        console.log(`📡 Client ${clientId} subscribed to ${factory.factoryId}`);
      } else {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Factory not found. Use /api/factories to see available factories.'
        }));
      }
      break;
      
    case 'ping':
      ws.send(JSON.stringify({
        type: 'pong',
        timestamp: Date.now(),
        clientId: clientId
      }));
      break;
      
    case 'get_factories':
      sendFactoryListToClient(ws);
      break;
  }
}

function sendFactoryListToClient(ws) {
  const activeFactories = Array.from(factories.values())
    .filter(factory => (Date.now() - factory.lastSeen) < 120000)
    .map(factory => ({
      machineId: factory.machineId,
      factoryId: factory.factoryId,
      location: factory.location,
      lastSeen: factory.lastSeen,
      hasData: factory.lastData !== null,
      plcConnected: factory.plcConnected || false
    }));
  
  ws.send(JSON.stringify({
    type: 'factory_list',
    factories: activeFactories,
    total: activeFactories.length,
    serverTime: Date.now()
  }));
}

function broadcastToRemoteClients(data) {
  let sentCount = 0;
  remoteClients.forEach((ws, clientId) => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(data));
        sentCount++;
      } catch (error) {
        console.error(`❌ Broadcast error to ${clientId}:`, error);
        remoteClients.delete(clientId);
      }
    }
  });
  
  if (data.type === 'realtime_data' && sentCount > 0) {
    console.log(`📤 Broadcasted data to ${sentCount} clients`);
  }
}

function generateClientId() {
  return 'client_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Cleanup disconnected factories every minute
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  factories.forEach((factory, machineId) => {
    if (now - factory.lastSeen > 300000) { // 5 minutes
      console.log(`🧹 Cleaning disconnected factory: ${factory.factoryId}`);
      factories.delete(machineId);
      cleanedCount++;
      
      broadcastToRemoteClients({
        type: 'factory_disconnected',
        machineId: machineId,
        factoryId: factory.factoryId,
        timestamp: Date.now()
      });
    }
  });
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} disconnected factories`);
  }
}, 60000);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Pakistani Industrial Cloud Server Started!
📍 Port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
🏭 Ready for ESP8266 factories and remote clients
💡 Health: http://localhost:${PORT}/health
📊 Dashboard: http://localhost:${PORT}/
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});