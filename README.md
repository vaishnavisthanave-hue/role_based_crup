# Role-Based CRUD API

A Node.js REST API built with Express, Sequelize, MySQL, and JWT authentication. It supports role-based authorization, permission management, business management, file uploads, and Swagger API documentation.

## Features

- User Registration
- User Login with JWT Authentication
- Role-Based Authorization
- Permission Management
- Business CRUD Operations
- Image/Video Uploads using Multer
- Swagger API Documentation
- MySQL Database with Sequelize ORM

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- Multer
- Swagger (OpenAPI)

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd role_based_crud
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
APP_NAME=NodeBackend
NODE_ENV=development

PORT=3000
API_URL=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=crud
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret
```

---

## Database Setup

Create the database:

```sql
CREATE DATABASE crud;
```

Run migrations:

```bash
npx sequelize-cli db:migrate
```

Run seeders:

```bash
npx sequelize-cli db:seed:all
```

---

## Run the Project

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs on:

```
http://localhost:3000
```

---

## Swagger Documentation

Open:

```
http://localhost:3000/api-docs
```

---

## Project Structure

```
.
├── src
│   ├── controllers
│   ├── middleware
│   ├── migrations
│   ├── models
│   ├── routes
│   ├── seeders
│   └── uploads
├── app.js
├── swagger.js
├── package.json
└── README.md
```

---

## Authentication

Login returns a JWT token.

Include it in every protected request:

```
Authorization: Bearer <your_token>
```

---

## Available APIs

### Authentication

- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/create-user`
- POST `/auth/assign-permission`

### Users

- GET `/user/vendors`

### Business

- POST `/business`
- GET `/business`
- GET `/business/mybusiness`
- GET `/business/:id`
- PUT `/business/:id`

---

## License

This project is for learning and development purposes.