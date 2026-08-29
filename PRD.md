# Face Identity Platform — Product Requirements Document

## 1. Product Vision

A consent-based face identity and public-profile discovery platform. A person uploads a photograph, the system searches only within a database of voluntarily enrolled profiles, and returns possible matches with a confidence indication — or explicitly states "No confident match found."

The system must never be used to secretly identify strangers or scrape private information.

## 2. Problem Statement

People often meet others in professional or social contexts but cannot recall or find their public profile. Current solutions either:
- Require knowing a username already
- Involve scraping private data without consent
- Provide no face-based lookup

This platform provides a **consent-first** alternative: users voluntarily enroll, and searchers can only find those who chose to be findable.

## 3. Target Users

| Persona | Description | Primary Need |
|---------|-------------|-------------|
| **Enroller** | Professional who wants to be discoverable | Create a public profile linked to their face |
| **Searcher** | Someone who met a person and wants to find their profile | Search by photo to find the enrolled profile |
| **Admin** | Platform operator | Manage users, monitor abuse, review audit logs |

## 4. Product Goals

1. **Consent-first:** No profile exists without explicit user enrollment
2. **Accurate matching:** High-confidence face matching with configurable thresholds
3. **Transparent:** Results labeled as "possible match," never as absolute identity proof
4. **Private:** No social scraping, no hidden profiles, no surprise identification
5. **Free/open-source:** Entire stack runnable locally without paid services
6. **Production-ready:** Proper auth, validation, error handling, testing

## 5. Non-Goals

| Non-Goal | Reason |
|----------|--------|
| Identifying random strangers | Violates privacy, not consent-based |
| Scraping social media | Against platform policies, violates consent |
| Surveillance or tracking | Not a monitoring tool |
| Real-time video analysis | Out of scope for MVP |
| Mobile native apps | Web-only for MVP |
| Multi-language support | English only for MVP |
| Paid API integrations | Free/open-source only |

## 6. User Stories

### Enroller Stories
- As an enroller, I want to register an account so my profile is linked to me
- As an enroller, I want to create a profile with my name, bio, and links so people can find me
- As an enroller, I want to upload a face photo so the system can match me
- As an enroller, I want to add my GitHub, LinkedIn, Instagram, X, and website links
- As an enroller, I want to add my skills and projects
- As an enroller, I want to edit my profile at any time
- As an enroller, I want to delete my profile and all biometric data
- As an enroller, I want to understand exactly what data is stored

### Searcher Stories
- As a searcher, I want to upload a photo to find someone's enrolled profile
- As a searcher, I want to see confidence levels for matches
- As a searcher, I want to see "No confident match found" when no match exists
- As a searcher, I want to understand that matches are probabilistic, not proof

### Admin Stories
- As an admin, I want to see all enrolled profiles
- As an admin, I want to see search activity logs
- As an admin, I want to remove abusive accounts

## 7. Functional Requirements

### 7.1 Authentication
- **FR-AUTH-01:** Users can register with email and password
- **FR-AUTH-02:** Users can log in and receive JWT tokens
- **FR-AUTH-03:** Users can log out
- **FR-AUTH-04:** Passwords are bcrypt-hashed (cost 12)
- **FR-AUTH-05:** JWT tokens expire after 1 hour; refresh token after 30 days

### 7.2 Profile Enrollment
- **FR-ENROLL-01:** Users can create a profile with: name, bio, website
- **FR-ENROLL-02:** Users can upload a profile face image (JPEG, PNG, WebP)
- **FR-ENROLL-03:** System detects face, generates 512-d embedding, stores it
- **FR-ENROLL-04:** Users can add social links: GitHub, Instagram, Facebook, X, LinkedIn, other
- **FR-ENROLL-05:** Users can add skills (tags)
- **FR-ENROLL-06:** Users can add projects (name, description, URL)
- **FR-ENROLL-07:** Users can update any part of their profile
- **FR-ENROLL-08:** Users can delete their profile and all associated data
- **FR-ENROLL-09:** Users can delete their face embedding specifically
- **FR-ENROLL-10:** System prevents duplicate enrollment (same user)
- **FR-ENROLL-11:** Profile images max 5MB, JPEG/PNG/WebP only

### 7.3 Face Search
- **FR-SEARCH-01:** Users can upload an image to search for matching profiles
- **FR-SEARCH-02:** System detects face(s) in search image
- **FR-SEARCH-03:** System generates embedding for detected face(s)
- **FR-SEARCH-04:** System performs vector similarity search against enrolled embeddings
- **FR-SEARCH-05:** Results include confidence level: High / Medium / Low / No Match
- **FR-SEARCH-06:** "No confident match found" displayed when below threshold
- **FR-SEARCH-07:** Search images are deleted after processing
- **FR-SEARCH-08:** Search images are never stored permanently
- **FR-SEARCH-09:** Multiple candidates can be returned, ranked by similarity
- **FR-SEARCH-10:** Search images max 10MB, JPEG/PNG/WebP only

### 7.4 Profile Management
- **FR-PROF-01:** Users can view their own profile
- **FR-PROF-02:** Other users can view public profiles (name, bio, links, skills, projects)
- **FR-PROF-03:** Users can edit their profile information
- **FR-PROF-04:** Users can manage social links (add, edit, remove)
- **FR-PROF-05:** Users can manage skills
- **FR-PROF-06:** Users can manage projects

### 7.5 Privacy Controls
- **FR-PRIV-01:** Enrollment requires explicit consent acknowledgment
- **FR-PRIV-02:** Users can delete their account and all data
- **FR-PRIV-03:** Users can delete only their face embedding
- **FR-PRIV-04:** System explains what face data is stored before enrollment
- **FR-PRIV-05:** Face embeddings are never exposed in API responses
- **FR-PRIV-06:** Search images are never stored permanently
- **FR-PRIV-07:** Audit logs track all face-related operations

## 8. Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Search latency | < 500ms (p95) |
| Performance | Embedding generation | < 200ms per face |
| Performance | API response time | < 200ms (p95) for non-AI endpoints |
| Security | Authentication | JWT with refresh tokens |
| Security | Rate limiting | 100 req/min general, 10 req/min auth |
| Security | File validation | MIME + magic bytes + size check |
| Security | SQL injection | Parameterized queries (Drizzle ORM) |
| Security | XSS | Helmet headers + React escaping |
| Availability | Uptime | 99.5% for MVP |
| Scalability | Enrolled profiles | 10,000+ profiles |
| Scalability | Concurrent searches | 50+ simultaneous |
| Privacy | Data deletion | Complete within 24 hours of request |
| Privacy | Embedding exposure | Never in API responses |
| Testing | Unit test coverage | > 80% |
| Testing | Integration tests | All API endpoints |
| Deployment | Docker | Full docker-compose setup |
| Deployment | Local dev | Complete without paid services |

## 9. Match Confidence Behavior

| Similarity Score | Label | Display |
|-----------------|-------|---------|
| > 0.70 | High | Green badge: "High confidence match" |
| 0.50 – 0.70 | Medium | Yellow badge: "Possible match" |
| 0.35 – 0.50 | Low | Orange badge: "Low confidence — may not be the same person" |
| < 0.35 | — | "No confident match found" |

**Mandatory Disclaimers:**
- "Face matching is probabilistic and not a guarantee of identity"
- "Matches are based on visual similarity of enrolled profiles only"
- "This system only searches within voluntarily enrolled profiles"

## 10. Error States

| State | User Message |
|-------|-------------|
| No face detected | "No face was detected in the image. Please try a clearer photo." |
| Multiple faces | "Multiple faces detected. Processing the most prominent face." |
| Face too small | "The face is too small. Please use a closer or higher-resolution photo." |
| Image too dark | "The image is too dark. Please use better lighting." |
| Upload failed | "Upload failed. Please check your connection and try again." |
| Search timeout | "Search took too long. Please try again." |
| No match | "No confident match found." |
| Profile not found | "This profile does not exist or has been removed." |

## 11. Empty States

| State | Display |
|-------|---------|
| No enrolled profiles | "No profiles enrolled yet. Be the first!" |
| No search results | "No confident match found. This person may not be enrolled." |
| No social links | "No social links added yet." |
| No skills | "No skills listed yet." |
| No projects | "No projects listed yet." |

## 12. MVP Scope

### In Scope
- [ ] User registration and login
- [ ] Profile creation and editing
- [ ] Face image upload and embedding generation
- [ ] Social link management (GitHub, Instagram, LinkedIn, X, Facebook, custom)
- [ ] Skills management
- [ ] Projects management
- [ ] Face search with confidence scoring
- [ ] "No match" handling
- [ ] Profile deletion (with biometric data deletion)
- [ ] Audit logging
- [ ] Rate limiting
- [ ] Docker setup
- [ ] Unit and integration tests

### Out of Scope (Future)
- OAuth/SSO login
- Mobile native apps
- Real-time video search
- Batch search
- Admin dashboard UI
- Email notifications
- API documentation portal
- Multi-language support
- Premium features
- Social media API integrations

## 13. Acceptance Criteria

The MVP is complete when:

1. A user can register and log in
2. A user can create a profile with name, bio, website
3. A user can upload a face image and embedding is generated
4. A user can add social links, skills, and projects
5. A user can search by uploading a photo
6. Vector similarity search returns ranked results with confidence levels
7. "No confident match found" works correctly
8. Users can delete their profile and all biometric data
9. Search images are deleted after processing
10. No paid API is required for core functionality
11. All tests pass
12. Docker Compose starts all services
13. Seven documentation files exist and are accurate
