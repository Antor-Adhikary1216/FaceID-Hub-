# Face Identity Platform — Database Schema

## Overview

PostgreSQL 15 with pgvector extension. All tables use UUID primary keys, timestamps, and soft deletion where appropriate.

## Extension Setup

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
```

## Tables

### 1. users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'user'
                    CHECK (role IN ('admin', 'user')),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
```

### 2. profiles

```sql
CREATE TABLE profiles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    bio             TEXT,
    website         VARCHAR(500),
    avatar_path     VARCHAR(500),
    consent_given   BOOLEAN NOT NULL DEFAULT false,
    consent_at      TIMESTAMPTZ,
    is_public       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_profiles_user ON profiles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_name ON profiles(name) WHERE deleted_at IS NULL;
```

### 3. face_embeddings

```sql
CREATE TABLE face_embeddings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id      UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    embedding       vector(512) NOT NULL,
    model_version   VARCHAR(50) NOT NULL DEFAULT 'insightface_arcface',
    image_width     INTEGER NOT NULL,
    image_height    INTEGER NOT NULL,
    bbox_x          INTEGER NOT NULL,
    bbox_y          INTEGER NOT NULL,
    bbox_width      INTEGER NOT NULL,
    bbox_height     INTEGER NOT NULL,
    confidence      FLOAT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_face_embeddings_profile ON face_embeddings(profile_id);

-- HNSW index for fast cosine similarity search
CREATE INDEX idx_face_embeddings_vector ON face_embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
```

### 4. social_profiles

```sql
CREATE TABLE social_profiles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform        VARCHAR(50) NOT NULL
                    CHECK (platform IN ('github', 'linkedin', 'instagram', 'x', 'facebook', 'website', 'other')),
    url             VARCHAR(500) NOT NULL,
    username        VARCHAR(255),
    display_name    VARCHAR(255),
    is_public       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_social_profiles_profile ON social_profiles(profile_id);
CREATE UNIQUE INDEX idx_social_profiles_platform_url ON social_profiles(profile_id, platform, url);
```

### 5. skills

```sql
CREATE TABLE skills (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    category        VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skills_profile ON skills(profile_id);
CREATE UNIQUE INDEX idx_skills_profile_name ON skills(profile_id, name);
```

### 6. projects

```sql
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    url             VARCHAR(500),
    image_url       VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_profile ON projects(profile_id);
```

### 7. search_requests

```sql
CREATE TABLE search_requests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    query_image_path VARCHAR(500),
    query_embedding  vector(512),
    total_results   INTEGER NOT NULL DEFAULT 0,
    processing_time_ms INTEGER,
    status          VARCHAR(20) NOT NULL DEFAULT 'processing'
                    CHECK (status IN ('processing', 'completed', 'failed', 'no_match')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_requests_user ON search_requests(user_id);
CREATE INDEX idx_search_requests_created ON search_requests(created_at);
```

### 8. search_results

```sql
CREATE TABLE search_results (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    search_id       UUID NOT NULL REFERENCES search_requests(id) ON DELETE CASCADE,
    profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    similarity      FLOAT NOT NULL,
    confidence      VARCHAR(20) NOT NULL
                    CHECK (confidence IN ('high', 'medium', 'low')),
    rank            INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_results_search ON search_results(search_id);
CREATE INDEX idx_search_results_profile ON search_results(profile_id);
```

### 9. audit_logs

```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,
    target_type     VARCHAR(50),
    target_id       UUID,
    metadata        JSONB DEFAULT '{}',
    ip_address      INET,
    user_agent      VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

## Relationships

```
users 1──1 profiles
profiles 1──1 face_embeddings
profiles 1──N social_profiles
profiles 1──N skills
profiles 1──N projects
users 1──N search_requests
search_requests 1──N search_results
profiles 1──N search_results
users 1──N audit_logs
```

## Soft Deletion

Tables with `deleted_at`: users, profiles
- Queries filter: `WHERE deleted_at IS NULL`
- Cascade: Deleting a user soft-deletes their profile
- Hard delete: Admin action or retention policy

## Data Retention

| Data | Retention | Policy |
|------|-----------|--------|
| Search query images | Deleted after processing | Automatic |
| Search request records | 90 days | Automatic cleanup |
| Audit logs | 365 days | Automatic cleanup |
| User profiles | Until user deletion | User-initiated |
| Face embeddings | Until profile deletion | User-initiated |

## Seed Data

```sql
-- Default admin user (password: admin123 - change in production)
INSERT INTO users (email, password_hash, full_name, role)
VALUES (
    'admin@faceid.local',
    '$2b$12$LJ3m4ys3Lhdo5OJmR7KZYeQxKtGhGzRkYzN5r4VbJ8kX2cV7eB9aO',
    'Admin',
    'admin'
);
```
