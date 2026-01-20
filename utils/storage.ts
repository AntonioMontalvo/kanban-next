// utils/storage.ts

/**
 * LocalStorage utility functions for persisting board state
 */

import { Task } from '@/types';

const STORAGE_KEY = 'kanban-board-tasks';

export const loadTasks = (): Task[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const tasks = JSON.parse(stored);
    return Array.isArray(tasks) ? tasks : null;
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return null;
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

export const clearTasks = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tasks from localStorage:', error);
  }
};
