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

### **Day 2 (Jan 21): PostgreSQL Database Setup** 💾

**Time:** 4-6 hours  
**Focus:** Replace in-memory storage with real database

#### Part 1: Set Up Vercel Postgres (~1 hour)

- [ ] Go to Vercel dashboard → Storage → Create Database
- [ ] Choose Postgres (Vercel Postgres powered by Neon)
- [ ] Connect database to project
- [ ] Copy environment variables to `.env.local`
- [ ] Install `@vercel/postgres` package
- [ ] Test connection in API route

#### Part 2: Create Database Schema (~1 hour)

- [ ] Design tasks table schema:
  ```sql
  CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] Create migration script or use Vercel SQL editor
- [ ] Run migration to create table
- [ ] Verify table exists

#### Part 3: Update API Routes with SQL (~2-3 hours)

- [ ] Update GET `/api/tasks` to query PostgreSQL
- [ ] Update POST `/api/tasks` to INSERT into database
- [ ] Update GET `/api/tasks/[id]` to query by ID
- [ ] Update PUT `/api/tasks/[id]` to UPDATE database
- [ ] Update DELETE `/api/tasks/[id]` to DELETE from database
- [ ] Add error handling for database operations
- [ ] Test all endpoints with real data

#### Part 4: Testing & Debugging (~1 hour)

- [ ] Test creating tasks
- [ ] Test updating task status (drag-drop)
- [ ] Test editing tasks
- [ ] Test deleting tasks
- [ ] Verify data persists after page refresh
- [ ] Check Vercel Postgres dashboard for data
- [ ] Commit: "Add PostgreSQL database persistence"

**Deliverables:**

- ✅ PostgreSQL database connected
- ✅ Tasks table created
- ✅ All API routes using database
- ✅ Data persists across sessions

**Resources:**

- Vercel Postgres docs: https://vercel.com/docs/storage/vercel-postgres
- SQL tutorial: https://www.postgresql.org/docs/current/tutorial-sql.html

---

### **Day 3 (Jan 22): Server Components Dashboard** 📊

**Time:** 2-3 hours  
**Focus:** Create analytics page using server components

#### Part 1: Create Dashboard Page (~1 hour)

- [ ] Create `app/dashboard/page.tsx` (server component)
- [ ] Fetch task statistics directly from database
- [ ] Calculate metrics:
  - Total tasks
  - Tasks by status (To Do, In Progress, Done)
  - Completion rate
  - Recent activity (last 7 days)
- [ ] Design clean layout with Tailwind

#### Part 2: Add Data Visualization (~1-2 hours)

- [ ] Install chart library: `npm install recharts`
- [ ] Create bar chart for tasks by status
- [ ] Create pie chart for completion rate
- [ ] Add timeline for recent activity
- [ ] Style dashboard with cards and colors

#### Part 3: Navigation & Polish (~30 min)

- [ ] Add "Dashboard" link to header/nav
- [ ] Add "Back to Board" link on dashboard
- [ ] Test server-side rendering (view source, see data)
- [ ] Add loading states
- [ ] Commit: "Add server component dashboard with analytics"

**Deliverables:**

- ✅ Server-rendered dashboard page
- ✅ Task statistics and charts
- ✅ Navigation between board and dashboard

**Resources:**

- Next.js Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Recharts docs: https://recharts.org/

---

### **Day 4 (Jan 23): NextAuth.js Authentication - Part 1** 🔐

**Time:** 4-5 hours  
**Focus:** Set up NextAuth with OAuth providers

#### Part 1: Install & Configure NextAuth (~1-2 hours)

- [ ] Install: `npm install next-auth@beta` (for Next.js 15+)
- [ ] Create `app/api/auth/[...nextauth]/route.ts`
- [ ] Configure Google OAuth:
  - Go to Google Cloud Console
  - Create OAuth 2.0 credentials
  - Add authorized redirect URIs
  - Copy Client ID and Secret
- [ ] Add environment variables to `.env.local`:
  ```
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=<generate-with-openssl>
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  ```
- [ ] Set up basic NextAuth config
- [ ] Test login/logout flow

#### Part 2: Add User Table to Database (~1 hour)

- [ ] Create users table schema:
  ```sql
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    image TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] Add `user_id` column to tasks table:
  ```sql
  ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id);
  ```
- [ ] Run migrations

#### Part 3: Add Login UI (~1-2 hours)

- [ ] Create `app/login/page.tsx` with sign-in buttons
- [ ] Add SessionProvider to app layout
- [ ] Create header component with user avatar/logout
- [ ] Protect board page (redirect to login if not authenticated)
- [ ] Style login page with Tailwind
- [ ] Test complete auth flow
- [ ] Commit: "Add NextAuth.js authentication with Google OAuth"

**Deliverables:**

- ✅ NextAuth.js configured
- ✅ Google OAuth login working
- ✅ User table in database
- ✅ Login page and protected routes

**Resources:**

- NextAuth.js docs: https://next-auth.js.org/
- Google OAuth setup: https://next-auth.js.org/providers/google

---

### **Day 5 (Jan 24): Multi-User Features & Testing** 👥

**Time:** 3-4 hours  
**Focus:** Complete multi-user support and testing

#### Part 1: Associate Tasks with Users (~2 hours)

- [ ] Update POST `/api/tasks` to save `user_id` from session
- [ ] Update GET `/api/tasks` to filter by `user_id`
- [ ] Update PUT/DELETE to verify ownership
- [ ] Add middleware to protect API routes
- [ ] Test with multiple Google accounts

#### Part 2: Enhanced Features (~1 hour)

- [ ] Update dashboard to show user-specific stats
- [ ] Add "My Tasks" vs "All Tasks" toggle (optional)
- [ ] Add user profile page (optional)
- [ ] Improve error messages for auth failures

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
