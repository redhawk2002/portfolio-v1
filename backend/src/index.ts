import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRouter from './routes/contact';
import chatRouter from './routes/chat';
import sectionsRouter from './routes/sections';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRouter);
app.use('/api/chat', chatRouter);
app.use('/api/sections', sectionsRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running smoothly! 🚀' });
});

app.listen(PORT, () => {
  console.log(`Server is running beautifully on http://localhost:${PORT}`);
});
