import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { TaskModal } from "@/components/TaskModal";

describe("TaskModal Component", () => {
  it("renders form when open", () => {
    // ARRANGE: Create mock functions for props
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    // ACT: Render the modal with isOpen={true}
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="create"
      />
    );
    // ASSERT: Check if form elements appear

    expect(screen.getByText("Create New Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter task title")).toBeInTheDocument();
    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    // ARRANGE
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    // ACT
    render(
      <TaskModal
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="create"
      />
    );

    // ASSERT
    // ASSERT: Modal should not render when closed
    expect(screen.queryByText("Create New Task")).toBeNull();
  });

  it("pre-fills form when editing existing task", () => {
    // ARRANGE: Create a mock task with data
    const mockTask = {
      id: "1",
      title: "Buy groceries",
      description: "Get milk and eggs",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    // ACT: Render modal in EDIT mode with task data
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="edit" // ← Edit mode!
        task={mockTask} // ← Pass the task!
      />
    );

    // ASSERT: Check that inputs are pre-filled
    // How do you check input values?
    expect(screen.getByDisplayValue("Buy groceries")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Get milk and eggs")).toBeInTheDocument();
  });

  it("calls onSave with form data when submitted", () => {
    // ARRANGE
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="create"
      />
    );

    // ACT: Type in the form and submit
    //Find the title input and type in it
    const titleInput = screen.getByLabelText("Title *");
    fireEvent.change(titleInput, { target: { value: "New Task Title" } });
    //  Find the description textarea and type in it
    const descriptionTextarea = screen.getByLabelText("Description");
    fireEvent.change(descriptionTextarea, {
      target: { value: "Task description here" },
    });
    //  Submit the form
    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    // ASSERT: Check onSave was called with the right data
    expect(mockOnSave).toHaveBeenCalledWith(
      "New Task Title",
      "Task description here"
    );
  });

  it("calls onClose when cancel button clicked", () => {
    // ARRANGE
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="create"
      />
    );

    // ACT: Find and click the Cancel button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // ASSERT: Check onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows delete button only when editing", () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockOnDelete = vi.fn();

    // Part A: Create mode - no delete button
    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="create"
      />
    );

    expect(screen.queryByText("Delete Task")).toBeNull();

    // Clean up before next render
    cleanup();

    // Part B: Edit mode with onDelete - delete button SHOULD appear
    const mockTask = {
      id: "1",
      title: "Test task",
      description: "Test description",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="edit"
        task={mockTask}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Delete Task")).toBeInTheDocument();
  });

  it("calls window.confirm when Delete Task is clicked", () => {
    // ARRANGE: Mock window.confirm
    const mockConfirm = vi.spyOn(window, "confirm");
    mockConfirm.mockReturnValue(false); // Simulate user clicking "Cancel"

    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockOnDelete = vi.fn();

    const mockTask = {
      id: "1",
      title: "Test task",
      description: "Test description",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="edit"
        task={mockTask}
        onDelete={mockOnDelete}
      />
    );

    // ACT: Click Delete Task button
    const deleteButton = screen.getByText("Delete Task");
    fireEvent.click(deleteButton);

    // ASSERT: Check window.confirm was called
    expect(mockConfirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this task?"
    );

    // Cleanup
    mockConfirm.mockRestore();
  });

  it("calls onDelete and onClose when user confirms deletion", () => {
    // ARRANGE: Mock window.confirm
    const mockConfirm = vi.spyOn(window, "confirm");
    mockConfirm.mockReturnValue(true); // ← User clicks "OK"

    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockOnDelete = vi.fn();

    const mockTask = {
      id: "1",
      title: "Test task",
      description: "Test description",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="edit"
        task={mockTask}
        onDelete={mockOnDelete}
      />
    );

    // ACT: Click Delete Task button (same as before!)
    const deleteButton = screen.getByText("Delete Task");
    fireEvent.click(deleteButton);

    // ASSERT: Check onDelete and onClose were called
    expect(mockOnDelete).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();

    // Cleanup
    mockConfirm.mockRestore();
  });

  it("doesn't call onDelete and onClose when user cancels deletion", () => {
    // ARRANGE: Mock window.confirm
    const mockConfirm = vi.spyOn(window, "confirm");
    mockConfirm.mockReturnValue(false); // ← User clicks "Cancel"

    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockOnDelete = vi.fn();

    const mockTask = {
      id: "1",
      title: "Test task",
      description: "Test description",
      column: "todo" as const,
      createdAt: Date.now(),
    };

    render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="edit"
        task={mockTask}
        onDelete={mockOnDelete}
      />
    );

    // ACT: Click Delete Task button (same as before!)
    const deleteButton = screen.getByText("Delete Task");
    fireEvent.click(deleteButton);

    // ASSERT: Check onDelete and onClose were NOT called
    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();

    // Cleanup
    mockConfirm.mockRestore();
  });
});
