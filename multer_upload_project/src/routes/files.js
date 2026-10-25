const { Router } = require('express');
const fs = require('fs/promises');
const path = require('path');
const { uploadAvatar, uploadDocuments, uploadToMemory } = require('../middleware/upload');

const router = Router();
const uploadRoot = path.resolve(__dirname, '../../uploads');

function uploadWithErrorHandling(middleware) {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (!err) return next();
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Файл слишком большой' });
      if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ error: 'Превышено максимальное количество файлов' });
      if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ error: 'Неожиданное поле файла или слишком много файлов' });
      return res.status(400).json({ error: err.message || 'Ошибка загрузки файла' });
    });
  };
}

// POST /upload/avatar — загрузить один аватар
router.post('/avatar', uploadWithErrorHandling(uploadAvatar.single('avatar')), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  res.status(201).json({
    message: 'Аватар загружен',
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/avatars/${req.file.filename}`
    }
  });
});

// POST /upload/documents — загрузить до пяти документов
router.post('/documents', uploadWithErrorHandling(uploadDocuments.array('documents', 5)), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'Файлы не загружены' });
  const files = req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    url: `/uploads/documents/${file.filename}`
  }));
  res.status(201).json({ message: `Загружено файлов: ${files.length}`, files });
});

// POST /upload/profile — текстовые поля и файлы вместе
router.post('/profile', uploadWithErrorHandling(uploadAvatar.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
])), (req, res) => {
  const { name, bio } = req.body;
  const avatar = req.files?.avatar?.[0];
  const cover = req.files?.cover?.[0];
  if (!name) return res.status(400).json({ error: 'Поле name обязательно' });
  res.status(201).json({
    message: 'Профиль обновлён',
    profile: {
      name,
      bio: bio || '',
      avatar: avatar ? `/uploads/avatars/${avatar.filename}` : null,
      cover: cover ? `/uploads/avatars/${cover.filename}` : null
    }
  });
});

// POST /upload/image/process — получить изображение в памяти, без записи на диск
router.post('/image/process', uploadWithErrorHandling(uploadToMemory.single('image')), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  const base64 = req.file.buffer.toString('base64');
  res.json({
    message: 'Файл получен в памяти',
    size: req.file.size,
    preview: `data:${req.file.mimetype};base64,${base64.slice(0, 50)}...`
  });
});

// DELETE /upload/:folder/:filename — удалить загруженный файл
router.delete('/:folder/:filename', async (req, res, next) => {
  const { folder, filename } = req.params;
  if (!['avatars', 'documents'].includes(folder)) {
    return res.status(400).json({ error: 'Недопустимая папка' });
  }
  const safeName = path.basename(filename);
  const filePath = path.join(uploadRoot, folder, safeName);
  try {
    await fs.unlink(filePath);
    return res.json({ message: 'Файл удалён' });
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ error: 'Файл не найден' });
    return next(err);
  }
});

module.exports = router;
