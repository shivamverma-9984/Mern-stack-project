import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import companyRoutes from './routes/company.routes.js';
import reviewRoutes from './routes/review.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Company Review Server is active' });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`📡 Server running on port ${PORT}`);
  });
};

startServer();
