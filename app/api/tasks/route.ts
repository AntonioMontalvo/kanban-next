import { NextRequest, NextResponse } from "next/server";
import { taskStore } from "@/lib/taskStore";

// GET /api/tasks - Get all tasks
export async function GET() {
  try {
    const tasks = taskStore.getTasks();

    // Return JSON response with 200 status
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    // Return error response with 500 status
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    // Parse JSON body from request
    const body = await request.json();
    const { title, description, column, createdAt } = body;

    // Validation - ensure required fields exist
    if (!title || !column) {
      return NextResponse.json(
        { error: "Title and column are required" },
        { status: 400 } // 400 = Bad Request
      );
    }

    // Create new task using taskStore
    const newTask = taskStore.createTask({
      title,
      description: description || "",
      column,
      createdAt: createdAt || Date.now(),
    });

    // Return created task with 201 status
    return NextResponse.json(
      { task: newTask },
      { status: 201 } // 201 = Created
    );
  } catch (error) {
    console.error("Error creating task:", error);

    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
