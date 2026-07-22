# Flashcard Learning Application - Backend

A modern Node.js/Express REST API backend for a flashcard learning application with MongoDB integration. This server handles user authentication, deck management, and flashcard operations.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Database Structure](#database-structure)
- [Authentication Flow](#authentication-flow)
- [Architecture Overview](#architecture-overview)
- [Security Considerations](#security-considerations)

## Features

- User authentication with secure cookie-based sessions
- User registration with recovery code system
- Deck creation, retrieval, updating, and deletion
- Flashcard management with multiple choice options
- Card difficulty categorization (easy, medium, hard)
- Rate limiting on sensitive endpoints
- CORS support for frontend integration
- MongoDB aggregation for efficient data retrieval
- Comprehensive input validation
- Error handling with specific HTTP status codes

## Technologies

| Technology         | Version     | Purpose                 |
| ------------------ | ----------- | ----------------------- |
| Node.js            | Latest      | JavaScript runtime      |
| Express            | 5.2.1       | Web framework           |
| MongoDB            | Cloud Atlas | NoSQL database          |
| Mongoose           | 9.6.2       | MongoDB ODM             |
| JWT/Cookies        | -           | Authentication          |
| Express Rate Limit | 8.5.2       | Rate limiting           |
| CORS               | 2.8.6       | Cross-origin requests   |
| Cookie Parser      | 1.4.7       | Cookie handling         |
| Nodemon            | 3.1.14      | Development auto-reload |

## Folder Structure

```
backend/
├── server.js                 # Express server setup & routes
├── package.json             # Dependencies & scripts
├── .env                     # Environment variables (not in repo)
├── middlewares/
│   └── Auth.js             # Authentication middleware
├── models/
│   ├── User.js             # User schema & model
│   ├── Deck.js             # Deck schema & model
│   └── Card.js             # Card schema & model
└── routes/
    ├── users.js            # Auth endpoints (register, login, logout, info, recover)
    ├── decks.js            # Deck management endpoints
    └── cards.js            # Card management endpoints
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create .env file**

```bash
cp .env.example .env
```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection URL
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/databasename?appName=learning-cluster

# Server Port
PORT=8909

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Variable Descriptions

| Variable       | Description                      | Example                                              |
| -------------- | -------------------------------- | ---------------------------------------------------- |
| `MONGODB_URL`  | MongoDB Atlas connection string  | `mongodb+srv://user:pass@cluster.xxx.mongodb.net/db` |
| `PORT`         | Server port number               | `8909`                                               |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:5173` or `https://yourdomain.com`  |

### Getting MongoDB URL

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with credentials
3. Get connection string: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?appName=<appname>`

## Running Locally

### Development Mode

```bash
npm run dev
```

Starts server with Nodemon for auto-reloading on file changes.
Server runs on: `http://localhost:8909` (or configured PORT)

### Production Mode

```bash
node server.js
```

Direct Node.js execution without auto-reload.

## API Documentation

### Authentication Routes

#### Register User

```http
POST /register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePass123",
  "recoveryCode": "1234"
}

Response (201 Created):
{
  "username": "john_doe",
  "createdAt": "2026-06-10T02:13:35.120Z",
  "decks": []
}

Set-Cookie: user={"username":"john_doe","user_id":"..."}; HttpOnly; SameSite=Lax
```

**Validation Rules**:

- `username`: 3-20 characters, alphanumeric + underscore only, must be unique
- `password`: 8-16 characters
- `recoveryCode`: exactly 4 digits

**Error Responses**:

- `400 Bad Request`: Invalid input format
- `409 Conflict`: Username already exists
- `500 Internal Server Error`: Database error

**Rate Limiting**: 5 attempts per 15 minutes

---

#### Login

```http
POST /login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePass123"
}

Response (200 OK):
{
  "username": "john_doe",
  "createdAt": "2026-06-10T02:13:35.120Z",
  "decks": [
    {
      "_id": "6a28c84f42338562dd23c45b",
      "deckName": "Biology",
      "cardCount": 20,
      "createdAt": "2026-06-10T02:13:35.120Z",
      "updatedAt": "2026-06-10T02:13:35.120Z"
    }
  ]
}

Set-Cookie: user={"username":"john_doe","user_id":"..."}; HttpOnly; SameSite=Lax
```

**Response Includes**: User info + all user's decks with card counts

**Error Responses**:

- `401 Unauthorized`: Invalid username or password
- `500 Internal Server Error`: Server error

**Rate Limiting**: 5 attempts per 10 minutes

---

#### Get User Info

```http
GET /info
Cookie: user={"username":"john_doe","user_id":"..."}

Response (200 OK):
{
  "username": "john_doe",
  "createdAt": "2026-06-10T02:13:35.120Z"
}
```

**Authentication**: Required (via cookie)

**Error Responses**:

- `401 Unauthorized`: No valid session
- `500 Internal Server Error`: Server error

---

#### Logout

```http
POST /logout

Response (200 OK):
{ "message": "Logged out successfully" }
```

---

#### Password Recovery

```http
POST /recover
Content-Type: application/json

{
  "username": "john_doe",
  "recoveryCode": "1234",
  "newPassword": "newPass123"
}
```

---

### Deck Routes

#### Create Deck

```http
POST /deck
Cookie: user={"username":"john_doe","user_id":"..."}
Content-Type: application/json

{
  "deckName": "Spanish Vocabulary"
}

Response (201 Created):
{
  "message": "Deck created successfully!",
  "content": {
    "_id": "6a28c84f42338562dd23c45b",
    "user": "6a1f11f5e0d6cad323bc1392",
    "deckName": "Spanish Vocabulary",
    "createdAt": "2026-06-10T02:13:35.120Z",
    "updatedAt": "2026-06-10T02:13:35.120Z"
  }
}
```

**Validation**:

- Deck name required, max 50 characters

**Error Responses**:

- `400 Bad Request`: Invalid deck name
- `409 Conflict`: Deck name already exists
- `401 Unauthorized`: Not authenticated

**Rate Limiting**: 10 attempts per 10 minutes

---

#### Get All User Decks

```http
GET /decks
Cookie: user={"username":"john_doe","user_id":"..."}

Response (200 OK):
[
  {
    "_id": "6a28c84f42338562dd23c45b",
    "user": "6a1f11f5e0d6cad323bc1392",
    "deckName": "Biology",
    "cardCount": 20,
    "createdAt": "2026-06-10T02:13:35.120Z",
    "updatedAt": "2026-06-10T02:13:35.120Z"
  },
  {
    "_id": "6a28c93bc27bf7572ca9e642",
    "deckName": "History",
    "cardCount": 15,
    ...
  }
]
```

**Features**:

- Returns all user's decks
- Includes card count via aggregation
- Ordered by creation date

---

#### Get Deck by ID

```http
GET /deck/:id
Cookie: user={"username":"john_doe","user_id":"..."}

Response (200 OK):
{
  "_id": "6a28c84f42338562dd23c45b",
  "user": "6a1f11f5e0d6cad323bc1392",
  "deckName": "Biology",
  "createdAt": "2026-06-10T02:13:35.120Z",
  "updatedAt": "2026-06-10T02:13:35.120Z"
}
```

---

#### Update Deck

```http
PUT /deck/:id
Cookie: user={"username":"john_doe","user_id":"..."}
Content-Type: application/json

{
  "deckName": "Advanced Biology"
}

Response (201 Created):
{
  "message": "Deck updated successfully!",
  "content": {
    "_id": "6a28c84f42338562dd23c45b",
    "deckName": "Advanced Biology",
    ...
  }
}
```

**Features**:

- Only owner (via user_id cookie) can update
- Validates name length (max 50)

**Error Responses**:

- `400 Bad Request`: Invalid name
- `409 Conflict`: Name already used
- `401 Unauthorized`: Not authenticated

---

#### Delete Deck

```http
DELETE /deck/:id
Cookie: user={"username":"john_doe","user_id":"..."}

Response (200 OK):
{ "message": "Deck successfully deleted." }
```

**Cascade Delete**: Also deletes all cards in deck

**Error Responses**:

- `400 Bad Request`: Invalid deck ID format
- `404 Not Found`: Deck doesn't exist
- `401 Unauthorized`: Not authenticated

---

### Card Routes

#### Create Card

```http
POST /card
Cookie: user={"username":"john_doe","user_id":"..."}
Content-Type: application/json

{
  "deckId": "6a28c84f42338562dd23c45b",
  "question": "What is the capital of France?",
  "answer": "Paris",
  "options": ["Paris", "Lyon", "Marseille", "Nice"],
  "difficulty": "easy"
}

Response (201 Created):
{
  "message": "New card added.",
  "content": {
    "_id": "6a28d60ca81e0a78e2461cf3",
    "user": "6a1f11f5e0d6cad323bc1392",
    "deckId": "6a28c84f42338562dd23c45b",
    "question": "What is the capital of France?",
    "answer": "Paris",
    "options": ["Paris", "Lyon", "Marseille", "Nice"],
    "difficulty": "easy",
    "createdAt": "2026-06-10T03:12:12.480Z",
    "updatedAt": "2026-06-10T03:12:12.480Z"
  }
}
```

**Validation**:

- Valid deck ID (MongoDB ObjectId)
- Question and answer required (not empty)
- Question and answer max 255 characters
- Options array: 3-4 items
- Difficulty: "easy", "medium", or "hard" (case-insensitive)

**Error Responses**:

- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Not authenticated

**Rate Limiting**: 30 attempts per 10 minutes

---

#### Get All User Cards

```http
GET /cards
Cookie: user={"username":"john_doe","user_id":"..."}

Response (200 OK):
[
  {
    "_id": "6a28d60ca81e0a78e2461cf3",
    "user": "6a1f11f5e0d6cad323bc1392",
    "deckId": "6a28c84f42338562dd23c45b",
    "question": "What is the capital of France?",
    "answer": "Paris",
    "options": ["Paris", "Lyon", "Marseille", "Nice"],
    "difficulty": "easy",
    "createdAt": "2026-06-10T03:12:12.480Z",
    "updatedAt": "2026-06-10T03:12:12.480Z"
  }
]
```

---

#### Delete Card

```http
DELETE /card/:id
Cookie: user={"username":"john_doe","user_id":"..."}

Response (200 OK):
{ "message": "Card successfully deleted." }
```

**Error Responses**:

- `400 Bad Request`: Invalid card ID format
- `404 Not Found`: Card doesn't exist
- `401 Unauthorized`: Not authenticated

---

#### Update Card

```http
PUT /card/:id
Cookie: user={"username":"john_doe","user_id":"..."}
Content-Type: application/json

{
  "question": "What is the capital of Germany?",
  "answer": "Berlin",
  "options": ["Berlin", "Munich", "Frankfurt", "Cologne"],
  "difficulty": "easy"
}

Response (200 OK):
{
  "message": "Card updated successfully.",
  "content": { /* updated card */ }
}
```

Same validation rules as create endpoint.

---

## Database Structure

### Collections

#### Users Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, 3-20 chars, alphanumeric + underscore),
  password: String (8-16 chars),
  recoveryCode: String (4 digits),
  createdAt: Date,
  updatedAt: Date
}
```

#### Decks Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (reference to User),
  deckName: String (unique globally, max 50 chars),
  createdAt: Date,
  updatedAt: Date
}
```

**Note**: deckName uniqueness is global; should be per-user unique.

#### Cards Collection

```javascript
{
  _id: ObjectId,
  user: String (should be ObjectId),
  deckId: ObjectId (reference to Deck),
  question: String (max 255 chars),
  answer: String (max 255 chars),
  options: Array (max 4 items),
  difficulty: String (enum: "easy", "medium", "hard"),
  createdAt: Date,
  updatedAt: Date
}
```

**Issues**:

- user field should be ObjectId, not String
- answer not validated against options array
- No index on deckId for query performance

### Indexes Recommended

```javascript
// Users collection
db.users.createIndex({ username: 1 });

// Decks collection
db.decks.createIndex({ user: 1 });
db.decks.createIndex({ user: 1, deckName: 1 }, { unique: true });

// Cards collection
db.cards.createIndex({ deckId: 1 });
db.cards.createIndex({ user: 1 });
db.cards.createIndex({ deckId: 1, createdAt: 1 });
```

## Authentication Flow

### Session-Based Authentication Using Cookies

```
User Registration:
1. POST /register with credentials
2. Backend creates user in database
3. Sets httpOnly cookie with user info
4. Browser stores cookie automatically

User Login:
1. POST /login with credentials
2. Backend validates credentials
3. Sets httpOnly cookie with user info
4. Subsequent requests include cookie automatically

Protected Requests:
1. Client sends request with cookie
2. Auth middleware extracts cookie
3. Validates user exists in database
4. Calls next() if valid, returns 401 if invalid
5. Route handler executes only if auth passes

User Logout:
1. POST /logout
2. Frontend clears cookie
3. Subsequent requests without auth cookie
4. Protected routes return 401
```

### Cookie Structure

```javascript
{
  username: String,
  user_id: String (MongoDB ObjectId)
}

Options:
- httpOnly: true (prevents JavaScript access, XSS protection)
- sameSite: "lax" (CSRF protection)
- secure: false (set to true in production with HTTPS)
```

## Architecture Overview

### Request Flow

```
Client Request
    ↓
Express Server
    ↓
CORS & Middleware Processing
    ↓
Route Handler
    ├─→ Auth Middleware (if protected)
    │       ├─→ Validate Cookie
    │       ├─→ Verify User in DB
    │       └─→ Allow/Deny
    ├─→ Input Validation
    ├─→ Database Operations
    └─→ Response Generation
    ↓
Client Response
```

### Middleware Stack

```javascript
1. cors() - Handle cross-origin requests
2. express.json() - Parse JSON body
3. cookieParser() - Parse cookies
4. Auth (on protected routes) - Authenticate
5. Route handler - Execute endpoint logic
```

### Database Aggregation Example (getDecks)

```javascript
db.decks.aggregate([
  { $match: { user: userId } }, // Filter by user
  {
    $lookup: {
      // Join with cards
      from: "cards",
      localField: "_id",
      foreignField: "deckId",
      as: "cards",
    },
  },
  {
    $addFields: {
      // Count cards
      cardCount: { $size: "$cards" },
    },
  },
  { $project: { cards: 0 } }, // Remove card details
]);
```

### Current Security Measures

- ✓ httpOnly cookies (XSS protection)
- ✓ CORS configuration (CSRF prevention)
- ✓ Input validation on most endpoints
- ✓ Rate limiting on sensitive operations
- ✓ User ownership checks on some operations

---

## Support & Documentation

For frontend documentation, see [../frontend/README.md](../frontend/README.md)

For overall project documentation, see [../README.md](../README.md)
