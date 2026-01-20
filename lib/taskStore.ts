import { Task } from "@/types";

// In-memory task storage (temporary - will be replaced with PostgreSQL in Day 2)
// This allows sharing data between different API routes
class TaskStore {
  // Private tasks array - only accessible within this class
  private tasks: Task[] = [
    {
      id: "1",
      title: "Sample Task 1",
      description: "This is a sample task from the API",
      column: "todo",
      createdAt: Date.now(),
    },
    {
      id: "2",
      title: "Sample Task 2",
      description: "Another sample task",
      column: "inProgress",
      createdAt: Date.now(),
    },
    {
      id: "3",
      title: "Sample Task 3",
      description: "Completed sample task",
      column: "done",
      createdAt: Date.now(),
    },
  ];

  // Get all tasks
  getTasks(): Task[] {
    return this.tasks;
  }

  // Get a single task by ID
  getTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  // Create a new task
  // Omit<Task, 'id'> means "Task type without the id property"
  createTask(task: Omit<Task, "id">): Task {
    const newTask: Task = {
      id: Date.now().toString(), // Generate unique ID from timestamp
      ...task, // Spread operator - adds title, description, column, createdAt
    };
    this.tasks.push(newTask);
    return newTask;
  }

  // Update an existing task
  // Partial<Task> means "some or all properties of Task"
  updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return null; // Task not found

    this.tasks[index] = {
      ...this.tasks[index], // Keep existing properties
      ...updates, // Override with new values
      id: this.tasks[index].id, // Ensure ID never changes
    };
    return this.tasks[index];
  }

  // Delete a task
  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return false; // Task not found

    this.tasks.splice(index, 1); // Remove from array
    return true; // Success
  }
}

// Export a singleton instance - ONE instance shared across all API routes
export const taskStore = new TaskStore();
