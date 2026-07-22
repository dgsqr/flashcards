# Flashcard Learning Application

A full-stack web application for creating, managing, and studying flashcards with multiple learning modes. Built with modern technologies for an optimal learning experience.

## Project Overview

This application is designed to help students and learners master any subject through spaced repetition using interactive flashcards. Users can create personalized decks, add cards with multiple-choice options, and study using different modes (reveal, choice, or type).

### Key Use Cases

- **Students**: Prepare for exams with customizable study decks
- **Language Learners**: Practice vocabulary with multiple-choice reinforcement
- **Professionals**: Retain technical knowledge through active recall
- **Educators**: Create and share study materials with learners
- **General Learners**: Master any topic through spaced repetition

## Features

- User registration with secure recovery codes
- Session-based authentication with secure cookies
- Create and manage custom study decks
- Add flashcards with questions, answers, and options
- Multiple study modes (Reveal, Choice, Type)
- Difficulty categorization (Easy, Medium, Hard)
- Try demo decks without registration
- View card counts and deck statistics
- Responsive design for mobile, tablet, and desktop

## Technology Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Development**: ESLint, TypeScript strict mode

### Backend

- **Runtime**: Node.js
- **Framework**: Express v5
- **Database**: MongoDB with Mongoose
- **Authentication**: httpOnly Cookies + custom middleware
- **Security**: CORS, rate limiting, input validation

### Infrastructure

- **Database Hosting**: MongoDB Atlas
- **Version Control**: Git
- **Package Management**: npm

## Project Structure

```
mongodb/
├── backend/                    # Node.js/Express API server
│   ├── server.js              # Main server entry point
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (not in repo)
│   ├── middlewares/           # Express middleware
│   │   └── Auth.js            # Authentication middleware
│   ├── models/                # Mongoose schemas
│   │   ├── User.js            # User collection schema
│   │   ├── Deck.js            # Deck collection schema
│   │   └── Card.js            # Card collection schema
│   ├── routes/                # API route handlers
│   │   ├── users.js           # Auth routes (register, login, etc)
│   │   ├── decks.js           # Deck management routes
│   │   └── cards.js           # Card management routes
│   ├── README.md              # Backend documentation
│   └── DOCUMENTATION.md       # Detailed file documentation
│
├── frontend/                  # React/TypeScript web application
│   ├── src/
│   │   ├── main.tsx           # React entry point
│   │   ├── App.tsx            # Main router component
│   │   ├── contexts/          # React Context providers
│   │   │   ├── AuthContext.tsx     # User auth state
│   │   │   └── DeckContext.tsx     # Current deck state
│   │   ├── components/        # React components
│   │   │   ├── Header.tsx     # Navigation header
│   │   │   ├── Home.tsx       # Landing page
│   │   │   ├── Login.tsx      # Login page
│   │   │   ├── Register.tsx   # Registration page
│   │   │   ├── Profile.tsx    # User dashboard
│   │   │   ├── Study.tsx      # Study mode
│   │   │   ├── Create.tsx     # Create card form
│   │   │   └── ...            # Other components
│   │   ├── App.css            # App styles
│   │   └── index.css          # Global styles
│   ├── public/
│   │   └── demo-decks.json    # Demo flashcard data
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # TypeScript configuration
│   ├── .env                   # Environment variables
│   ├── README.md              # Frontend documentation
│   └── DOCUMENTATION.md       # Detailed file documentation
│
└── README.md                  # This file
```

## Installation

### Prerequisites

- Node.js v16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git for version control
- Modern web browser

### Quick Start

#### 1. Clone Repository

```bash
git clone <repository-url>
cd mongodb
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=8909
FRONTEND_URL=http://localhost:5173
EOF

# Start backend server
npm run dev
```

Backend runs at: `http://localhost:8909`

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8909
EOF

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

#### 4. Access Application

Open browser to: **http://localhost:5173**

## Environment Variables

### Backend (.env)

```env
# MongoDB connection URL from Atlas
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# Server port
PORT=8909

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

[Full backend setup guide →](./backend/README.md#environment-variables)

### Frontend (.env)

```env
# Backend API URL
VITE_API_URL=http://localhost:8909
```

[Full frontend setup guide →](./frontend/README.md#environment-variables)

## Running Locally

### Development Mode (with hot reload)

**Terminal 1 - Backend**:

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:

```bash
cd frontend
npm run dev
```

Then open: http://localhost:5173

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend (production)
cd ../backend
node server.js
```

### Authentication Endpoints

| Method | Endpoint    | Description                       |
| ------ | ----------- | --------------------------------- |
| POST   | `/register` | Create new account                |
| POST   | `/login`    | Authenticate user                 |
| GET    | `/info`     | Get authenticated user info       |
| POST   | `/logout`   | End user session                  |
| POST   | `/recover`  | Reset password with recovery code |

### Deck Endpoints

| Method | Endpoint    | Description                         |
| ------ | ----------- | ----------------------------------- |
| POST   | `/deck`     | Create new deck                     |
| GET    | `/decks`    | Get all user's decks                |
| GET    | `/deck/:id` | Get specific deck                   |
| PUT    | `/deck/:id` | Update deck                         |
| DELETE | `/deck/:id` | Delete deck (cascade deletes cards) |

### Card Endpoints

| Method | Endpoint    | Description          |
| ------ | ----------- | -------------------- |
| POST   | `/card`     | Create new card      |
| GET    | `/cards`    | Get all user's cards |
| PUT    | `/card/:id` | Update card          |
| DELETE | `/card/:id` | Delete card          |

[Full API documentation →](./backend/README.md#api-documentation)

## Database Structure

### Users Collection

```javascript
{
  _id: ObjectId,
  username: String,              // Unique, 3-20 chars, alphanumeric + underscore
  password: String,              // 8-16 chars (PLAIN TEXT - NEEDS HASHING)
  recoveryCode: String,          // 4 digits for password reset
  createdAt: Date,
  updatedAt: Date
}
```

### Decks Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId,                // Reference to User
  deckName: String,              // Max 50 chars, currently globally unique
  createdAt: Date,
  updatedAt: Date
}
```

### Cards Collection

```javascript
{
  _id: ObjectId,
  user: String,                  // Should be ObjectId (data type issue)
  deckId: ObjectId,              // Reference to Deck
  question: String,              // Max 255 chars
  answer: String,                // Max 255 chars
  options: Array,                // 3-4 multiple choice options
  difficulty: String,            // "easy", "medium", or "hard"
  createdAt: Date,
  updatedAt: Date
}
```

[Full database documentation →](./backend/README.md#database-structure)

## Authentication Flow

### Session-Based with httpOnly Cookies

```
┌─────────────────────────────────────┐
│ User Registration                   │
├─────────────────────────────────────┤
│ 1. Submit username, password, code  │
│ 2. Backend validates input          │
│ 3. Creates user in database         │
│ 4. Sets httpOnly cookie             │
│ 5. Client redirected to dashboard   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ User Login                          │
├─────────────────────────────────────┤
│ 1. Submit username, password        │
│ 2. Backend validates credentials    │
│ 3. Sets httpOnly cookie             │
│ 4. Client redirected to dashboard   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Protected Requests                  │
├─────────────────────────────────────┤
│ 1. Client sends request             │
│ 2. Cookie auto-included (httpOnly)  │
│ 3. Auth middleware validates        │
│ 4. Allowed if user exists in DB     │
│ 5. Route handler executes           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Logout                              │
├─────────────────────────────────────┤
│ 1. POST /logout                     │
│ 2. Client clears cookie             │
│ 3. Subsequent requests unauthorized │
└─────────────────────────────────────┘
```

[Full auth flow documentation →](./backend/README.md#authentication-flow)

## Architecture Overview

### Frontend Architecture

```
App.tsx
├── BrowserRouter
├── Header (Navigation)
└── Routes
    ├── Home (/)
    ├── Login (/login)
    ├── Register (/register)
    ├── Profile (/profile) - Protected
    ├── Study (/study) - Protected
    └── ... (other routes)
```

**State Management**:

- UserProvider (AuthContext) - User auth state
- DeckProvider (DeckContext) - Current deck state

**Data Flow**:
Components → API (axios) → Backend

### Backend Architecture

```
Express Server
├── Middleware Layer
│   ├── CORS
│   ├── JSON Parser
│   ├── Cookie Parser
│   └── Auth (on protected routes)
├── Route Handlers
│   ├── /register → users.js
│   ├── /login → users.js
│   ├── /deck → decks.js
│   ├── /card → cards.js
│   └── ...
└── Database Layer
    └── MongoDB
        ├── Users
        ├── Decks
        └── Cards
```

**Request Flow**:
Client → CORS → Validation → Auth → Route Handler → DB

[Full architecture documentation →](./backend/README.md#architecture-overview)

## Security Considerations

### Current Protections

- ✅ httpOnly cookies prevent XSS attacks
- ✅ CORS restricts cross-origin requests
- ✅ Input validation on all endpoints
- ✅ Rate limiting on sensitive operations
- ✅ User ownership checks (partially)

## Support & Resources

### Documentation Files

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

### External Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

## Author

Created as a learning project for full-stack web development.
