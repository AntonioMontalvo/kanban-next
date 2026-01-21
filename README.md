# Next.js Kanban Board 🎯

A modern, full-featured Kanban board built with Next.js 16, TypeScript, and Tailwind CSS. Features drag-and-drop functionality, RESTful API routes, and comprehensive test coverage.

## 🚀 Live Demo

**[View Live Demo](https://kanban-next-flame.vercel.app/)** ← Click to try it!

## ✨ Features

- 📋 **Drag & Drop**: Smooth task movement between columns using @dnd-kit
- 🎨 **Modern UI**: Clean interface built with Tailwind CSS
- 🔄 **RESTful API**: Next.js API routes for full CRUD operations
- ✅ **27 Passing Tests**: Comprehensive test suite with Vitest
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎯 **TypeScript**: Full type safety throughout the application
- 🚀 **Deployed on Vercel**: Production-ready deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AntonioMontalvo/kanban-next.git

# Navigate to project directory
cd kanban-next

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 API Routes

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get task by ID
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## 🚀 Deployment

Deployed on Vercel: [https://kanban-next-flame.vercel.app/](https://kanban-next-flame.vercel.app/)

## 📚 Documentation

- [Migration Notes](MIGRATION_NOTES.md) - Details about Vite → Next.js migration
- [Enhancement Guide](NEXTJS_ENHANCEMENT_GUIDE.md) - Future improvements roadmap

## 👤 Author

**Antonio Montalvo**

- GitHub: [@AntonioMontalvo](https://github.com/AntonioMontalvo)
- Portfolio: [antonio-portfolio-master-bt2g.vercel.app](https://antonio-portfolio-master-bt2g.vercel.app/)

## 📄 License

This project is open source and available under the MIT License.
