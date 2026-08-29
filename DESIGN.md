# Face Identity Platform — Design Document

## 1. Design Philosophy

Professional, minimal, and trustworthy. The design communicates that this is a serious privacy-respecting platform. Clean typography, ample whitespace, restrained color palette. Every element serves a purpose.

**Design Principles:**
- **Clarity over decoration:** Information hierarchy drives layout
- **Trust through transparency:** Privacy notices integrated naturally
- **Consent-forward:** Enrollment flow clearly explains data usage
- **Accessible:** WCAG 2.1 AA compliance
- **Responsive:** Mobile-first, scales to desktop

## 2. Information Architecture

```
┌─────────────────────────────────────────────┐
│  Logo    Home    Search    Enroll    Login   │
├─────────────────────────────────────────────┤
│                                             │
│  Home Page                                  │
│  ├── Hero: "Find Public Profiles by Face"   │
│  ├── Search Widget (upload image)           │
│  ├── How It Works                           │
│  └── Privacy Statement                      │
│                                             │
│  Search Results Page                        │
│  ├── Query Image Preview                   │
│  ├── Match Results (cards)                 │
│  └── Disclaimer Banner                     │
│                                             │
│  Profile Page (public)                     │
│  ├── Profile Image + Name                 │
│  ├── Bio                                  │
│  ├── Social Links                          │
│  ├── Skills                               │
│  └── Projects                              │
│                                             │
│  Dashboard (authenticated)                 │
│  ├── My Profile                            │
│  ├── Edit Profile                          │
│  ├── Search History                        │
│  └── Account Settings                      │
│                                             │
│  Auth Pages                                │
│  ├── Login                                │
│  └── Register                              │
│                                             │
└─────────────────────────────────────────────┘
```

## 3. Navigation

### Top Navigation (Unauthenticated)
```
[Logo] FaceID    Search    Enroll    [Login] [Sign Up]
```

### Top Navigation (Authenticated)
```
[Logo] FaceID    Search    Enroll    [Dashboard] [Avatar ▼]
                                                    ├── My Profile
                                                    ├── Settings
                                                    └── Logout
```

### Mobile Navigation
```
[≡] → Slide-out drawer with same links
```

## 4. Page Structure

### 4.1 Home Page
```
┌─────────────────────────────────────────────┐
│  [Nav Bar]                                  │
├─────────────────────────────────────────────┤
│                                             │
│         Find Public Profiles by Face        │
│   Upload a photo to search enrolled profiles│
│                                             │
│   ┌─────────────────────────────────┐       │
│   │  ┌───────────────────────────┐  │       │
│   │  │                           │  │       │
│   │  │   [Drop image or click]   │  │       │
│   │  │                           │  │       │
│   │  └───────────────────────────┘  │       │
│   │       [Search]                  │       │
│   └─────────────────────────────────┘       │
│                                             │
│   🔒 Your search images are never stored    │
│                                             │
├─────────────────────────────────────────────┤
│  How It Works                               │
│  [1] Upload → [2] Detect → [3] Match → [4] │
├─────────────────────────────────────────────┤
│  Privacy First                              │
│  Only voluntarily enrolled profiles appear  │
├─────────────────────────────────────────────┤
│  [Footer]                                   │
└─────────────────────────────────────────────┘
```

### 4.2 Search Results Page
```
┌─────────────────────────────────────────────┐
│  [Nav Bar]                                  │
├─────────────────────────────────────────────┤
│  ← Back to Search                           │
│                                             │
│  Search Results                             │
│  ┌──────────┐                               │
│  │ [Query]  │  Processing time: 230ms       │
│  └──────────┘                               │
│                                             │
│  Possible Matches (2)                       │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ [Profile Photo]  John Smith         │    │
│  │                  High Confidence    │    │
│  │                  Software Engineer  │    │
│  │                  [View Profile →]   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ [Profile Photo]  Jane Doe           │    │
│  │                  Medium Confidence  │    │
│  │                  Designer           │    │
│  │                  [View Profile →]   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ⚠️ Face matching is probabilistic and      │
│     not a guarantee of identity.            │
│                                             │
├─────────────────────────────────────────────┤
│  [Footer]                                   │
└─────────────────────────────────────────────┘
```

### 4.3 Profile Page (Public)
```
┌─────────────────────────────────────────────┐
│  [Nav Bar]                                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐                               │
│  │  [Photo] │  John Smith                   │
│  │          │  Software Engineer            │
│  └──────────┘  Building cool things         │
│                                             │
│  🌐 johnsmith.dev                           │
│                                             │
│  About                                      │
│  Full-stack developer passionate about...   │
│                                             │
│  Skills                                     │
│  [TypeScript] [React] [Node.js] [Python]   │
│                                             │
│  Projects                                   │
│  ┌─────────────────────────────────────┐    │
│  │ FaceID Platform                     │    │
│  │ Consent-based face identity...      │    │
│  │ [GitHub] [Live Demo]               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Connect                                     │
│  [GitHub] [LinkedIn] [Instagram] [X]       │
│                                             │
├─────────────────────────────────────────────┤
│  [Footer]                                   │
└─────────────────────────────────────────────┘
```

### 4.4 Dashboard (Authenticated)
```
┌─────────────────────────────────────────────┐
│  [Nav Bar]                                  │
├────────────┬────────────────────────────────┤
│  Sidebar   │  Dashboard                     │
│            │                                │
│  My Profile│  Welcome back, John!           │
│  Settings  │                                │
│  Searches  │  Profile Status: ✅ Enrolled   │
│  Logout    │  Last updated: 2 days ago     │
│            │                                │
│            │  Quick Actions                 │
│            │  [Edit Profile] [Search Again] │
│            │                                │
│            │  Recent Searches              │
│            │  (if any)                      │
├────────────┴────────────────────────────────┤
│  [Footer]                                   │
└─────────────────────────────────────────────┘
```

### 4.5 Enroll Page
```
┌─────────────────────────────────────────────┐
│  [Nav Bar]                                  │
├─────────────────────────────────────────────┤
│                                             │
│  Create Your Profile                        │
│                                             │
│  Step 1: Basic Info                         │
│  ┌─────────────────────────────────────┐    │
│  │ Name *                              │    │
│  │ [________________________]          │    │
│  │ Bio                                 │    │
│  │ [________________________]          │    │
│  │ Website                             │    │
│  │ [________________________]          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Step 2: Face Photo                         │
│  ┌─────────────────────────────────────┐    │
│  │  ┌───────────────────────────┐      │    │
│  │  │  [Drop face photo here]   │      │    │
│  │  └───────────────────────────┘      │    │
│  │  📷 Clear, front-facing photo       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Step 3: Social Links                       │
│  ┌─────────────────────────────────────┐    │
│  │ GitHub    [________________________]│    │
│  │ LinkedIn  [________________________]│    │
│  │ Instagram [________________________]│    │
│  │ X         [________________________]│    │
│  │ Facebook  [________________________]│    │
│  │ Website   [________________________]│    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Step 4: Skills & Projects                  │
│  [Add Skill]  [Add Project]                 │
│                                             │
│  ⚠️ Consent Notice                          │
│  By enrolling, you agree to have your face │
│  embedding stored for matching purposes.    │
│  You can delete this data anytime.          │
│                                             │
│  [☐ I understand and consent]              │
│                                             │
│  [Cancel]  [Create Profile]                 │
│                                             │
├─────────────────────────────────────────────┤
│  [Footer]                                   │
└─────────────────────────────────────────────┘
```

## 5. Component System

### 5.1 Base Components

**Button**
```
Variants: primary, secondary, ghost, danger
Sizes: sm (32px), md (40px), lg (48px)
States: default, hover, active, disabled, loading
```

**Input**
```
Types: text, email, password, url, textarea
States: default, focus, error, disabled
Features: label, helper text, error message, icon prefix
```

**Card**
```
Variants: default, elevated, outlined
Padding: sm (12px), md (16px), lg (24px)
Border radius: 12px
```

**Badge**
```
Variants: success (green), warning (yellow), danger (red), info (blue), neutral (gray)
Sizes: sm, md
```

**Avatar**
```
Sizes: xs (24px), sm (32px), md (40px), lg (64px), xl (128px)
Fallback: initials or icon
```

**Modal**
```
Sizes: sm (400px), md (560px), lg (720px)
Features: close on escape, close on backdrop click, focus trap
```

**Toast**
```
Variants: success, error, warning, info
Position: top-right
Auto-dismiss: 5 seconds
```

### 5.2 Face-Specific Components

**UploadZone**
```
States: idle, hover, uploading, success, error
Features: drag & drop, click to browse, preview, progress bar
Constraints: max size, accepted types, dimensions
```

**FacePreview**
```
Features: crop preview, face detection overlay, confidence indicator
States: detecting, detected, error
```

**MatchCard**
```
Features: profile photo, name, confidence badge, profile link
Variants: high, medium, low match
```

**ConfidenceBadge**
```
High: green, "High Confidence"
Medium: yellow, "Possible Match"
Low: orange, "Low Confidence"
```

## 6. Layout System

**Grid:** 12-column CSS Grid
**Max width:** 1200px centered
**Breakpoints:**
```
Mobile:  < 640px   → 1 column, stacked
Tablet:  640-1024px → 2 columns
Desktop: > 1024px   → full layout
```

**Spacing Scale (Tailwind):**
```
0: 0px, 1: 4px, 2: 8px, 3: 12px, 4: 16px,
5: 20px, 6: 24px, 8: 32px, 10: 40px, 12: 48px, 16: 64px
```

## 7. Typography

**Font:** Inter (Google Fonts, free)

```
Heading 1: 36px / 700 weight / -0.02em tracking
Heading 2: 28px / 600 weight / -0.01em tracking
Heading 3: 22px / 600 weight
Heading 4: 18px / 600 weight
Body:      16px / 400 weight / 1.6 line-height
Small:     14px / 400 weight
Caption:   12px / 400 weight
Mono:      JetBrains Mono for code/scores
```

## 8. Color System

### Light Mode
```css
--color-primary: #2563EB;        /* Blue-600 */
--color-primary-hover: #1D4ED8;  /* Blue-700 */
--color-secondary: #7C3AED;      /* Violet-600 */
--color-success: #16A34A;        /* Green-600 */
--color-warning: #D97706;        /* Amber-600 */
--color-danger: #DC2626;         /* Red-600 */
--color-info: #0891B2;           /* Cyan-600 */

--color-bg: #FFFFFF;
--color-bg-secondary: #F8FAFC;   /* Slate-50 */
--color-bg-tertiary: #F1F5F9;    /* Slate-100 */
--color-surface: #FFFFFF;
--color-border: #E2E8F0;         /* Slate-200 */
--color-text: #0F172A;           /* Slate-900 */
--color-text-secondary: #475569; /* Slate-600 */
--color-text-muted: #94A3B8;     /* Slate-400 */
```

### Dark Mode
```css
--color-bg: #0F172A;             /* Slate-900 */
--color-bg-secondary: #1E293B;   /* Slate-800 */
--color-bg-tertiary: #334155;    /* Slate-700 */
--color-surface: #1E293B;
--color-border: #334155;
--color-text: #F8FAFC;           /* Slate-50 */
--color-text-secondary: #CBD5E1; /* Slate-300 */
--color-text-muted: #64748B;     /* Slate-500 */
```

## 9. Loading States

- **Skeleton screens:** Gray animated placeholders for content
- **Spinner:** For buttons and inline actions
- **Progress bar:** For file uploads
- **Full-page loader:** For initial auth check
- **Face detection overlay:** Animated bounding box during processing

## 10. Accessibility

- All interactive elements keyboard-focusable
- Focus ring visible on all focusable elements
- Alt text on all images
- ARIA labels on icon-only buttons
- Color contrast ratio ≥ 4.5:1 (AA)
- Screen reader announcements for dynamic content
- Form inputs linked to labels
- Error messages associated with inputs via `aria-describedby`
