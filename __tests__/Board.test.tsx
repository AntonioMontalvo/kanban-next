// What testing functions do you need from vitest?
import { describe, it, expect, vi, beforeEach } from "vitest";

// What do you need from @testing-library/react?
import { render } from "@testing-library/react";

// What component are you testing?
import { Board } from "@/components/Board";

// Mock @dnd-kit/core - we don't want to test the library, just our logic
let capturedOnDragEnd: any = null; // Store the handleDragEnd function

vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children, onDragEnd }: any) => {
    capturedOnDragEnd = onDragEnd; // Capture it!
    return children;
  },
  DragOverlay: ({ children }: any) => children,
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  PointerSensor: vi.fn(),
  TouchSensor: vi.fn(),
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
}));

// Mock @dnd-kit/sortable
vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  SortableContext: ({ children }: any) => children,
  verticalListSortingStrategy: {},
}));

// Mock the Zustand store - this is important!
const mockMoveTask = vi.fn(); // We'll track if this gets called

vi.mock("@/stores/boardStore", () => ({
  useBoardStore: (selector: any) => {
    const store = {
      tasks: [
        {
          id: "task-1",
          title: "Test Task",
          description: "Test Description",
          column: "todo",
          createdAt: Date.now(),
        },
      ],
      columns: [
        { id: "todo", title: "To Do" },
        { id: "inProgress", title: "In Progress" },
        { id: "done", title: "Done" },
      ],
      getTasksByColumn: (columnId: string) => {
        return store.tasks.filter((task) => task.column === columnId);
      },
      moveTask: mockMoveTask, // ← This is what we'll check in our test!
      initializeTasks: vi.fn(),
    };
    return selector ? selector(store) : store;
  },
}));

describe("Board Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset all mocks before each test
  });

  // First test: Simple check that it renders
  it("renders all three columns", () => {
    const { getByText } = render(<Board />);

    expect(getByText("To Do")).toBeInTheDocument();
    expect(getByText("In Progress")).toBeInTheDocument();
    expect(getByText("Done")).toBeInTheDocument();
  });

  it("does not move task when dropped on invalid target (another task)", () => {
    // ARRANGE: Render the Board component
    render(<Board />);

    // Create a fake drag event where task-1 is dropped on task-2 (invalid!)
    const fakeEvent = {
      active: { id: "task-1" }, // Task being dragged
      over: { id: "task-2" }, // Dropped on another task (NOT a column!)
    };

    // ACT: Call the captured handleDragEnd with our fake event
    capturedOnDragEnd(fakeEvent);

    // ASSERT: moveTask should NOT have been called
    expect(mockMoveTask).not.toHaveBeenCalled();
  });

  it("drag handle has touch-none class for mobile dragging", () => {
    // ARRANGE: Render the Board component
    const { getByRole } = render(<Board />);

    // ACT: Find the drag handle button using its aria-label
    const dragHandle = getByRole("button", { name: "Drag task" });

    // ASSERT: Check that it has the touch-none CSS class
    expect(dragHandle).toHaveClass("touch-none");
  });

  it("moves task when dropped on valid column", () => {
    // ARRANGE: Render the Board component
    render(<Board />);

    // Create a fake drag event where task-1 is dropped on inProgress column (VALID!)
    const fakeEvent = {
      active: { id: "task-1" }, // Task being dragged
      over: { id: "inProgress" }, // Dropped on "inProgress" column (valid target!)
    };

    // ACT: Call the captured handleDragEnd with our fake event
    capturedOnDragEnd(fakeEvent);

    // ASSERT: moveTask SHOULD have been called with correct arguments
    expect(mockMoveTask).toHaveBeenCalledWith("task-1", "inProgress");
  });

  it("does not move task when dropped outside any column", () => {
    // ARRANGE: Render the Board component
    render(<Board />);

    // Create a fake drag event where task is dropped outside the board
    const fakeEvent = {
      active: { id: "task-1" }, // Task being dragged
      over: null, // Dropped outside! (no target under cursor)
    };

    // ACT: Call the captured handleDragEnd with our fake event
    capturedOnDragEnd(fakeEvent);

    // ASSERT: moveTask should NOT have been called (early return at line 73)
    expect(mockMoveTask).not.toHaveBeenCalled();
  });
});
