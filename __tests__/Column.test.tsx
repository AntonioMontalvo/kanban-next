// __tests__/Column.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Column } from "@/components/Column";
import { Column as ColumnType, Task } from "@/types";

// Mock @dnd-kit/core
vi.mock("@dnd-kit/core", () => ({
  useDroppable: () => ({
    setNodeRef: () => {},
    isOver: false,
  }),
}));

// Mock @dnd-kit/sortable
vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => children,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

// Mock Zustand store
vi.mock("@/stores/boardStore", () => ({
  useBoardStore: (selector: any) => {
    const store = {
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    };
    return selector ? selector(store) : store;
  },
}));

describe("Column", () => {
  const mockColumn: ColumnType = {
    id: "todo",
    title: "To Do",
  };

  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      column: "todo",
      createdAt: Date.now(),
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      column: "todo",
      createdAt: Date.now(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders column title", () => {
    render(<Column column={mockColumn} tasks={[]} />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("renders correct color based on column type", () => {
    const { container } = render(<Column column={mockColumn} tasks={[]} />);
    const columnDiv = container.querySelector(".border-gray-300");
    expect(columnDiv).toBeInTheDocument();
  });

  it("renders list of tasks", () => {
    render(<Column column={mockColumn} tasks={mockTasks} />);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it('opens modal when "Add Task" clicked', () => {
    render(<Column column={mockColumn} tasks={[]} />);
    const addButton = screen.getByTitle("Add new task");
    fireEvent.click(addButton);

    // Modal should now be visible with form elements
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("opens modal when task is clicked", () => {
    render(<Column column={mockColumn} tasks={mockTasks} />);

    // Click on the first task card
    const taskCard = screen.getByText("Task 1").closest("div");
    fireEvent.click(taskCard!);

    // Modal should open with the task pre-filled
    expect(screen.getByDisplayValue("Task 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Description 1")).toBeInTheDocument();
  });

  it("renders empty state when no tasks", () => {
    render(<Column column={mockColumn} tasks={[]} />);
    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(screen.getByText("Click + to add one")).toBeInTheDocument();
  });
});
