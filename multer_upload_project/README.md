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
