/**
 * Loading UI for Dashboard
 *
 * This is a special Next.js file that shows while the page is loading.
 * Next.js automatically wraps the page in a Suspense boundary.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 flex items-center justify-between animate-pulse">
          <div>
            <div className="h-10 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded w-40"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Completion Rate Skeleton */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
          <div className="flex items-center">
            <div className="flex-1 h-4 bg-gray-200 rounded-full"></div>
            <div className="ml-4 h-8 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Charts Skeleton */}
        <div className="space-y-8 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Recent Tasks Skeleton */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
