'use client'

// stores/boardStore.ts

/**
 * Zustand store for managing Kanban board state
 * Handles tasks, columns, and all CRUD operations
 * Now uses API endpoints instead of localStorage
 */

import { create } from "zustand";
import { Task, Column, ColumnId } from "@/types";

interface BoardStore {
  // State
  tasks: Task[];
  columns: Column[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description: string, columnId: ColumnId) => Promise<void>;
  updateTask: (id: string, title: string, description: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newColumnId: ColumnId) => Promise<void>;

  // Utilities
  getTasksByColumn: (columnId: ColumnId) => Task[];
  initializeTasks: () => void;
}

// Default columns configuration
const defaultColumns: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export const useBoardStore = create<BoardStore>((set, get) => ({
  // Initial state
  tasks: [],
  columns: defaultColumns,
  isLoading: false,
  error: null,

  // Initialize tasks from API
  initializeTasks: async () => {
    await get().fetchTasks();
  },

  // Fetch all tasks from API
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      set({ tasks: data.tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to load tasks', isLoading: false });
    }
  },

  // Create a new task
  addTask: async (title, description, columnId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          column: columnId,
          createdAt: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      set((state) => ({
        tasks: [...state.tasks, data.task],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task', isLoading: false });
    }
  },

  // Update an existing task
  updateTask: async (id, title, description) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const data = await response.json();
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? data.task : task
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: 'Failed to update task', isLoading: false });
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: 'Failed to delete task', isLoading: false });
    }
  },

  // Move a task to a different column (drag-and-drop)
  moveTask: async (taskId, newColumnId) => {
    // Optimistically update UI
    const originalTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, column: newColumnId } : task
      ),
    }));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          column: newColumnId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to move task');
      }
    } catch (error) {
      console.error('Error moving task:', error);
      // Rollback on error
      set({ tasks: originalTasks, error: 'Failed to move task' });
    }
  },

  // Get all tasks for a specific column
  getTasksByColumn: (columnId) => {
    return get().tasks.filter((task) => task.column === columnId);
  },
}));
