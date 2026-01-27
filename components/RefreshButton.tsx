"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * RefreshButton - Client Component
 *
 * Allows users to manually refresh server component data
 * without a full page reload. Uses Next.js router.refresh()
 * to re-fetch server component data.
 */
export function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh(); // Re-fetches server component data

    // Reset the refreshing state after animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      title="Refresh dashboard data"
    >
      <svg
        className={`w-5 h-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {isRefreshing ? "Refreshing..." : "Refresh Data"}
    </button>
  );
}
