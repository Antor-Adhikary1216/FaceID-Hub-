# Face Identity Platform — Implementation Plan

## Overview

14-phase implementation plan. Each phase produces testable, working code. Phases build on each other sequentially.

---

## Phase 1: Project Setup

**Goal:** Initialize all projects, configurations, and Docker setup.

### Tasks
- [ ] Create monorepo directory structure
- [ ] Initialize frontend (Vite + React + TypeScript)
- [ ] Initialize backend (Express + TypeScript)
- [ ] Initialize AI service (FastAPI + Python)
- [ ] Create `docker-compose.yml` with PostgreSQL + Redis
- [ ] Create `.env.example` for all services
- [ ] Create root `package.json` with workspace scripts
- [ ] Setup ESLint + Prettier for frontend and backend
- [ ] Setup Python linting (ruff) for AI service
- [ ] Create `README.md` with setup instructions
- [ ] Git init + `.gitignore`

### Files to Create
```
face-identity-platform/
├── frontend/          (Vite + React + TS)
├── backend/           (Express + TS)
├── ai-service/        (FastAPI + Python)
├── database/          (migrations, seed)
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── package.json       (workspace root)
```

### Dependencies
- Node.js 20+
- Python 3.11+
- Docker + Docker Compose
- PostgreSQL 15 (via Docker)

### Acceptance Criteria
- [ ] `docker-compose up` starts PostgreSQL
- [ ] Frontend dev server starts on :5173
- [ ] Backend dev server starts on :3001
- [ ] AI service starts on :8000
- [ ] All linters configured and passing

---

## Phase 2: Database Schema

**Goal:** Complete PostgreSQL schema with pgvector.

### Tasks
- [ ] Enable uuid-ossp and vector extensions
- [ ] Create users table
- [ ] Create profiles table
- [ ] Create face_embeddings table with vector(512)
- [ ] Create social_profiles table
- [ ] Create skills table
- [ ] Create projects table
- [ ] Create search_requests table
- [ ] Create search_results table
- [ ] Create audit_logs table
- [ ] Create all indexes (including HNSW)
- [ ] Create seed data script
- [ ] Test schema with sample data

### Files to Create
```
database/
├── migrations/
│   └── 001_initial_schema.sql
└── seed/
    └── seed.sql
```

### Dependencies
- PostgreSQL 15 + pgvector
- Phase 1 complete

### Acceptance Criteria
- [ ] All tables created successfully
- [ ] HNSW index created on face_embeddings
- [ ] Seed data inserts without errors
- [ ] All constraints and indexes work

---

## Phase 3: Backend Core

**Goal:** Express server with middleware, config, error handling.

### Tasks
- [ ] Create Express server with TypeScript
- [ ] Setup environment config (dotenv + zod)
- [ ] Setup structured logging (pino)
- [ ] Setup CORS middleware
- [ ] Setup Helmet security headers
- [ ] Setup rate limiting (express-rate-limit)
- [ ] Setup global error handler
- [ ] Setup request validation middleware (zod)
- [ ] Setup file upload middleware (multer)
- [ ] Create health check endpoint
- [ ] Connect to PostgreSQL (Drizzle ORM)
- [ ] Create database connection pool

### Files to Create
```
backend/src/
├── config/
│   └── index.ts          (env validation + export)
├── middleware/
│   ├── errorHandler.ts
│   ├── validate.ts
│   ├── auth.ts
│   ├── rateLimiter.ts
│   └── upload.ts
├── utils/
│   └── logger.ts
├── routes/
│   └── health.ts
├── app.ts
└── server.ts
```

### Dependencies
- express, cors, helmet, express-rate-limit
- drizzle-orm, postgres (driver)
- zod, pino, multer
- dotenv

### Acceptance Criteria
- [ ] Server starts on :3001
- [ ] Health check returns 200
- [ ] CORS configured correctly
- [ ] Rate limiting works
- [ ] Error handler catches and formats errors

---

## Phase 4: Authentication

**Goal:** Complete JWT auth system.

### Tasks
- [ ] Create users table model (Drizzle)
- [ ] Implement registration endpoint
- [ ] Implement login endpoint
- [ ] Implement token refresh endpoint
- [ ] Implement logout endpoint
- [ ] Implement get-current-user endpoint
- [ ] Password hashing with bcrypt
- [ ] JWT token generation (access + refresh)
- [ ] Auth middleware for protected routes
- [ ] Zod validation schemas for auth
- [ ] Unit tests for auth service
- [ ] Integration tests for auth endpoints

### Files to Create
```
backend/src/
├── models/
│   └── user.ts
├── services/
│   └── authService.ts
├── controllers/
│   └── authController.ts
├── routes/
│   └── auth.ts
├── validators/
│   └── auth.ts
└── __tests__/
    ├── auth.service.test.ts
    └── auth.routes.test.ts
```

### Dependencies
- bcryptjs, jsonwebtoken
- Phase 2 (database), Phase 3 (backend core)

### Acceptance Criteria
- [ ] User can register with email/password
- [ ] User can login and receive tokens
- [ ] Refresh token works
- [ ] Protected routes require valid token
- [ ] Invalid credentials return 401
- [ ] Password hashed, never stored plaintext

---

## Phase 5: Profile CRUD

**Goal:** Profile management endpoints.

### Tasks
- [ ] Create profile model (Drizzle)
- [ ] Implement create profile endpoint (with image upload)
- [ ] Implement get own profile endpoint
- [ ] Implement get public profile endpoint
- [ ] Implement update profile endpoint
- [ ] Implement delete profile endpoint
- [ ] Implement delete face embedding endpoint
- [ ] File upload handling (multer + validation)
- [ ] Image validation (MIME, size, dimensions)
- [ ] Storage service (save/delete images)
- [ ] Zod validation for profile data
- [ ] Unit tests for profile service
- [ ] Integration tests for profile endpoints

### Files to Create
```
backend/src/
├── models/
│   └── profile.ts
├── services/
│   ├── profileService.ts
│   └── storageService.ts
├── controllers/
│   └── profileController.ts
├── routes/
│   └── profiles.ts
├── validators/
│   └── profile.ts
└── __tests__/
    ├── profile.service.test.ts
    └── profile.routes.test.ts
```

### Dependencies
- Phase 3 (backend core), Phase 4 (auth)
- Multer for file uploads

### Acceptance Criteria
- [ ] User can create profile with image
- [ ] User can get own profile with social/skills/projects
- [ ] Public profile accessible without auth
- [ ] User can update profile fields
- [ ] User can delete profile (cascades)
- [ ] User can delete face embedding separately
- [ ] Image validation prevents bad uploads

---

## Phase 6: Social Profiles, Skills, Projects

**Goal:** Manage social links, skills, and projects.

### Tasks
- [ ] Create social_profiles model
- [ ] Create skills model
- [ ] Create projects model
- [ ] Implement CRUD for social profiles
- [ ] Implement CRUD for skills
- [ ] Implement CRUD for projects
- [ ] Platform validation (enum check)
- [ ] URL validation
- [ ] Unit tests
- [ ] Integration tests

### Files to Create
```
backend/src/
├── models/
│   ├── socialProfile.ts
│   ├── skill.ts
│   └── project.ts
├── services/
│   ├── socialProfileService.ts
│   ├── skillService.ts
│   └── projectService.ts
├── controllers/
│   ├── socialProfileController.ts
│   ├── skillController.ts
│   └── projectController.ts
├── routes/
│   ├── social.ts
│   ├── skills.ts
│   └── projects.ts
├── validators/
│   ├── social.ts
│   ├── skill.ts
│   └── project.ts
```

### Dependencies
- Phase 5 (profiles)

### Acceptance Criteria
- [ ] Add/edit/delete social profiles
- [ ] Add/delete skills
- [ ] Add/edit/delete projects
- [ ] Platform enum validated
- [ ] URLs validated
- [ ] Owner-only modification

---

## Phase 7: AI Service — Face Detection

**Goal:** Face detection and validation endpoint.

### Tasks
- [ ] Create FastAPI application
- [ ] Load InsightFace model (buffalo_l)
- [ ] Implement face detection endpoint
- [ ] Return bounding boxes + confidence
- [ ] Handle no-face-detected case
- [ ] Handle multiple faces
- [ ] Image validation (MIME, size)
- [ ] Unit tests for detection

### Files to Create
```
ai-service/
├── app/
│   ├── main.py           (FastAPI app)
│   ├── api/
│   │   └── detect.py     (detection endpoint)
│   ├── models/
│   │   └── face.py       (model loading)
│   ├── schemas/
│   │   └── detect.py     (Pydantic models)
│   └── utils/
│       └── image.py      (image processing)
├── requirements.txt
├── Dockerfile
└── tests/
    └── test_detect.py
```

### Dependencies
- fastapi, uvicorn, opencv-python-headless
- insightface, onnxruntime
- numpy, Pillow

### Acceptance Criteria
- [ ] Detects faces in uploaded images
- [ ] Returns bounding box coordinates
- [ ] Returns detection confidence
- [ ] Handles no-face case with 422
- [ ] Handles multiple faces (returns all)
- [ ] Processing time < 500ms

---

## Phase 8: AI Service — Face Embedding

**Goal:** Generate face embeddings from detected faces.

### Tasks
- [ ] Implement face alignment (landmark-based)
- [ ] Implement face embedding generation (ArcFace)
- [ ] L2-normalize embeddings
- [ ] Implement combined detect+embed endpoint
- [ ] Return embedding vector (512-d)
- [ ] Unit tests for embedding

### Files to Create
```
ai-service/app/
├── services/
│   ├── detection.py
│   ├── alignment.py
│   └── embedding.py
├── api/
│   └── embed.py          (combined endpoint)
└── schemas/
    └── embed.py
```

### Dependencies
- InsightFace (includes ArcFace)
- Phase 7 (detection)

### Acceptance Criteria
- [ ] Generates 512-d embedding vector
- [ ] Embedding is L2-normalized
- [ ] Combined detect+embed works
- [ ] Returns embedding + bbox + confidence
- [ ] Processing time < 200ms per face

---

## Phase 9: Backend — AI Integration

**Goal:** Backend calls AI service for face processing.

### Tasks
- [ ] Create AI service client (HTTP)
- [ ] Integrate AI call into profile creation
- [ ] Integrate AI call into search endpoint
- [ ] Handle AI service errors gracefully
- [ ] Implement search endpoint (POST /search)
- [ ] pgvector similarity search query
- [ ] Confidence scoring logic
- [ ] Search result ranking
- [ ] Search image deletion after processing
- [ ] Search request/result logging
- [ ] Audit logging for face operations
- [ ] Integration tests

### Files to Create
```
backend/src/
├── services/
│   ├── aiService.ts        (HTTP client to AI service)
│   ├── searchService.ts    (search logic)
│   └── auditService.ts
├── models/
│   ├── searchRequest.ts
│   └── searchResult.ts
├── controllers/
│   └── searchController.ts
├── routes/
│   └── search.ts
```

### Dependencies
- Phase 5 (profiles), Phase 6 (social/skills/projects)
- Phase 7-8 (AI service running)

### Acceptance Criteria
- [ ] Profile creation calls AI, stores embedding
- [ ] Search generates embedding, queries pgvector
- [ ] Results ranked by similarity
- [ ] Confidence labels assigned correctly
- [ ] "No match" when below threshold
- [ ] Search images deleted after processing
- [ ] Audit logs created for face operations
- [ ] AI service failure returns graceful error

---

## Phase 10: Audit Logging

**Goal:** Track all important operations.

### Tasks
- [ ] Create audit log model
- [ ] Implement audit logging service
- [ ] Log auth events (register, login, logout)
- [ ] Log profile events (create, update, delete)
- [ ] Log face events (enroll, delete, search)
- [ ] Log social/skill/project events
- [ ] Implement GET /audit/logs (admin only)
- [ ] Unit tests

### Files to Create
```
backend/src/
├── models/
│   └── auditLog.ts
├── services/
│   └── auditService.ts
├── routes/
│   └── audit.ts
```

### Dependencies
- Phase 4-6 (auth, profiles, social)

### Acceptance Criteria
- [ ] All face operations logged
- [ ] All auth events logged
- [ ] All profile changes logged
- [ ] Logs include IP, user agent, timestamp
- [ ] Admin can query audit logs

---

## Phase 11: Frontend — Core UI

**Goal:** React app with routing, auth, and layout.

### Tasks
- [ ] Setup React Router v6
- [ ] Create layout components (Header, Footer, Sidebar)
- [ ] Create base UI components (Button, Input, Card, Modal, Badge, Toast)
- [ ] Create auth context/store (Zustand)
- [ ] Implement login page
- [ ] Implement register page
- [ ] Implement auth flow (tokens, refresh, logout)
- [ ] Create protected route wrapper
- [ ] Create API client service
- [ ] Create upload zone component
- [ ] Implement home page with search widget

### Files to Create
```
frontend/src/
├── components/
│   ├── ui/            (Button, Input, Card, Modal, Badge, Toast)
│   ├── layout/        (Header, Footer, Sidebar, Layout)
│   └── face/          (UploadZone, FacePreview)
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── stores/
│   └── authStore.ts
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── hooks/
│   └── useAuth.ts
├── App.tsx
└── main.tsx
```

### Dependencies
- react, react-router-dom, zustand, axios
- tailwindcss

### Acceptance Criteria
- [ ] Routing works (home, login, register, dashboard)
- [ ] Auth flow works end-to-end
- [ ] Protected routes redirect to login
- [ ] Upload zone accepts drag-and-drop
- [ ] Toast notifications work
- [ ] Responsive layout

---

## Phase 12: Frontend — Profile & Search

**Goal:** Profile management and search result UI.

### Tasks
- [ ] Create enrollment page (multi-step form)
- [ ] Create profile detail page (public)
- [ ] Create edit profile page
- [ ] Create social links management UI
- [ ] Create skills management UI
- [ ] Create projects management UI
- [ ] Create search results page
- [ ] Create match card component
- [ ] Create confidence badge component
- [ ] Create search history page
- [ ] Create account settings page
- [ ] Add consent flow to enrollment
- [ ] Add disclaimer banners

### Files to Create
```
frontend/src/
├── pages/
│   ├── Enroll.tsx
│   ├── Profile.tsx
│   ├── EditProfile.tsx
│   ├── SearchResults.tsx
│   ├── SearchHistory.tsx
│   └── Settings.tsx
├── components/
│   ├── profile/       (ProfileCard, SocialLinks, Skills, Projects)
│   └── search/        (MatchCard, ConfidenceBadge, SearchWidget)
```

### Dependencies
- Phase 11 (core UI)
- Backend API complete (Phases 4-9)

### Acceptance Criteria
- [ ] User can enroll with multi-step form
- [ ] Consent checkbox required before enrollment
- [ ] Profile page displays all info
- [ ] Social links displayed with icons
- [ ] Skills displayed as tags
- [ ] Projects listed with links
- [ ] Search results show matches with confidence
- [ ] "No match" result displayed correctly
- [ ] Disclaimer shown on search results

---

## Phase 13: Testing

**Goal:** Comprehensive test suite.

### Tasks
- [ ] Backend unit tests (Jest + Supertest)
- [ ] AI service unit tests (pytest)
- [ ] Integration tests for all API endpoints
- [ ] Frontend component tests (Vitest)
- [ ] E2E test setup (Playwright)
- [ ] Test coverage report
- [ ] Fix any failing tests

### Test Files
```
backend/src/__tests__/
├── auth.service.test.ts
├── auth.routes.test.ts
├── profile.service.test.ts
├── profile.routes.test.ts
├── search.routes.test.ts
├── social.routes.test.ts
├── skill.routes.test.ts
└── project.routes.test.ts

ai-service/tests/
├── test_detect.py
├── test_embed.py
└── test_search.py

frontend/src/__tests__/
├── Login.test.tsx
├── Register.test.tsx
├── Enroll.test.tsx
├── SearchResults.test.tsx
└── Profile.test.tsx
```

### Acceptance Criteria
- [ ] Backend test coverage > 80%
- [ ] AI service tests pass
- [ ] Frontend component tests pass
- [ ] All API endpoints tested
- [ ] Edge cases covered (no face, bad image, etc.)

---

## Phase 14: Docker & Deployment

**Goal:** Production-ready Docker setup.

### Tasks
- [ ] Create Dockerfile for frontend (multi-stage: build + nginx)
- [ ] Create Dockerfile for backend (Node 20 Alpine)
- [ ] Create Dockerfile for AI service (Python 3.11 Slim)
- [ ] Update docker-compose.yml with all services
- [ ] Create nginx.conf for frontend
- [ ] Create health check scripts
- [ ] Create database initialization script
- [ ] Create .dockerignore files
- [ ] Test full docker-compose up
- [ ] Create deployment documentation

### Files to Create
```
frontend/Dockerfile
frontend/nginx.conf
frontend/.dockerignore
backend/Dockerfile
backend/.dockerignore
ai-service/Dockerfile
ai-service/.dockerignore
docker-compose.yml (updated)
docker-compose.prod.yml
```

### Dependencies
- All previous phases complete
- Docker + Docker Compose

### Acceptance Criteria
- [ ] `docker-compose up` starts all services
- [ ] Frontend accessible on :5173 (or :80 in prod)
- [ ] Backend accessible on :3001
- [ ] AI service accessible on :8000
- [ ] PostgreSQL accessible on :5432
- [ ] All health checks pass
- [ ] Full flow works end-to-end via Docker

---

## Final Acceptance Checklist

- [ ] User can register
- [ ] User can login
- [ ] User can create profile
- [ ] User can upload face image
- [ ] Face embedding generated locally
- [ ] Embedding stored securely
- [ ] User can search by photo
- [ ] Vector similarity search works
- [ ] Possible matches returned with confidence
- [ ] "No match" works correctly
- [ ] Social links can be added/edited/removed
- [ ] Skills and projects managed
- [ ] Profile deletion removes all data
- [ ] Face embedding deletion works
- [ ] Search images deleted after processing
- [ ] No paid API required
- [ ] All tests pass
- [ ] Docker Compose starts all services
- [ ] Seven documentation files exist
- [ ] No secrets in code
