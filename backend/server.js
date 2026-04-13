require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');

const authRoutes = require('./routes/authRoutes.js')
const invoiceRoutes = require('./routes/invoiceRoutes.js')
const aiRoutes = require('./routes/aiRoutes.js')

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes Here
app.use('/api/auth', authRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/ai', aiRoutes)

// Start Server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on Port ${PORT}`));