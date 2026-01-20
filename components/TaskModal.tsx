"use client";

// components/TaskModal.tsx

/**
 * Modal dialog for creating and editing tasks
 */

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { Task } from "@/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  onDelete?: () => void;
  task?: Task | null;
  mode: "create" | "edit";
}

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
  mode,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this task?")
    ) {
      onDelete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - fixed to cover entire viewport */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto flex min-h-full items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-md pointer-events-auto">
          {/* Modal Card */}
          <div className="bg-white rounded-lg shadow-xl w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {mode === "create" ? "Create New Task" : "Edit Task"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Title input */}
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-900 bg-white placeholder-gray-400 dark:placeholder-zinc-500 appearance-none"
                  style={{ color: "rgb(17 24 39)" }} // Tailwind gray-900 fallback
                  placeholder="Enter task title"
                  required
                  autoFocus
                />
              </div>

              {/* Description textarea */}
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none !text-gray-900 bg-white placeholder-gray-400 dark:placeholder-zinc-500 appearance-none"
                  style={{ color: "rgb(17 24 39)" }} // Tailwind gray-900 fallback
                  placeholder="Enter task description (optional)"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div>
                  {mode === "edit" && onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete Task
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {mode === "create" ? "Create Task" : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
