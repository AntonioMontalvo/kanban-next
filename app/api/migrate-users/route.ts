import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

/**
 * Database Migration: Add Users Table
 * 
 * This endpoint creates the users table and adds user_id to tasks table.
 * 
 * Run once by visiting: http://localhost:3000/api/migrate-users
 * 
 * Schema Changes:
 * 1. Create users table (id, email, name, image, created_at)
 * 2. Add user_id column to tasks table (foreign key to users)
 */

export async function GET() {
  try {
    // Step 1: Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log("✅ Users table created");

    // Step 2: Add user_id column to tasks table (if it doesn't exist)
    // First check if column exists
    const checkColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tasks' 
      AND column_name = 'user_id'
    `;

    if (checkColumn.rows.length === 0) {
      // Column doesn't exist, so add it
      await sql`
        ALTER TABLE tasks
        ADD COLUMN user_id INTEGER REFERENCES users(id)
      `;
      console.log("✅ Added user_id column to tasks table");
    } else {
      console.log("ℹ️  user_id column already exists");
    }

    // Step 3: Show current table structure
    const tasksInfo = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'tasks'
      ORDER BY ordinal_position
    `;

    const usersInfo = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;

    return NextResponse.json({
      success: true,
      message: "Database migration completed successfully",
      tables: {
        users: usersInfo.rows,
        tasks: tasksInfo.rows,
      },
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
