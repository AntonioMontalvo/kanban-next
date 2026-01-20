// types/index.ts

/**
 * Core type definitions for the Kanban Board application
 */

export type ColumnId = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
  createdAt: number;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export interface BoardState {
  tasks: Task[];
  columns: Column[];
}
