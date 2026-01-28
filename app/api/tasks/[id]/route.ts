import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { auth } from "@/auth";

// GET /api/tasks/[id] - Get a single task by ID from database (must belong to user)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await sql`
      SELECT * FROM tasks 
      WHERE id = ${id} AND user_id = ${parseInt(session.user.id)}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const row = result.rows[0];
    const task = {
      id: row.id.toString(),
      title: row.title,
      description: row.description || "",
      column: row.status,
      createdAt: new Date(row.created_at).getTime(),
    };

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update a task by ID in database (must belong to user)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, column } = body;

    // Build dynamic UPDATE query based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (column !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(column);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(id); // Add ID as last parameter
    values.push(parseInt(session.user.id!)); // Add user_id for ownership check
    const result = await sql.query(
      `UPDATE tasks SET ${updates.join(
        ", "
      )} WHERE id = $${paramIndex} AND user_id = $${
        paramIndex + 1
      } RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const row = result.rows[0];
    const updatedTask = {
      id: row.id.toString(),
      title: row.title,
      description: row.description || "",
      column: row.status,
      createdAt: new Date(row.created_at).getTime(),
    };

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task by ID from database (must belong to user)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await sql`
      DELETE FROM tasks 
      WHERE id = ${id} AND user_id = ${parseInt(session.user.id)} 
      RETURNING id
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
