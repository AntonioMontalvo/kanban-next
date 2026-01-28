import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

/**
 * View All Users
 *
 * Simple endpoint to see all users in the database.
 * Visit: http://localhost:3000/api/users
 */

export async function GET() {
  try {
    const result =
      await sql`SELECT id, email, name, created_at FROM users ORDER BY created_at DESC`;

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      users: result.rows,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
