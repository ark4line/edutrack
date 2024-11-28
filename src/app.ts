import express from 'express';
import lessonsRoutes from './domain/lessons/routes/lessons.route';

const app = express();

app.use(express.json());
app.use('/lessons', lessonsRoutes);

export default app;

