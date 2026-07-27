

# url-list-checking-service-backend
Это бэкенд сервиса по проверке URL. Фронтенд можно найти здесь ([repo](https://github.com/small-lizard/url-list-checking-service)).

## Стек

**Backend:**  Nest.js, Node.js, TypeScript, Docker

**Deployment:** Render

## Запуск
  
Для запуска локально:

1. Скопировать репозиторий

```bash
git clone https://github.com/small-lizard/url-list-checking-service-backend
cd url-list-checking-service-backend
```

2. Установить зависимости

```bash
npm install
```

3. Запустить

```bash
npm run env:dev
```

5. Запустить

```bash
npm run start:dev
```

## API Endpoints

```text
POST           /api/jobs                создание новой задачи с фоновой проверкой URLs
GET            /api/jobs                получение всех задач
GET            /api/jobs/:id            получение детальной информации по активной задаче
DELETE         /api/jobs/:id            остановка проверки URLs
```
