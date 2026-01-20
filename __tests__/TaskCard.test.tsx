import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "@/components/TaskCard";
import { useSortable } from "@dnd-kit/sortable";

// Mock the @dnd-kit library
vi.mock("@dnd-kit/sortable", () => ({
  useSortable: vi.fn(),
}));

describe("TaskCard Component", () => {
  // Set up default mock return value for all tests
  beforeEach(() => {
    vi.mocked(useSortable).mockReturnValue({
      attributes: {} as any,
      listeners: {} as any,
      setNodeRef: vi.fn(),
      transform: null,
      transition: undefined,
      isDragging: false,
    } as any);
  });

  it("displays the task title", () => {
    // ARRANGE: Create fake task data
    const mockTask = {
      id: "1",
      title: "Buy groceries",
      description: "Get milk and eggs",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    // ACT: Render the component with fake data
    render(<TaskCard task={mockTask} onClick={() => {}} />);

    // ASSERT: Check if the title appears on screen
    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("displays the task description", () => {
    // ARRANGE: Create fake data
    const mockTask = {
      id: "2",
      title: "Sell car",
      description: "Clean and list the car for sale",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    // ACT: Render component
    render(<TaskCard task={mockTask} onClick={() => {}} />);

    // ASSERT: Check result - look for the DESCRIPTION this time
    expect(
      screen.getByText("Clean and list the car for sale")
    ).toBeInTheDocument();
  });

  it("calls onClick when the card is clicked", () => {
    // ARRANGE: Create fake task and mock onClick function
    const mockTask = {
      id: "3",
      title: "Test task",
      description: "Test description",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    const mockOnClick = vi.fn(); // Create a mock function

    // ACT: Render the component
    render(<TaskCard task={mockTask} onClick={mockOnClick} />);

    // Get the card element and click it
    const card = screen
      .getByText("Test task")
      .closest('div[class*="cursor-pointer"]');

    if (card) {
      fireEvent.click(card);
    }

    // ASSERT: Check if onClick was called
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("displays the drag handle icon", () => {
    const mockTask = {
      id: "4",
      title: "Drag me",
      description: "Test drag handle",
      column: "todo" as const,
      createdAt: Date.now(),
    };
    // ACT: Render the component
    render(<TaskCard task={mockTask} onClick={() => {}} />);

    // ASSERT: Check if drag handle button exists
    // Use aria-label to target the specific button (there are now 2 role="button" elements)
    const dragButton = screen.getByRole("button", { name: "Drag task" });
    expect(dragButton).toBeInTheDocument();
  });

  it("applies correct opacity when dragging", () => {
    // ARRANGE: Tell the mock useSortable to return isDragging = true
    vi.mocked(useSortable).mockReturnValue({
      attributes: {} as any,
      listeners: {} as any,
      setNodeRef: vi.fn(),
      transform: null,
      transition: undefined,
      isDragging: true,
    } as any);

    // ACT: Create task and render component
    const mockTask = {
      id: "5",
      title: "Dragging task",
      description: "Testing drag opacity",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    render(<TaskCard task={mockTask} onClick={() => {}} />);

    // ASSERT: Check that the card has 0.5 opacity
    // Find the outer container div (has bg-white class and opacity style)
    const card = screen
      .getByText("Dragging task")
      .closest('div[class*="bg-white"]');
    expect(card).toHaveStyle({ opacity: "0.5" });
  });

  it("applies full opacity when not dragging", () => {
    // ARRANGE: Mock is already set to isDragging: false in beforeEach

    // ACT: Create task and render component
    const mockTask = {
      id: "6",
      title: "Not dragging task",
      description: "Testing normal opacity",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    render(<TaskCard task={mockTask} onClick={() => {}} />);

    // ASSERT: Check that the card has 1 opacity (fully visible)
    // Find the outer container div (has bg-white class and opacity style)
    const card = screen
      .getByText("Not dragging task")
      .closest('div[class*="bg-white"]');
    expect(card).toHaveStyle({ opacity: "1" });
  });
});
