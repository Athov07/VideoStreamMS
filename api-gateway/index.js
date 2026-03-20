import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();

// 1. Global Middleware
app.use(helmet()); 
app.use(cors());   
app.use(morgan('dev')); 

// 2. Define Proxy Routes
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

//Future Video Service Proxy
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

// 3. Apply Proxies
// Any request starting with /api/auth goes to the Auth Microservice
app.use('/api/auth', authProxy);

// Any request starting with /api/videos goes to the Video Microservice
app.use('/api/videos', videoProxy);

// 4. Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'Gateway is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(` API Gateway running on http://localhost:${PORT}`);
});