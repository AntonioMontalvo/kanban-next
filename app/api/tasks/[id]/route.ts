import { NextRequest, NextResponse } from "next/server";
import { taskStore } from "@/lib/taskStore";

// GET /api/tasks/[id] - Get a single task by ID
// The [id] folder name makes this dynamic - captures ID from URL
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Extract ID from URL
    const task = taskStore.getTaskById(id);

    // If task not found, return 404
    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 } // 404 = Not Found
      );
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update a task by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, column } = body;

    // Attempt to update task
    const updatedTask = taskStore.updateTask(id, {
      title,
      description,
      column,
    });

    // If task not found, return 404
    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = taskStore.deleteTask(id);

    // If task not found, return 404
    if (!success) {
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
