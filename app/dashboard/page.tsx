import { sql } from "@vercel/postgres";
import Link from "next/link";
import { DashboardCharts } from "@/components/DashboardCharts";
import { RefreshButton } from "@/components/RefreshButton";
import { UserMenu } from "@/components/UserMenu";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Disable caching for this page to always show fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Database Task type (matches PostgreSQL schema)
interface DBTask {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

/**
 * Dashboard Page - Server Component
 *
 * This is a SERVER COMPONENT (no "use client" directive).
 * It runs on the server and can directly access the database.
 *
 * Benefits:
 * - Faster initial load (data pre-rendered)
 * - No API route needed
 * - Better for SEO
 * - Reduced client-side JavaScript
 * 
 * Note: Set to dynamic rendering to always fetch fresh data
 */

// Loading component for the dashboard
function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
      {/* Completion Rate Skeleton */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      {/* Charts Skeleton */}
      <div className="space-y-8 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  // Check if user is authenticated
  const session = await auth();
  
  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch tasks directly from database
  // This runs on the SERVER, not in the browser
  const result = await sql<DBTask>`SELECT * FROM tasks`;
  const tasks: DBTask[] = result.rows;

  // Calculate statistics
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "inProgress"
  ).length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;
  const completionRate =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Task statistics and analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton />
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              Back to Board
            </Link>
          <UserMenu user={session.user} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tasks Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              Total Tasks
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {totalTasks}
            </div>
          </div>

          {/* To Do Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              To Do
            </div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {todoTasks}
            </div>
          </div>

          {/* In Progress Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              In Progress
            </div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">
              {inProgressTasks}
            </div>
          </div>

          {/* Done Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              Done
            </div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {doneTasks}
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Completion Rate
          </h2>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
            <div className="ml-4 text-2xl font-bold text-gray-900">
              {completionRate}%
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {doneTasks} of {totalTasks} tasks completed
          </p>
        </div>

        {/* Data Visualizations */}
        <DashboardCharts tasks={tasks} />

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === "todo"
                      ? "bg-blue-100 text-blue-800"
                      : task.status === "inProgress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.status === "todo"
                    ? "To Do"
                    : task.status === "inProgress"
                    ? "In Progress"
                    : "Done"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
