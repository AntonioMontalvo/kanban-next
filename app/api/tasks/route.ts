import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// GET /api/tasks - Get all tasks from database
export async function GET() {
  try {
    const result = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;

    // Map database rows to match frontend Task interface
    const tasks = result.rows.map((row) => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description || "",
      column: row.status, // Database uses 'status', frontend uses 'column'
      createdAt: new Date(row.created_at).getTime(),
    }));

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task in database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, column } = body;

    // Validation
    if (!title || !column) {
      return NextResponse.json(
        { error: "Title and column are required" },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await sql`
      INSERT INTO tasks (title, description, status)
      VALUES (${title}, ${description || ""}, ${column})
      RETURNING *
    `;

    const row = result.rows[0];
    const newTask = {
      id: row.id.toString(),
      title: row.title,
      description: row.description || "",
      column: row.status,
      createdAt: new Date(row.created_at).getTime(),
    };

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
