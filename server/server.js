// =====================================================================
// server.js — Main Express Application
// =====================================================================
//
// Yeh poore backend ki starting point hai.
// Yahan sab cheezein jama hoti hain:
// 1. Environment variables load karo
// 2. MongoDB se connect karo
// 3. Express app banao
// 4. Middleware (CORS, JSON parser) lagao
// 5. Routes register karo
// 6. Server shuru karo
//
// REQUEST FLOW:
// Browser → server.js → Route → Controller → Model → MongoDB
// MongoDB → Model → Controller → Route → server.js → Browser
// =====================================================================

// Step 1: dotenv load karo — SABSE PEHLE!
// Yeh .env file se values padhta hai aur process.env mein dalta hai
// Agar yeh baad mein aaye toh process.env.MONGODB_URI undefined hoga!
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import groupRoutes from './routes/groupRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

// Step 2: MongoDB se connect karo
// Yeh async hai — connection hone tak wait karo
connectDB();

// Step 3: Express app banao
// express() ek application object return karta hai
// Isi object par hum sab middleware aur routes lagate hain
const app = express();

// ---------------------------------------------------------------
// Step 4: Middleware
// ---------------------------------------------------------------
// Middleware = woh functions jo request aur response ke beech mein chalte hain
// Request aai → Middleware 1 → Middleware 2 → Route Handler → Response

// CORS Middleware
// CORS = Cross-Origin Resource Sharing
// Browser security rule: ek website doosri website ka data directly nahi le sakti
// React localhost:5173 → Express localhost:5000 = DIFFERENT origins!
// Isliye hum CORS configure karte hain taake React ko allow kiya jaye
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// JSON Parser Middleware
// Jab React POST request mein JSON data bhejta hai:
// { "title": "Dinner", "amount": 1000 }
// Toh express.json() us JSON string ko JavaScript object mein convert karta hai
// Iske baad req.body mein woh data available hota hai
app.use(express.json());

// URL-encoded data parser (form data ke liye)
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------
// Step 5: Routes Register Karo
// ---------------------------------------------------------------
// app.use('/api/groups', groupRoutes) ka matlab:
// "/api/groups" se start hone wali sab requests groupRoutes ko bhejo

// Health Check — Sirf check karne ke liye ke server chal raha hai
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Smart Expense Splitter Backend chal raha hai!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Groups API
app.use('/api/groups', groupRoutes);

// Expenses API
app.use('/api/expenses', expenseRoutes);

// ---------------------------------------------------------------
// 404 Handler — Agar koi bhi route match nahi hua
// ---------------------------------------------------------------
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `❌ Route nahi mila: ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET  /api/health',
      'GET  /api/groups',
      'POST /api/groups',
      'GET  /api/groups/:id',
      'PUT  /api/groups/:id',
      'DELETE /api/groups/:id',
      'GET  /api/expenses',
      'POST /api/expenses',
      'GET  /api/expenses/summary',
      'GET  /api/expenses/:id',
      'PUT  /api/expenses/:id',
      'DELETE /api/expenses/:id'
    ]
  });
});

// ---------------------------------------------------------------
// Global Error Handler
// ---------------------------------------------------------------
// Agar kisi bhi route ya middleware mein next(error) call ho
// toh yeh handler pakad lega
app.use((error, req, res, next) => {
  console.error('🔴 Error:', error.message);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Server mein kuch masla aa gaya'
  });
});

// ---------------------------------------------------------------
// Step 6: Server Shuru Karo
// ---------------------------------------------------------------
// process.env.PORT = .env se aata hai (5000)
// || 5000 = agar PORT nahi mila toh default 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ================================');
  console.log(`✅ Server chal raha hai: http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Groups API: http://localhost:${PORT}/api/groups`);
  console.log(`💸 Expenses API: http://localhost:${PORT}/api/expenses`);
  console.log('🚀 ================================');
  console.log('');
});
