import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';


const app = express();

// 1. Global Middleware
app.use(helmet()); 
app.use(cors());   
app.use(morgan('dev')); 

// auth Proxy Routes
const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '', // Strips '/api/auth'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Forwarding ${req.method} ${req.url} -> ${process.env.AUTH_SERVICE_URL}${proxyReq.path}`);
  }
});

// Video Service Proxy
const videoProxy = createProxyMiddleware({
  target: process.env.VIDEO_SERVICE_URL, // http://localhost:5500
  changeOrigin: true,
  pathRewrite: {
    '^/api/videos': '', 
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err.message);
    res.status(502).json({ 
        message: 'Video Service is unreachable. Make sure it is running on port 5500.',
        error: err.message 
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Forwarding ${req.method} ${req.url} -> ${process.env.VIDEO_SERVICE_URL}${proxyReq.path}`);
  }
});

// Define Profile Service Proxy
const profileProxy = createProxyMiddleware({
  target: process.env.PROFILE_SERVICE_URL, //http://localhost:6000
  changeOrigin: true,
  pathRewrite: {
    '^/api/profile': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway]: Forwarding ${req.method} ${req.url} -> Profile Service`);
  }
});

// Apply Proxy

app.use('/api/auth', authProxy);

app.use('/api/videos', videoProxy);

app.use('/api/profile', profileProxy);

// 4. Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'Gateway is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(` API Gateway running on http://localhost:${PORT}`);
});