# Проверка загрузки файлов

Откройте первый терминал в папке проекта и запустите сервер:

```bash
npm install
npm start
```

Оставьте сервер работающим. В другом терминале перейдите в папку проекта и выполните команды ниже.

## 1. Загрузка аватара

```bash
echo "fake image content" > test.jpg
curl -i -X POST http://localhost:3000/upload/avatar -F "avatar=@test.jpg;type=image/jpeg"
```

Ожидается HTTP `201 Created` и JSON с именем загруженного файла. Для проверки Multer фильтрует тип по MIME-заголовку; эта тестовая строка не является настоящим изображением.

## 2. Загрузка аватара с неправильным типом

```bash
echo "test" > test.txt
curl -i -X POST http://localhost:3000/upload/avatar -F "avatar=@test.txt;type=text/plain"
```

Ожидается HTTP `400 Bad Request`.

## 3. Загрузка нескольких документов

```bash
curl -i -X POST http://localhost:3000/upload/documents \
  -F "documents=@test.txt;type=text/plain" \
  -F "documents=@test.txt;type=text/plain"
```

Ожидается HTTP `201 Created` и список из двух файлов.

## 4. Загрузка профиля вместе с текстовыми полями

```bash
curl -i -X POST http://localhost:3000/upload/profile \
  -F "name=Alice" \
  -F "bio=Backend developer" \
  -F "avatar=@test.jpg;type=image/jpeg"
```

Ожидается HTTP `201 Created` и объект `profile` с полями `name`, `bio` и `avatar`.

## 5. Дополнительно: проверить корневой адрес

```bash
curl -i http://localhost:3000/
```

## Важно

Фильтрация по `file.mimetype` проверяет значение, переданное клиентом, и не подтверждает фактический формат содержимого. Для реального приложения нужно дополнительно проверять сигнатуру файла (magic bytes). Файлы сохраняются в `uploads/avatars` и `uploads/documents`.
