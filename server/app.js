import express from 'express';
import userRoutes from './routes/userRoutes.js';
import 'dotenv/config';
import validateToken from './authToken.js'
import postRoutes from './routes/postRoutes.js'

import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

//app.use('/rota',authMiddleware, userRoutes);

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
//Preciso fazer o editar e o delete de ambos posts e funcionarios
app.use('/', validateToken);

export default app;
