const express = require('express');
const path = require('path');
const filesRouter = require('./src/routes/files');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
app.use('/upload', filesRouter);

app.get('/', (_req, res) => {
  res.json({
    message: 'Multer file upload API',
    endpoints: [
      'POST /upload/avatar',
      'POST /upload/documents',
      'POST /upload/profile',
      'POST /upload/image/process',
      'DELETE /upload/:folder/:filename'
    ]
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
