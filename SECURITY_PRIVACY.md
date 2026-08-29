# Face Identity Platform — Security & Privacy

## 1. Threat Model

### 1.1 Assets to Protect
- User passwords (bcrypt hashes)
- Face embeddings (512-d vectors — biometric data)
- Profile data (PII: name, bio, links)
- Search query images (temporary — deleted after processing)
- JWT tokens (access + refresh)
- Audit logs

### 1.2 Threat Actors
| Actor | Motivation | Attack Vector |
|-------|-----------|---------------|
| Malicious user | Enroll others' faces without consent | Upload stolen photos |
| Abuser | Scrape profile data at scale | API abuse, scraping |
| Attacker | Steal biometric data | Database breach, API exploit |
| Impersonator | Bypass authentication | Token theft, brute force |
| Insider | Access unauthorized data | Privilege escalation |

### 1.3 Trust Boundaries
```
[Internet] → [Rate Limiter] → [Auth] → [Application] → [Database]
                                         ↓
                                    [AI Service] (internal network only)
```

## 2. Biometric Data Handling

### 2.1 What We Store
| Data | Stored? | Format | Retention |
|------|---------|--------|-----------|
| Raw face image (enrollment) | Yes (temporarily) | File on disk | Until embedding generated, then kept as avatar |
| Face embedding | Yes | vector(512) in PostgreSQL | Until profile deleted |
| Search query image | No | Deleted after processing | Immediate |
| Bounding box coordinates | Yes | Integer coordinates | With embedding |

### 2.2 What We Never Store
- Facial landmarks as persistent data
- Age, gender, or emotion predictions
- Race or ethnicity data
- Biometric templates from other systems
- Third-party biometric data

### 2.3 Biometric Data Protection
- Embeddings never exposed in API responses
- Embeddings encrypted at rest (PostgreSQL TDE)
- No embedding data in logs
- Access to embeddings restricted to search service only
- Deletion is immediate and complete (not soft delete)

## 3. Consent Model

### 3.1 Enrollment Consent
Before face enrollment, user must:
1. Read a clear explanation of what data is collected
2. Understand how their face embedding will be used
3. Explicitly check a consent checkbox
4. Consent timestamp is recorded

**Consent Text:**
> By enrolling your face, you agree to have a mathematical representation (embedding) of your face stored in our database. This embedding is used solely for matching when someone searches for a profile. Your face image is stored as your profile photo. You can delete your profile and all biometric data at any time from your account settings. Your data is never shared with third parties.

### 3.2 Search Consent
When searching, users are informed:
- Their search image is processed and immediately deleted
- Results only include voluntarily enrolled profiles
- Matches are probabilistic, not proof of identity

### 3.3 Consent Withdrawal
- User can delete profile at any time
- Deletion removes: embedding, social profiles, skills, projects, avatar image
- Deletion is irreversible
- Audit log entry retained (anonymized)

## 4. Authentication Security

### 4.1 Password Policy
- Minimum 8 characters
- Must contain: uppercase, lowercase, number
- Hashed with bcrypt (cost factor 12)
- No password hints stored
- No plaintext passwords in logs

### 4.2 JWT Security
```
Access Token:
  - Algorithm: HS256
  - Expiry: 1 hour
  - Claims: sub (user_id), role, iat, exp
  - Signed with server-side secret (256-bit random)

Refresh Token:
  - Stored in httpOnly cookie
  - Expiry: 30 days
  - Single-use (rotated on refresh)
  - Invalidated on logout
```

### 4.3 Token Handling
- Tokens never in localStorage (httpOnly cookie for refresh)
- Access token in memory only (React state)
- Tokens never in URL parameters
- Tokens never logged
- Expired tokens rejected with 401

### 4.4 Session Management
- One active session per user (MVP)
- Logout invalidates refresh token
- Password change invalidates all tokens
- Account deletion invalidates all tokens

## 5. Authorization (RBAC)

| Action | Unauthenticated | User | Admin |
|--------|----------------|------|-------|
| Register/Login | ✅ | ✅ | ✅ |
| View public profiles | ✅ | ✅ | ✅ |
| Search (face) | ✅* | ✅ | ✅ |
| Create profile | ❌ | ✅ | ✅ |
| Edit own profile | ❌ | ✅ | ✅ |
| Delete own profile | ❌ | ✅ | ✅ |
| View own search history | ❌ | ✅ | ✅ |
| View all profiles | ❌ | ❌ | ✅ |
| Delete any profile | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ✅ |

*Search requires authentication for tracking purposes but core search works without auth for MVP.

## 6. Input Validation

### 6.1 File Upload Validation
```
Validation steps:
1. Check Content-Type header (MIME)
2. Check magic bytes (file signature)
3. Check file size (max 5MB profile, 10MB search)
4. Check image dimensions (min 100x100, max 8192x8192)
5. Attempt to decode with OpenCV
6. Verify decoded image is valid
```

**Accepted Types:**
- image/jpeg (magic: FF D8 FF)
- image/png (magic: 89 50 4E 47)
- image/webp (magic: 52 49 46 46 ... 57 45 42 50)

### 6.2 API Input Validation
- All inputs validated via Zod schemas
- String lengths enforced
- Email format validated
- URL format validated for social links
- Enum values restricted for platforms
- SQL injection prevented (Drizzle ORM parameterized queries)
- XSS prevented (React escaping + Helmet headers)

### 6.3 Rate Limiting
```
Endpoint Category    Limit        Window
Auth endpoints       10 req       1 minute
Profile creation     5 req        1 hour
Face search          30 req       1 minute
General API          100 req      1 minute
File uploads         20 req       1 minute
```

## 7. File Upload Security

### 7.1 Upload Directory Security
```
uploads/
├── profiles/{user_id}/     # User-specific directory
│   └── face.jpg            # Profile image
└── temp/                   # Temporary search images
    └── {uuid}.jpg          # Deleted after processing
```

- Upload directory outside web root
- No script execution in upload directory
- Random filenames (UUID) to prevent path traversal
- File permissions: 644 (read-only for web)

### 7.2 Image Processing Security
- OpenCV used for image decoding (not raw file parsing)
- Image re-encoded after processing (strips EXIF, metadata)
- Maximum dimensions enforced before processing
- Memory limits on image processing

## 8. SQL Injection Prevention

- All queries via Drizzle ORM (parameterized)
- No raw SQL with user input
- Input sanitization on all string fields
- Database user has minimal privileges

## 9. XSS Prevention

- React auto-escapes all rendered content
- Content-Security-Policy header configured
- No `dangerouslySetInnerHTML` with user content
- Helmet.js security headers

**Security Headers:**
```
Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

## 10. SSRF Prevention

- No user-controlled URLs fetched by server
- Social profile URLs stored but not fetched (MVP)
- If URL fetching added later: validate URL scheme (http/https only), block internal IPs

## 11. API Abuse Prevention

- Rate limiting per IP and per user
- Request size limits (10MB max)
- Timeout on AI processing (10 seconds)
- Maximum concurrent requests per user (5)
- Search image deletion prevents storage abuse
- Audit logging for anomaly detection

## 12. Vector Data Protection

- Embeddings never exposed in API responses
- Search results return profile info, not raw vectors
- Embeddings deleted on profile deletion
- No embedding data in error messages
- Embedding computation done in isolated AI service

## 13. Logging

### 13.1 What We Log
```
Auth events:     register, login, logout, token_refresh
Profile events:  create, update, delete, face_enroll, face_delete
Search events:   search_request, search_result (anonymized)
System events:   errors, warnings, performance metrics
```

### 13.2 What We Never Log
- Passwords or password hashes
- JWT tokens
- Face embeddings
- Raw image data
- Social profile URLs (only platform names)
- Full IP addresses (last octet masked)

### 13.3 Log Format
```json
{
  "timestamp": "2026-08-28T10:00:00Z",
  "level": "info",
  "action": "user.register",
  "userId": "uuid",
  "ip": "192.168.1.xxx",
  "userAgent": "Mozilla/5.0...",
  "metadata": {}
}
```

## 14. Data Retention

| Data | Retention | Deletion Method |
|------|-----------|-----------------|
| User accounts | Until deleted by user | Hard delete |
| Profiles | Until deleted by user | Hard delete + cascade |
| Face embeddings | Until profile deleted | Hard delete |
| Search query images | Immediate | Auto-delete after processing |
| Search request records | 90 days | Automated cleanup |
| Audit logs | 365 days | Automated cleanup |
| Temporary files | 24 hours | Automated cleanup |

## 15. Account Deletion

### 15.1 User-Initiated Deletion
```
DELETE /profiles/me
→ Deletes:
  - Profile record
  - Face embedding
  - All social profiles
  - All skills
  - All projects
  - Profile image from storage
  - Soft-deletes user account
→ Anonymizes audit logs (keeps action, removes user ID)
```

### 15.2 Admin-Initiated Deletion
```
DELETE /admin/users/:id
→ Hard deletes user and all associated data
→ Removes all embeddings
→ Removes all files
```

### 15.3 Data Deletion Verification
- Deletion is immediate (not queued)
- No recovery mechanism (by design)
- Confirmation required (double-click or password)

## 16. Privacy Policy Requirements

The platform must have a privacy policy that covers:

1. **Data Controller:** Identity of the platform operator
2. **Data Collected:** Face images, face embeddings, profile information, search metadata
3. **Purpose:** Face matching for profile discovery
4. **Legal Basis:** Consent
5. **Data Storage:** Where data is stored, encryption
6. **Data Sharing:** No third-party sharing
7. **Data Retention:** How long each type of data is kept
8. **User Rights:** Access, deletion, portability
9. **Contact:** How to contact the data controller
10. **Changes:** How policy changes are communicated

## 17. Incident Handling

### 17.1 Response Plan
1. **Detect** — Automated monitoring + user reports
2. **Contain** — Revoke compromised credentials, block attack vector
3. **Eradicate** — Remove threat, patch vulnerability
4. **Recover** — Restore from backups if needed
5. **Notify** — Inform affected users within 72 hours
6. **Review** — Post-incident analysis, update procedures

### 17.2 Breach Classification
| Severity | Example | Response Time |
|----------|---------|---------------|
| Critical | Database breach, embedding exposure | Immediate |
| High | Authentication bypass, data leak | < 4 hours |
| Medium | Rate limit bypass, minor data exposure | < 24 hours |
| Low | Log injection, minor vulnerability | < 72 hours |

## 18. Security Testing

| Test | Frequency | Tool |
|------|-----------|------|
| SAST | Every commit | ESLint security rules, Bandit (Python) |
| Dependency scan | Daily | npm audit, pip-audit |
| DAST | Weekly | OWASP ZAP |
| Penetration test | Quarterly | External auditor |
| Code review | Every PR | Manual review |

## 19. Infrastructure Security

### Container Security
- Non-root containers
- Read-only filesystem where possible
- Resource limits (CPU, memory)
- No privileged containers
- Regular base image updates

### Network Security
- AI service accessible only within Docker network
- Database not exposed to internet
- HTTPS in production (Let's Encrypt)
- CORS whitelist: frontend origin only

### Secrets Management
- Environment variables (not in code)
- `.env` file not committed to git
- Docker secrets for production
- Key rotation every 90 days
