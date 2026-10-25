const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const root = path.resolve(__dirname, '../../uploads');
const uploadDirs = ['avatars', 'documents', 'temp'];
for (const dir of uploadDirs) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(root, 'avatars')),
  filename: (_req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const documentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(root, 'documents')),
  filename: (_req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${crypto.randomUUID()}_${safeName}`);
  }
});

const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  return cb(new Error('Разрешены только изображения: JPEG, PNG, WebP, GIF'));
};

const documentFilter = (_req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv'
  ];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  return cb(new Error('Разрешены только документы: PDF, DOC, DOCX, TXT, CSV'));
};

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }
});

const uploadDocuments = multer({
  storage: documentStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }
});

const uploadToMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }
});

module.exports = { uploadAvatar, uploadDocuments, uploadToMemory };
