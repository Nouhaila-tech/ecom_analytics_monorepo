import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI!;

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);


mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Failed to connect to MongoDB:', error));

app.listen(PORT, () => {
    console.log(`Server running successfully on http://localhost:${PORT}`);
})
