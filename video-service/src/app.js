import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import videoRoutes from './routes/video.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// app.use('/api/videos', videoRoutes);
app.use('/', videoRoutes);

app.use(errorMiddleware);

export default app;