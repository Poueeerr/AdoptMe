import express from 'express';
import userRoutes from './routes/userRoutes.js';
import 'dotenv/config';

import authMiddleware from './middlewares/authMiddleware.js';

import validateToken from './authToken.js'
import postRoutes from './routes/postRoutes.js'

import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

//app.use('/rota',authMiddleware, userRoutes);

app.use('/users', userRoutes);
app.use('/posts', postRoutes) //somente pra postar é protegido, postar e editar :O
app.use('/', validateToken);

export default app;
