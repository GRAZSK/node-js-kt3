# Multer File Upload Lab

Express API for uploading avatar images and documents with Multer.

## Start

```bash
npm install
npm start
```

Server: `http://localhost:3000`

Test the upload endpoints using the commands in [task.md](task.md).

- `POST /upload/avatar` — one image, max 2 MB
- `POST /upload/documents` — up to five documents, max 10 MB each
- `POST /upload/profile` — profile text fields plus avatar/cover files
- `POST /upload/image/process` — image held in memory, max 5 MB
- `DELETE /upload/:folder/:filename` — delete an uploaded file from an allowed folder

The upload middleware returns HTTP 400 for rejected file types and Multer limit errors. MIME filtering is not sufficient for production security; validate file signatures as well.
# Лабораторная работа: Загрузка файлов с помощью Multer

API на базе Express для загрузки аватаров и документов с использованием библиотеки Multer.

## Начало работы

```bash
npm install
npm start
```

Сервер: `http://localhost:3000`

Для тестирования эндпоинтов загрузки воспользуйтесь командами из файла [task.md](task.md).

- `POST /upload/avatar` — одно изображение, макс. 2 МБ
- `POST /upload/documents` — до пяти документов, макс. 10 МБ каждый
- `POST /upload/profile` — текстовые поля профиля, а также файлы аватара/обложки
- `POST /upload/image/process` — изображение, обрабатываемое в оперативной памяти, макс. 5 МБ
- `DELETE /upload/:folder/:filename` — удаление загруженного файла из разрешенной папки

При отклонении типов файлов или превышении лимитов Multer, middleware для загрузки возвращает ошибку HTTP 400. Фильтрации по MIME-типу недостаточно для обеспечения безопасности в продакшн-среде — дополнительно проверяйте сигнатуры файлов.