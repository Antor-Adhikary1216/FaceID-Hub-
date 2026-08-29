# Face Identity Platform — API Specification

## Base Configuration

```
Base URL:     http://localhost:3001/api/v1
Content-Type: application/json (except file uploads)
Auth:         Bearer JWT token (Authorization header)
Rate Limit:   100 req/min general, 10 req/min auth endpoints
```

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "fullName": "John Smith"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Smith",
    "role": "user",
    "createdAt": "2026-08-28T10:00:00Z"
  },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

**Errors:**
- `400` — Invalid input (missing fields, weak password, invalid email)
- `409` — Email already registered

---

### POST /auth/login
Authenticate and receive tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Smith",
    "role": "user"
  },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

**Errors:**
- `401` — Invalid email or password
- `400` — Invalid input

---

### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

**Errors:**
- `401` — Invalid or expired refresh token

---

### POST /auth/logout
Logout (invalidate refresh token).

**Auth:** Required

**Response (204):** No content

---

### GET /auth/me
Get current authenticated user.

**Auth:** Required

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Smith",
  "role": "user",
  "createdAt": "2026-08-28T10:00:00Z"
}
```

**Errors:**
- `401` — Not authenticated

---

## Profile Endpoints

### POST /profiles
Create profile with face image.

**Auth:** Required

**Request (multipart/form-data):**
```
name: "John Smith"          (required)
bio: "Software engineer"    (optional)
website: "https://..."      (optional)
image: <face_image_file>    (required, JPEG/PNG/WebP, max 5MB)
consent: "true"             (required, must be "true")
```

**Response (201):**
```json
{
  "profile": {
    "id": "uuid",
    "name": "John Smith",
    "bio": "Software engineer",
    "website": "https://johnsmith.dev",
    "avatarPath": "/uploads/profiles/uuid/face.jpg",
    "consentGiven": true,
    "createdAt": "2026-08-28T10:05:00Z"
  },
  "faceEmbedding": {
    "id": "uuid",
    "modelVersion": "insightface_arcface",
    "confidence": 0.97
  }
}
```

**Errors:**
- `400` — Invalid input, consent not given
- `409` — Profile already exists for this user
- `413` — File too large (>5MB)
- `415` — Invalid file type
- `422` — No face detected in image

---

### GET /profiles/me
Get current user's profile.

**Auth:** Required

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "John Smith",
  "bio": "Software engineer",
  "website": "https://johnsmith.dev",
  "avatarPath": "/uploads/profiles/uuid/face.jpg",
  "consentGiven": true,
  "isPublic": true,
  "socialProfiles": [
    { "id": "uuid", "platform": "github", "url": "https://github.com/john", "username": "john" }
  ],
  "skills": [
    { "id": "uuid", "name": "TypeScript", "category": "language" }
  ],
  "projects": [
    { "id": "uuid", "name": "FaceID", "description": "Face identity platform", "url": "https://..." }
  ],
  "createdAt": "2026-08-28T10:05:00Z",
  "updatedAt": "2026-08-28T10:05:00Z"
}
```

**Errors:**
- `401` — Not authenticated
- `404` — Profile not found

---

### GET /profiles/:id
Get a public profile by ID.

**Auth:** Not required (public endpoint)

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Smith",
  "bio": "Software engineer",
  "website": "https://johnsmith.dev",
  "avatarPath": "/uploads/profiles/uuid/face.jpg",
  "socialProfiles": [...],
  "skills": [...],
  "projects": [...],
  "createdAt": "2026-08-28T10:05:00Z"
}
```

**Errors:**
- `404` — Profile not found or not public

---

### PUT /profiles/me
Update current user's profile.

**Auth:** Required

**Request:**
```json
{
  "name": "John A. Smith",
  "bio": "Updated bio",
  "website": "https://updated.dev",
  "isPublic": true
}
```

**Response (200):** Updated profile object

**Errors:**
- `401` — Not authenticated
- `404` — Profile not found

---

### DELETE /profiles/me
Delete current user's profile and all associated data.

**Auth:** Required

**Response (204):** No content

**Side Effects:**
- Deletes face embedding
- Deletes social profiles
- Deletes skills
- Deletes projects
- Deletes profile image from storage
- Logs deletion in audit_logs

**Errors:**
- `401` — Not authenticated
- `404` — Profile not found

---

### DELETE /profiles/me/face
Delete only the face embedding (profile remains).

**Auth:** Required

**Response (204):** No content

**Side Effects:**
- Face embedding removed
- Profile image deleted from storage
- Profile cannot be found via face search anymore

**Errors:**
- `401` — Not authenticated
- `404` — No face embedding found

---

## Social Profile Endpoints

### POST /profiles/me/social
Add a social link.

**Auth:** Required

**Request:**
```json
{
  "platform": "github",
  "url": "https://github.com/johnsmith",
  "username": "johnsmith"
}
```

**Valid Platforms:** `github`, `linkedin`, `instagram`, `x`, `facebook`, `website`, `other`

**Response (201):**
```json
{
  "id": "uuid",
  "platform": "github",
  "url": "https://github.com/johnsmith",
  "username": "johnsmith",
  "createdAt": "2026-08-28T10:10:00Z"
}
```

**Errors:**
- `400` — Invalid platform or URL
- `409` — Social profile already exists for this platform+URL
- `404` — Profile not found

---

### PUT /profiles/me/social/:id
Update a social link.

**Auth:** Required

**Request:**
```json
{
  "url": "https://github.com/johnsmith-updated",
  "username": "johnsmith-updated"
}
```

**Response (200):** Updated social profile object

**Errors:**
- `404` — Social profile not found
- `403` — Not the owner

---

### DELETE /profiles/me/social/:id
Delete a social link.

**Auth:** Required

**Response (204):** No content

**Errors:**
- `404` — Social profile not found
- `403` — Not the owner

---

## Skill Endpoints

### POST /profiles/me/skills
Add a skill.

**Auth:** Required

**Request:**
```json
{
  "name": "TypeScript",
  "category": "language"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "TypeScript",
  "category": "language"
}
```

**Errors:**
- `409` — Skill already exists
- `404` — Profile not found

---

### DELETE /profiles/me/skills/:id
Remove a skill.

**Auth:** Required

**Response (204):** No content

---

## Project Endpoints

### POST /profiles/me/projects
Add a project.

**Auth:** Required

**Request:**
```json
{
  "name": "FaceID Platform",
  "description": "Consent-based face identity platform",
  "url": "https://github.com/john/faceid"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "FaceID Platform",
  "description": "Consent-based face identity platform",
  "url": "https://github.com/john/faceid",
  "createdAt": "2026-08-28T10:15:00Z"
}
```

---

### PUT /profiles/me/projects/:id
Update a project.

**Auth:** Required

---

### DELETE /profiles/me/projects/:id
Delete a project.

**Auth:** Required

**Response (204):** No content

---

## Search Endpoints

### POST /search
Upload image and search for matching profiles.

**Auth:** Required (for tracking; search works without auth for MVP)

**Request (multipart/form-data):**
```
image: <search_image_file>  (required, JPEG/PNG/WebP, max 10MB)
```

**Response (200):**
```json
{
  "searchId": "uuid",
  "status": "completed",
  "processingTimeMs": 230,
  "totalFacesDetected": 1,
  "matches": [
    {
      "profileId": "uuid",
      "name": "John Smith",
      "bio": "Software engineer",
      "avatarPath": "/uploads/profiles/uuid/face.jpg",
      "similarity": 0.82,
      "confidence": "high",
      "website": "https://johnsmith.dev"
    },
    {
      "profileId": "uuid",
      "name": "Jane Doe",
      "bio": "Designer",
      "avatarPath": "/uploads/profiles/uuid/face.jpg",
      "similarity": 0.58,
      "confidence": "medium",
      "website": null
    }
  ],
  "disclaimer": "Face matching is probabilistic and not a guarantee of identity. Results only include voluntarily enrolled profiles."
}
```

**No Match Response (200):**
```json
{
  "searchId": "uuid",
  "status": "no_match",
  "processingTimeMs": 180,
  "totalFacesDetected": 1,
  "matches": [],
  "message": "No confident match found.",
  "disclaimer": "Face matching is probabilistic and not a guarantee of identity. Results only include voluntarily enrolled profiles."
}
```

**Errors:**
- `400` — Invalid file type or missing image
- `413` — File too large (>10MB)
- `415` — Invalid file type
- `422` — No face detected in image
- `429` — Rate limit exceeded
- `500` — Processing error

**Side Effects:**
- Search image deleted after processing
- Search request logged in search_requests table
- Results logged in search_results table

---

### GET /search/history
Get current user's search history.

**Auth:** Required

**Query Parameters:**
```
page    (int, default 1)
limit   (int, default 20, max 100)
```

**Response (200):**
```json
{
  "searches": [
    {
      "id": "uuid",
      "status": "completed",
      "totalResults": 2,
      "processingTimeMs": 230,
      "createdAt": "2026-08-28T10:20:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 1
}
```

---

## Error Response Format

```json
{
  "error": {
    "code": "FACE_NOT_DETECTED",
    "message": "No face was detected in the uploaded image",
    "details": "Please upload a clear, front-facing photo with good lighting"
  }
}
```

## Standard Error Codes

| HTTP | Code | Description |
|------|------|-------------|
| 400 | `INVALID_INPUT` | Malformed request |
| 400 | `MISSING_FIELD` | Required field missing |
| 400 | `WEAK_PASSWORD` | Password doesn't meet requirements |
| 401 | `UNAUTHORIZED` | Invalid or missing authentication |
| 401 | `TOKEN_EXPIRED` | JWT token has expired |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource doesn't exist |
| 409 | `CONFLICT` | Resource already exists |
| 409 | `DUPLICATE_EMAIL` | Email already registered |
| 409 | `PROFILE_EXISTS` | User already has a profile |
| 413 | `FILE_TOO_LARGE` | File exceeds size limit |
| 415 | `UNSUPPORTED_MEDIA` | Invalid file type |
| 422 | `FACE_NOT_DETECTED` | No face found in image |
| 422 | `CONSENT_REQUIRED` | Enrollment consent not given |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `AI_SERVICE_UNAVAILABLE` | Face detection service down |

---

## API Dependency Audit

| API / Service | Purpose | Required? | Free? | Open Source? | Local Alternative | Fallback |
|--------------|---------|-----------|-------|-------------|-------------------|----------|
| InsightFace | Face detection + embedding | Yes | Yes | BSD-3 | face_recognition (MIT) | — |
| OpenCV | Image processing | Yes | Yes | Apache 2.0 | Pillow | — |
| PostgreSQL | Database | Yes | Yes | PostgreSQL License | SQLite (limited pgvector) | — |
| pgvector | Vector search | Yes | Yes | PostgreSQL License | — | — |
| bcrypt | Password hashing | Yes | Yes | MIT | argon2 | — |
| jsonwebtoken | JWT tokens | Yes | Yes | MIT | jose | — |
| Redis | Session/cache | No | Yes | BSD-3 | In-memory Map | Skip for MVP |
| Supabase Auth | OAuth (optional) | No | Free tier | Apache 2.0 | Custom JWT | Not needed |
| Supabase Storage | File storage (optional) | No | Free tier | Apache 2.0 | Local filesystem | Local fs |

**Conclusion:** The entire core MVP can be built with free and open-source software. No paid API is required.
