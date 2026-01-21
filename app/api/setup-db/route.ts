import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Setup database schema - Create tasks table
export async function GET() {
  try {
    // Drop table if exists (for development - be careful in production!)
    await sql`DROP TABLE IF EXISTS tasks`;

    // Create tasks table
    await sql`
      CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Insert sample data
    await sql`
      INSERT INTO tasks (title, description, status) VALUES
      ('Sample Task 1', 'This is from the database!', 'todo'),
      ('Sample Task 2', 'Another task from PostgreSQL', 'inProgress'),
      ('Sample Task 3', 'Completed database task', 'done')
    `;

    return NextResponse.json({
      success: true,
      message: "Database schema created successfully!",
      table: "tasks",
    });
  } catch (error) {
    console.error("Database setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create database schema",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
