# Flashcard Learning Application - Frontend

A modern React TypeScript web application for creating, managing, and studying flashcards with multiple learning modes. Built with Vite, Tailwind CSS, and React Router for optimal performance and developer experience.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Build & Deployment](#build--deployment)
- [Architecture](#architecture)
- [Component Overview](#component-overview)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)

## Features

### User Authentication

- User registration with recovery code
- Session-based login/logout
- Automatic session verification on app load
- Protected routes with auth guards

### Deck Management

- Create custom study decks
- View all personal decks with card counts
- Edit deck names
- Delete decks (with cascade delete of cards)
- Pagination through decks (5 per page)

### Card Management

- Create flashcards with questions, answers, and multiple choice options
- Organize cards into decks
- Set card difficulty levels (easy, medium, hard)
- Edit existing cards
- Delete cards
- Support for 3-4 multiple choice options

### Study Modes

- **Reveal Mode**: Click to reveal answers
- **Choice Mode**: Select correct answer from options
- **Type Mode**: Type answer for validation
- Color-coded cards (rotates through 4 colors)
- Progress tracking (current card / total cards)
- Answer feedback (green for correct, red for incorrect)
- Finish confirmation when all cards completed

### Demo Content

- Try demo decks without login
- Demo content loaded from JSON file
- No authentication required for demo

## Technologies

| Technology   | Version | Purpose                              |
| ------------ | ------- | ------------------------------------ |
| React        | 19.2.6  | UI framework                         |
| TypeScript   | ~6.0.2  | Type safety & development experience |
| React Router | 7.17.0  | Client-side routing                  |
| Axios        | 1.17.0  | HTTP client for API requests         |
| Tailwind CSS | 4.3.0   | Utility-first CSS styling            |
| Vite         | 8.0.12  | Build tool & dev server              |
| React DOM    | 19.2.6  | React rendering library              |

### Development Tools

- ESLint - Code linting
- TypeScript ESLint - TypeScript linting
- Vite React Plugin - React fast refresh in Vite

## Folder Structure

```
frontend/
├── src/
│   ├── main.tsx                    # App entry point & React DOM render
│   ├── App.tsx                     # Main router component
│   ├── App.css                     # App-specific styles
│   ├── index.css                   # Global styles & Tailwind imports
│   ├── contexts/                   # React Context providers
│   │   ├── AuthContext.tsx         # User auth & session state
│   │   └── DeckContext.tsx         # Current deck state
│   ├── components/
│   │   ├── Header.tsx              # Navigation header
│   │   ├── Footer.tsx              # Page footer
│   │   ├── Home.tsx                # Landing page
│   │   ├── Login.tsx               # Login page
│   │   ├── Register.tsx            # Registration page
│   │   ├── Recover.tsx             # Password recovery page
│   │   ├── Profile.tsx             # User dashboard/deck list
│   │   ├── Study.tsx               # Study mode interface
│   │   ├── SelectDeck.tsx          # Deck selection dropdown
│   │   ├── Create.tsx              # Create new card form
│   │   ├── NewDeck.tsx             # Create new deck modal
│   │   ├── LoadingCreate.tsx       # Loading state component
│   │   ├── DeckSettings.tsx        # Deck management interface
│   │   ├── Edit.tsx                # Edit card interface
│   │   ├── Delete.tsx              # Delete confirmation
│   │   └── Demo.tsx                # Demo decks showcase
│   └── assets/                     # Images, icons, etc.
├── public/
│   └── demo-decks.json             # Demo flashcards data
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json               # App TypeScript settings
├── tsconfig.node.json              # Node TypeScript settings
├── package.json                    # Dependencies & scripts
├── .env                            # Environment variables (not in repo)
├── .gitignore                      # Git ignore rules
└── eslint.config.js                # ESLint configuration
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see [backend README](../backend/README.md))

### Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd frontend
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

Create a `.env` file in the frontend directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8909
```

### Variable Descriptions

| Variable       | Description          | Example                                                 |
| -------------- | -------------------- | ------------------------------------------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:8909` or `https://api.yourdomain.com` |

## Running Locally

### Development Mode

```bash
npm run dev
```

Starts development server with hot module replacement (HMR).

Default: `http://localhost:5173`

**Features**:

- Auto-reload on file changes
- Source maps for debugging
- Fast refresh for React components
- Access to DevTools

### Build for Production

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

**Process**:

1. Type check with TypeScript
2. Bundle with Vite
3. Minify and optimize
4. Generate source maps

### Preview Production Build

```bash
npm run preview
```

Serves production build locally for testing before deployment.

### Linting

```bash
npm run lint
```

Runs ESLint to check code quality and style.

---

## Build & Deployment

### Building for Production

```bash
npm run build
```

Outputs to `dist/` directory with:

- Minified JavaScript
- Optimized CSS
- Index HTML with injected scripts
- Asset manifest for caching

### Deployment Platforms

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Traditional Server

```bash
# Build
npm run build

# Upload dist/ folder to web server
# Configure server to route all requests to index.html (SPA)
```

### Environment Variables in Production

Set `VITE_API_URL` to your production backend URL in deployment platform settings.

---

## Architecture

### Component Hierarchy

```
App
├── BrowserRouter
├── Header
│   ├── Navigation
│   └── ProfileDropdown
└── Routes
    ├── Home (public)
    ├── Login (public)
    ├── Register (public)
    ├── Recover (public)
    ├── Demo (public)
    ├── Profile (protected)
    ├── Study (protected)
    ├── Create (protected)
    ├── DeckSettings (protected)
    └── ... (other routes)
```

### Context Provider Hierarchy

```
main.tsx
└── StrictMode
    └── DeckProvider
        └── UserProvider
            └── App
```

**Why this order?**

- DeckProvider wraps UserProvider because DeckContext uses DeckProvider
- UserProvider provides auth state needed by all components
- StrictMode in development detects side effects

### State Management Flow

**Authentication State**:

```
UserProvider initializes
  ├─→ Check session: GET /info
  ├─→ If valid: Set user + decks
  ├─→ If invalid: Set user = null
  └─→ Components read via useAuth()
```

**Deck State**:

```
DeckContext provides current deck
  ├─→ Profile selects deck: getDeck()
  ├─→ Deck stored in context
  ├─→ Navigate to /study
  └─→ Study component reads via useDeck()
```

### Data Flow Example: Creating a Card

```
Create.tsx
  ├─→ User fills form
  ├─→ Submit: axios.post('/card', data)
  ├─→ Backend validates & stores
  ├─→ Response: { message, content }
  ├─→ Show success/error
  ├─→ Redirect or reload
  └─→ User sees new card in deck
```

---

## Component Overview

### Authentication Components

**Login.tsx**

- Form with username/password
- Real-time validation
- Error messages
- Rate limit feedback
- Redirect on success

**Register.tsx**

- Username, password, recovery code inputs
- Field-by-field validation
- Visual feedback (valid/invalid state)
- Account creation
- Redirect to profile

**Recover.tsx**

- Password recovery form
- Recovery code verification
- New password setup

### Deck Management Components

**Profile.tsx**

- Displays user info (avatar, username)
- Lists user's decks (paginated)
- Click deck to study
- Shows card counts
- Loading states

**DeckSettings.tsx**

- Edit deck name
- Delete deck
- View statistics
- Manage deck properties

### Study Components

**Study.tsx**

- Displays flashcard
- Implements study modes
- Answer validation
- Visual feedback
- Progress tracking
- Completion detection

**SelectDeck.tsx**

- Dropdown for deck selection
- Shows available decks
- Integrates with Study component

### Card Management

**Create.tsx**

- Create new card form
- Multiple choice options input
- Difficulty selection
- Deck selection
- Error handling
- Form reset on success

**Edit.tsx**

- Update existing card
- Same fields as Create

**Delete.tsx**

- Confirmation dialog
- Delete card
- Cascade validation

---

## State Management

### AuthContext

**Provides**:

- `user`: Current authenticated user
- `decks`: User's decks list
- `loading`: Auth check in progress
- `setUser`: Update user state
- `setDecks`: Update decks state

**Hook Usage**:

```typescript
const { user, setUser, decks, loading } = useAuth();
```

**Flow**:

```
App Load
  ├─→ UserProvider mounts
  ├─→ useEffect: GET /info
  ├─→ If valid cookie: Set user + decks
  ├─→ If invalid: Set user = null
  └─→ Components render based on user state
```

### DeckContext

**Provides**:

- `deck`: Currently selected deck
- `setDeck`: Update selected deck

**Hook Usage**:

```typescript
const { deck, setDeck } = useDeck();
```

**Usage Pattern**:

```
1. User in Profile clicks deck
2. Calls getDeck(deckId)
3. Fetches deck from API
4. setDeck(deck) - stores in context
5. Navigate to /study
6. Study accesses deck from context
```

---

## API Integration

### Axios Configuration

All requests use axios with credentials:

```typescript
axios.get(url, { withCredentials: true });
axios.post(url, data, { withCredentials: true });
```

This sends httpOnly cookies automatically.

### Error Handling Pattern

```typescript
try {
  const response = await axios.post(endpoint, data, {
    withCredentials: true,
  });
  // Handle success
} catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      // Show API error message
      setError(error.response.data);
    }
  } else {
    // Show generic error
    setError("Internal server error");
  }
}
```

### API Endpoints Used

**Authentication**:

- POST `/register` - Create account
- POST `/login` - Login user
- GET `/info` - Get user info
- POST `/logout` - Logout user
- POST `/recover` - Password recovery

**Decks**:

- POST `/deck` - Create deck
- GET `/decks` - Get all decks
- GET `/deck/:id` - Get specific deck
- PUT `/deck/:id` - Update deck
- DELETE `/deck/:id` - Delete deck

**Cards**:

- POST `/card` - Create card
- GET `/cards` - Get all cards
- PUT `/card/:id` - Update card
- DELETE `/card/:id` - Delete card

---

## Styling

### Tailwind CSS

**Configuration**: Tailwind v4 with @tailwindcss/vite plugin

**Key Features**:

- Utility-first CSS approach
- Responsive breakpoints: sm, md, lg, xl, 2xl
- Custom color palette (dark, pink, teal, blue, yellow, etc.)
- Custom spacing and sizing

### Global Styles

**index.css**:

- Tailwind directives (@tailwind)
- Global CSS resets
- Custom properties
- Font imports

**App.css**:

- Component-specific styles
- Complex animations
- Layout utilities

### Responsive Design

**Breakpoints Used**:

```
max-sm:     < 640px (mobile)
max-md:     < 768px (tablet)
max-lg:     < 1024px (laptop)
max-xl:     < 1280px (desktop)
```

**Example**:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Custom Theme Colors

```
- dark: Black (#000)
- cream: Off-white (#FFF)
- pink: Bright pink
- teal: Cyan/teal
- blue: Bright blue
- yellow: Bright yellow
- red: Red
- brown: Brown text
```

---

## Performance

### Optimization Strategies

1. **Code Splitting**
   - Routes use default export (Vite auto-chunks)
   - Components lazy-load via Router

2. **State Management**
   - Context API prevents prop drilling
   - Minimal global state
   - Only necessary re-renders

3. **API Caching**
   - Deck cached in DeckContext until cleared
   - User cached in UserProvider
   - No redundant API calls

4. **Bundle Optimization**
   - Vite native ES modules
   - Tree shaking removes dead code
   - Minification in production build

5. **Image Optimization**
   - SVG icons used (scalable, small)
   - No heavy image dependencies

### Loading States

- Skeleton screens during auth check
- Spinners while fetching data
- Disabled buttons during submission
- Progress indicators in Study mode

---

## Accessibility

### Current Implementations

- Semantic HTML structure
- Aria labels on interactive elements
- Keyboard navigation in components
- Color contrast for readability
- Focus states on buttons

---

## Troubleshooting

### CORS Errors

- Check `VITE_API_URL` in .env
- Ensure backend is running
- Verify backend CORS configuration

### Authentication Fails

- Check browser cookies are enabled
- Verify backend cookie settings
- Check auth token validity

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Hot Reload Not Working

- Restart dev server
- Check for TypeScript errors
- Verify Vite config

---

## Support & Documentation

For backend documentation, see [../backend/README.md](../backend/README.md)

For overall project documentation, see [../README.md](../README.md)

---
