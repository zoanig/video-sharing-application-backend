<div align="center">
  <h1>Video Sharing Application — Backend</h1>
  <p>A REST API for a video platform (uploads, playlists, comments, likes, subscriptions) built with <b>TypeScript, Express, and MongoDB</b>.</p>
  <p>
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
    <img alt="Node" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" />
    <img alt="Express" src="https://img.shields.io/badge/Express-5-black?logo=express&logoColor=white" />
    <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  </p>
</div>

## Overview

This service provides the backend for a YouTube‑style application. It implements authentication, media uploads, and social interactions while following a layered architecture and strict validation strategy.

Key characteristics:

* JWT authentication (access + refresh tokens)
* Role‑based authorization
* Cloud media storage (Cloudinary)
* Schema validation (Zod)
* Structured API responses and centralized error handling
* Modular controller/service separation

## Core Features

### Users

* Sign up and login
* Access and refresh tokens
* Watch history tracking
* Roles: `user`, `admin`

### Videos

* Upload video and thumbnail
* Update metadata
* Delete (owner or admin)
* View counting

### Social

* Comments and replies
* Likes on videos and comments
* Channel subscriptions

### Playlists

* Create and edit playlists
* Add/remove videos
* Private playlists

## Tech Stack

| Layer      | Technology     |
| ---------- | -------------- |
| Language   | TypeScript     |
| Runtime    | Node.js        |
| Framework  | Express 5      |
| Database   | MongoDB        |
| ODM        | Mongoose       |
| Auth       | JSON Web Token |
| Validation | Zod            |
| Uploads    | Multer         |
| Storage    | Cloudinary     |
| Security   | bcrypt         |

## Project Structure

```
src/
 ├── app.ts            Express configuration
 ├── index.ts          Entry point
 ├── db/               Database connection
 ├── models/           Mongoose schemas
 ├── routes/           API routes
 ├── controllers/      HTTP handlers
 ├── services/         Business logic
 ├── middlewares/      Auth, validation, uploads
 ├── validators/       Zod schemas
 ├── utils/            Errors, responses, cloud storage
 └── types/            TypeScript definitions
```

Request flow:

```
Client → Routes → Middleware → Controller → Service → Database/Cloudinary
```

## Setup

### Requirements

* Node.js 18+
* MongoDB (local or Atlas)
* Cloudinary account

### Installation

```bash
git clone https://github.com/zoanig/video-sharing-application-backend.git
cd video-sharing-application-backend
npm install
```

### Environment Variables

Create `.env` in the project root:
(This example is for local instance)

```env
PORT=6969

MONGODB_URI=mongodb://127.0.0.1:27017

ACCESS_TOKEN_SECRET=access_secret
REFRESH_TOKEN_SECRET=refresh_secret

CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
```

### Run

```bash
npm run dev
```

Build:

```bash
npm run build
```

Type‑check:

```bash
npm run check
```

Server: `http://localhost:6969`

## Authentication

Tokens are issued on login.

Include the access token in requests:

```
Authorization: Bearer <access_token>
```

When the access token expires, request a new one using the refresh token endpoint.

## API Summary

Here is your entire API structure rewritten uniformly as **lists**:

---

## User

* **POST** `/api/user/signup`
* **POST** `/api/user/login`
* **PUT** `/api/user/refresh`
* **PUT** `/api/user/profile`

## Video

* **POST** `/api/video/upload`
* **PUT** `/api/video/update/:Id`
* **GET** `/api/video/view/:Id`
* **DELETE** `/api/video/delete/:Id`

## Playlist

* **POST** `/api/playlist/create`
* **PUT** `/api/playlist/:Id`
* **DELETE** `/api/playlist/:Id`
* **GET** `/api/playlist/:Id`
* **GET** `/api/playlist/getall`

## Social

### Comments

* **POST** `/api/comment/:Id`
* **POST** `/api/comment/reply/:Id`
* **PUT** `/api/comment/:Id`
* **DELETE** `/api/comment/:Id`

### Likes

* **PUT** `/api/like/video/:Id`
* **DELETE** `/api/like/video/:Id`
* **PUT** `/api/like/comment/:Id`
* **DELETE** `/api/like/comment/:Id`

### Subscriptions

* **PUT** `/api/subscription/:Id`
* **DELETE** `/api/subscription/:Id`


## Uploads

Files are temporarily stored locally and then uploaded to Cloudinary.

Allowed types:

* image/jpeg
* image/png
* video/mp4
* video/mkv

## Response Format

Successful response:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {}
}
```

Error response:

```json
{
  "statusCode": 400,
  "message": "Validation Failed",
  "errors": []
}
```

## Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| npm run dev   | Start development server |
| npm run build | Compile or rather "transpile" TypeScript to JavaScript      |
| npm run check | Type checking            |

## License

MIT License


## Author

Muhammad Hassan
