import express from 'express';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import validateToken from './authToken.js';
import locationRoutes from './routes/locationRoutes.js'
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); //https://frontend-adopt.vercel.app

app.use('/uploads', express.static('uploads'));
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/locations', locationRoutes)
app.use('/', validateToken);

export default app;
