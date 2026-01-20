"use client";

// components/Column.tsx

/**
 * Column component representing a task status category
 */

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Column as ColumnType, Task, ColumnId } from "@/types";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { useBoardStore } from "@/stores/boardStore";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export function Column({ column, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const addTask = useBoardStore((state) => state.addTask);
  const updateTask = useBoardStore((state) => state.updateTask);
  const deleteTask = useBoardStore((state) => state.deleteTask);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Open modal to create new task
  const handleAddTask = () => {
    setSelectedTask(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Open modal to edit existing task
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Handle save from modal
  const handleSaveTask = (title: string, description: string) => {
    if (modalMode === "create") {
      addTask(title, description, column.id as ColumnId);
    } else if (selectedTask) {
      updateTask(selectedTask.id, title, description);
    }
  };

  // Handle delete from modal
  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
    }
  };

  // Get column-specific styling
  const getColumnColor = () => {
    switch (column.id) {
      case "todo":
        return "border-gray-300 bg-gray-50";
      case "inProgress":
        return "border-blue-300 bg-blue-50";
      case "done":
        return "border-green-300 bg-green-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <>
      <div
        className={`flex flex-col bg-white rounded-lg border-2 ${getColumnColor()} min-h-[500px]`}
      >
        {/* Column Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {column.title}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({tasks.length})
              </span>
            </h2>
            <button
              onClick={handleAddTask}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Add new task"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Droppable Task List */}
        <div ref={setNodeRef} className="flex-1 p-4 space-y-3 overflow-y-auto">
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <p className="text-sm">No tasks yet</p>
                <p className="text-xs mt-1">Click + to add one</p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleEditTask(task)}
                />
              ))
            )}
          </SortableContext>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={modalMode === "edit" ? handleDeleteTask : undefined}
        task={selectedTask}
        mode={modalMode}
      />
    </>
  );
}
