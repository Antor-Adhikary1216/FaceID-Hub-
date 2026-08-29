# FaceID Hub

A consent-based face identity and professional profile discovery platform. Users voluntarily enroll with a profile and face embedding. Anyone can then search by uploading a photo to find possible matches — always with explicit consent and full control over biometric data.

## Features

- **Consent-Based Matching** — Every profile is voluntarily enrolled. Users control what they share.
- **Privacy-Protected** — Search images are never stored. Biometric data is encrypted and hashed.
- **Face Detection & Embedding** — AI-powered face detection using InsightFace with 512-d embeddings.
- **Professional Profiles** — Showcase skills, projects, and social links.
- **Dark Mode** — Full light/dark theme with system preference detection.
- **Real-Time Search** — Upload a photo and get similarity-scored matches instantly.
- **Firebase + JWT Auth** — Secure authentication with Google sign-in and email/password.
- **Responsive Design** — Works on desktop, tablet, and mobile.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite, Zustand, React Router |
| Backend | Node.js, Express, TypeScript, Mongoose, JWT |
| Database | MongoDB |
| Auth | Firebase Authentication + JWT |
| AI Service | Python, FastAPI, InsightFace, OpenCV |
| Deployment | Docker, Docker Compose |

## Project Structure

```
FaceID-Hub-/
├── frontend/          # React.js frontend
├── backend/           # Node.js/Express API
├── ai-service/        # Python/FastAPI face detection
├── assets/            # Static design assets
├── pages/             # HTML prototype pages
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- MongoDB
- Firebase project (for auth)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Antor-Adhikary1216/FaceID-Hub-.git
cd FaceID-Hub-
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Configure environment**

```bash
cp .env.example backend/.env
# Edit backend/.env with your MongoDB URI, Firebase credentials, and JWT secrets
```

5. **Start MongoDB**

```bash
mongod
```

6. **Start the backend**

```bash
cd backend
npm run dev
```

7. **Start the frontend**

```bash
cd frontend
npm run dev
```

8. **Open in browser**

```
http://localhost:5173
```

### Docker Setup

```bash
docker-compose up --build
```

This starts MongoDB, backend, AI service, and frontend.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh token |
| POST | `/api/v1/auth/logout` | Logout |
| POST | `/api/v1/auth/firebase-login` | Firebase auth |
| GET | `/api/v1/auth/me` | Get current user |

### Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/profiles` | Create profile |
| GET | `/api/v1/profiles/me` | Get own profile |
| GET | `/api/v1/profiles/:id` | Get public profile |
| PUT | `/api/v1/profiles` | Update profile |
| DELETE | `/api/v1/profiles` | Delete profile |
| POST | `/api/v1/profiles/face` | Add face embedding |
| DELETE | `/api/v1/profiles/face/:embeddingId` | Remove face embedding |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/search` | Search by face image |
| GET | `/api/v1/search/history` | Get search history |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/faceid` |
| `JWT_SECRET` | JWT access token secret | — |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | — |
| `PORT` | Backend port | `3001` |
| `AI_SERVICE_URL` | Face detection service URL | `http://localhost:8000` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | — |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | — |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | — |

## License

MIT
