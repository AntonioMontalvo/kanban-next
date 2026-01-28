# Next.js KanbanBoard Enhancement Guide

**Goal:** Transform kanban-next into a full-stack Next.js app with PostgreSQL, API routes, server components, and NextAuth.js authentication to complement the EcommerceApp (MERN) in portfolio.

**Timeline:** 5 days (Jan 20-24, 2026)  
**Estimated Time:** 15-20 hours total

---

## 📋 Strategic Rationale

### Portfolio Differentiation:

- **EcommerceApp:** MERN + JWT + Complex business logic
- **KanbanBoard:** Next.js + PostgreSQL + NextAuth + Server components

### Learning Goals:

- SQL vs NoSQL comparison
- OAuth vs JWT authentication patterns
- Next.js full-stack capabilities
- Server components and API routes
- Production deployment with Vercel

---

## 🗓️ Day-by-Day Implementation Plan

### **Day 1 (Jan 20): Deployment + API Routes Setup** ⚡

**Time:** 3-4 hours  
**Focus:** Get app deployed and create RESTful API

#### Part 1: Deploy to Vercel (~1 hour) ✅ COMPLETED

- [x] Create Vercel account (already had one)
- [x] Push kanban-next to GitHub repo: https://github.com/AntonioMontalvo/kanban-next
- [x] Import project to Vercel (learned about GitHub app permissions)
- [x] Configure build settings (auto-detected Next.js)
- [x] Deploy and test live URL: https://kanban-next-flame.vercel.app/
- [x] Update README with live link and full documentation

#### Part 2: Create API Routes (~2-3 hours) ✅ COMPLETED

- [x] Create `app/api/tasks/route.ts` (GET all, POST new)
- [x] Create `app/api/tasks/[id]/route.ts` (GET one, PUT update, DELETE)
- [x] Implement in-memory task storage (temp, before DB)
- [x] Fixed Next.js 16 async params compatibility
- [x] Update client components to call APIs instead of localStorage
- [x] Test full CRUD operations in browser
- [x] All 27 tests passing ✅
- [ ] Commit: "Add API routes for task management"

**Deliverables:**

- ✅ Live Next.js app on Vercel
- ✅ RESTful API endpoints working
- ✅ Client calling APIs instead of localStorage

**Resources:**

- Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Vercel deployment: https://vercel.com/docs

---

### **Day 2 (Jan 21): PostgreSQL Database Setup** 💾 ✅ COMPLETED

**Time:** 5 hours actual  
**Focus:** Replace in-memory storage with real database

#### Part 1: Set Up Vercel Postgres (~1 hour) ✅

- [x] Go to Vercel dashboard → Storage → Create Database
- [x] Choose Postgres (Vercel Postgres powered by Neon)
- [x] Connect database to project
- [x] Copy environment variables to `.env.local`
- [x] Install `@vercel/postgres` package
- [x] Test connection in API route (`/api/test-db`)

#### Part 2: Create Database Schema (~1.5 hours) ✅

- [x] Design tasks table schema:
  ```sql
  CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,  -- "column" is reserved keyword!
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [x] Create migration endpoint (`/api/setup-db`)
- [x] Run migration to create table
- [x] Insert sample data (3 tasks across all statuses)
- [x] Verify table exists in Vercel dashboard
- [x] **Lesson learned:** "column" is SQL reserved keyword → use "status"

#### Part 3: Update API Routes with SQL (~2 hours) ✅

- [x] Update GET `/api/tasks` to query PostgreSQL
- [x] Update POST `/api/tasks` to INSERT with RETURNING
- [x] Update GET `/api/tasks/[id]` to query by ID
- [x] Update PUT `/api/tasks/[id]` to UPDATE with dynamic fields
- [x] Update DELETE `/api/tasks/[id]` to DELETE with RETURNING
- [x] Add error handling for all database operations
- [x] Implement field mapping (database "status" ↔ frontend "column")
- [x] Test all endpoints with curl

#### Part 4: Testing & Debugging (~30 min) ✅

- [x] Test creating tasks (POST) ✅
- [x] Test updating task (PUT) ✅
- [x] Test deleting tasks (DELETE) ✅
- [x] Test 404 error handling ✅
- [x] Verify data persists after page refresh ✅
- [x] Check Vercel Postgres dashboard for data ✅
- [x] All 27 tests still passing ✅
- [ ] Commit: "Add PostgreSQL database persistence" (pending)

#### Bonus: Documentation Created 📚

- [x] SQL_FUNDAMENTALS.md (850+ lines) - Complete SQL reference
- [x] REACT_TESTING_REFERENCE.md (900+ lines) - Testing guide

**Deliverables:**

- ✅ PostgreSQL database connected
- ✅ Tasks table created with proper schema
- ✅ All API routes using database with parameterized queries
- ✅ Data persists across sessions
- ✅ Field mapping working (status ↔ column)
- ✅ Error handling for 404s and database failures
- ✅ All CRUD operations tested and working

**Resources:**

- Vercel Postgres docs: https://vercel.com/docs/storage/vercel-postgres
- SQL tutorial: https://www.postgresql.org/docs/current/tutorial-sql.html

---

### **Day 3 (Jan 22): Server Components Dashboard** 📊 ✅ COMPLETED

**Time:** 3 hours actual  
**Focus:** Create analytics page using server components

#### Part 1: Create Dashboard Page (~1 hour) ✅

- [x] Create `app/dashboard/page.tsx` (async server component)
- [x] Fetch task statistics directly from database using `sql` template
- [x] Calculate metrics:
  - Total tasks
  - Tasks by status (To Do, In Progress, Done)
  - Completion rate percentage
- [x] Design clean layout with Tailwind (stats cards, progress bar, recent tasks)
- [x] Add Next.js Link component for navigation
- [x] Learned: Server components fetch once at render (not reactive)
- [x] Learned: File-based routing - folder path determines route

#### Part 2: Add Data Visualization (~1.5 hours) ✅

- [x] Install chart library: `npm install recharts`
- [x] Create `components/DashboardCharts.tsx` (client component with "use client")
- [x] Create bar chart for tasks by status distribution
- [x] Create pie chart for completion rate with percentages
- [x] Create line chart for task creation timeline (grouped by date)
- [x] Style dashboard with cards and consistent colors
- [x] Implement ResponsiveContainer with proper height
- [x] Learned: Recharts requires client-side rendering (browser APIs)
- [x] Learned: Server component → Client component data passing pattern

#### Part 3: Navigation & Polish (~30 min) ✅

- [x] Add "View Dashboard" button to board header (blue with chart icon)
- [x] Add "Back to Board" button to dashboard header (gray with board icon)
- [x] Test server-side rendering (data pre-rendered in HTML)
- [x] Create `app/dashboard/loading.tsx` for skeleton UI
- [x] Add pulse animations for loading states
- [x] All navigation uses Next.js Link for fast routing
- [ ] Commit: "Add server component dashboard with Recharts visualizations" (pending)

#### Bonus: Documentation Created 📚

- [x] RECHARTS_REFERENCE.md (700+ lines) - Complete Recharts quick reference

**Deliverables:**

- ✅ Server-rendered dashboard page with async data fetching
- ✅ Task statistics with professional charts (Bar, Pie, Line)
- ✅ Navigation between board and dashboard
- ✅ Loading states with skeleton UI
- ✅ Demonstrates SSR vs CSR architecture

**Resources:**

- Next.js Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Recharts docs: https://recharts.org/
- [RECHARTS_REFERENCE.md](../Learning_Notes/RECHARTS_REFERENCE.md) - Quick reference guide

---

### **Day 4 (Jan 27): NextAuth.js Authentication** 🔐 ✅ COMPLETED

**Time:** 5 hours actual (split morning/afternoon)  
**Focus:** Set up NextAuth with OAuth and multi-user database

#### Part 1: Install & Configure NextAuth (~1-2 hours) ✅

- [x] Install: `npm install next-auth@beta` (for Next.js 15+)
- [x] Create `app/api/auth/[...nextauth]/route.ts`
- [x] Configure Google OAuth:
  - Go to Google Cloud Console
  - Create OAuth 2.0 credentials
  - Add authorized redirect URIs
  - Copy Client ID and Secret
- [x] Add environment variables to `.env.local`:
  ```
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=<generate-with-openssl>
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  ```
- [x] Set up basic NextAuth config (auth.config.ts, auth.ts)
- [x] Test login/logout flow

#### Part 2: Add User Table to Database (~1.5 hours) ✅

- [x] Create users table schema:
  ```sql
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    image TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [x] Add `user_id` column to tasks table:
  ```sql
  ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id);
  ```
- [x] Run migrations via `/api/migrate-users` endpoint
- [x] Update auth.config.ts to save users to database on sign-in
- [x] Update all task API routes to filter by user_id
- [x] Update dashboard to show only user's tasks
- [x] Test multi-user data isolation

#### Part 3: Add Login UI (~1.5 hours) ✅

- [x] Create `app/login/page.tsx` with Google sign-in button
- [x] Create UserMenu component with avatar dropdown
- [x] Protect board page (redirect to login if not authenticated)
- [x] Protect dashboard page
- [x] Configure Next.js Image for Google profile images
- [x] Style login page with Tailwind (gradient, icons)
- [x] Test complete auth flow
- [x] Commit: "Add NextAuth.js authentication with Google OAuth" (63c9301)
- [x] Commit: "Add multi-user database support" (e77d9e1)

**Deliverables:**

- ✅ NextAuth.js configured with Google OAuth
- ✅ Beautiful login page with gradient design
- ✅ Protected routes with auth checks
- ✅ UserMenu component with avatar and dropdown
- ✅ Users table in database
- ✅ Multi-user support with data isolation
- ✅ All task operations filtered by user_id
- ✅ Dashboard shows user-specific stats

**Resources:**

- NextAuth.js docs: https://next-auth.js.org/
- Google OAuth setup: https://next-auth.js.org/providers/google

---

### **Day 5 (Jan 24): Multi-User Features & Testing** 👥

**Time:** 3-4 hours  
**Focus:** Complete multi-user support and testing

#### Part 1: Associate Tasks with Users (~2 hours) ✅ COMPLETED IN DAY 4

- [x] Update POST `/api/tasks` to save `user_id` from session
- [x] Update GET `/api/tasks` to filter by `user_id`
- [x] Update PUT/DELETE to verify ownership
- [x] Added auth checks to all API routes (401 if not authenticated)
- [ ] Test with multiple Google accounts (optional - for tomorrow)

#### Part 2: Enhanced Features (~1 hour) ⚡ PARTIALLY COMPLETE

- [x] Update dashboard to show user-specific stats
- [ ] Add "My Tasks" vs "All Tasks" toggle (optional - bonus)
- [ ] Add user profile page (optional - bonus)
- [ ] Improve error messages for auth failures (optional)

#### Part 3: Testing & Documentation (~1 hour)

- [ ] Test complete user journey:
  - Sign in with Google
  - Create tasks
  - Edit tasks
  - Delete tasks
  - View dashboard
  - Sign out
- [ ] Test with second user account (data isolation)
- [ ] Update README with:
  - New features list
  - Screenshots
  - Environment variables needed
  - Setup instructions
- [ ] Create ENHANCEMENT_NOTES.md documenting changes
- [ ] Final commit: "Complete multi-user kanban with NextAuth"
- [ ] Push to GitHub
- [ ] Deploy to Vercel (triggers auto-deploy)

**Deliverables:**

- ✅ Multi-user task management
- ✅ User data isolation
- ✅ Complete documentation
- ✅ Production deployment

---

## 📝 Testing Checklist

### End-to-End User Flow:

- [ ] User can sign in with Google
- [ ] User sees only their own tasks
- [ ] User can create new tasks
- [ ] User can drag-drop tasks between columns
- [ ] User can edit existing tasks
- [ ] User can delete tasks
- [ ] User can view dashboard with their stats
- [ ] User can sign out
- [ ] Second user sees different tasks
- [ ] Data persists after browser refresh
- [ ] App works on mobile devices

---

## 🎯 Success Criteria

### Technical:

- ✅ PostgreSQL database storing all data
- ✅ NextAuth.js OAuth authentication
- ✅ API routes handling CRUD operations
- ✅ Server components for dashboard
- ✅ Multi-user data isolation
- ✅ Deployed to Vercel

### Portfolio:

- ✅ Different stack than EcommerceApp
- ✅ Demonstrates Next.js full-stack capabilities
- ✅ Shows SQL database experience
- ✅ Shows OAuth vs JWT comparison
- ✅ Production-ready deployment

---

## 📚 Key Learnings to Document

### Compare & Contrast (for interviews):

1. **MongoDB (Ecommerce) vs PostgreSQL (Kanban)**

   - When to use each
   - Schema design differences
   - Query patterns

2. **JWT (Ecommerce) vs OAuth/NextAuth (Kanban)**

   - Token-based vs session-based
   - Security trade-offs
   - Implementation complexity

3. **Express (Ecommerce) vs Next.js API Routes (Kanban)**

   - Routing differences
   - Middleware patterns
   - When to choose each

4. **Client Components (Ecommerce) vs Server Components (Kanban)**
   - Rendering strategies
   - Data fetching patterns
   - Performance implications

### Database Visual Access Tools:

**MongoDB Atlas (EcommerceApp):**

- Built-in web UI for browsing collections
- MongoDB Compass desktop app
- VS Code extension: "MongoDB for VS Code"
- Direct JSON document view

**PostgreSQL (KanbanBoard):**

- **Vercel Dashboard** → Storage → Data tab (easiest, built-in)
- **Neon Console** (https://console.neon.tech) - the actual database provider
- **pgAdmin** (free) - most popular PostgreSQL GUI tool
  - `brew install --cask pgadmin4`
  - Full database management, query editor, schema visualization
- **TablePlus** (paid, $89) - beautiful modern Mac app
  - `brew install --cask tableplus`
  - Multi-database support, SQL autocomplete, spreadsheet-like editing
- **Postico** (Mac) - PostgreSQL-specific client
- **VS Code Extension** - "SQLTools" + "SQLTools PostgreSQL Driver"
  - Browse tables, run queries, see data in editor
- **Custom API Endpoints** - `/api/users`, `/api/debug/tasks`
  - Quick JSON views without extra tools

**Recommendation:**

- Development: Vercel Dashboard (no setup) + `/api/users` endpoint
- Serious work: TablePlus (paid) or pgAdmin (free)
- In-editor: SQLTools VS Code extension

**Connection String Format:**

```
postgres://user:password@host:5432/database?sslmode=require
```

Get from: Vercel Dashboard → Your Project → Storage → Database → Settings → Connection String

---

## 🚀 Deployment URLs

- **Development:** http://localhost:3000
- **Production:** [Will be added after Vercel deployment]

---

## 📖 Resources Quick Links

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [NextAuth.js](https://next-auth.js.org/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Recharts](https://recharts.org/)

---

## 🎓 Bonus Challenges (After Day 5)

If you finish early or want to go deeper:

- [ ] Add GitHub OAuth provider (second provider)
- [ ] Add task collaboration (assign tasks to other users)
- [ ] Add real-time updates with WebSockets
- [ ] Add task comments/activity log
- [ ] Add task due dates and reminders
- [ ] Add drag-drop animations for better UX
- [ ] Write integration tests for API routes
- [ ] Add Playwright E2E tests for auth flow

---

**Ready to start Day 1?** Let's deploy to Vercel and create the API routes!
