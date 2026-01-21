import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Test database connection
export async function GET() {
  try {
    // Simple query to test connection
    const result = await sql`SELECT NOW() as current_time`;
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      currentTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
