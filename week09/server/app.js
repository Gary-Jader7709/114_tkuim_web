import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { router as signupRouter } from './routes/signup.js';

config();

const app = express();
const PORT = process.env.PORT || 3001;

// 啟用 CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN?.split(',') ?? '*'
}));

// 解析 JSON body
app.use(express.json());

// 掛上 signup router
app.use('/api/signup', signupRouter);

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 500 統一錯誤處理
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
