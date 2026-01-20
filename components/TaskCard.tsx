"use client";

// components/TaskCard.tsx

/**
 * Individual draggable task card component
 */

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import { GripVertical } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard = React.memo(({ task, onClick }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-4
        hover:shadow-md transition-shadow
        ${isDragging ? "z-50" : ""}
      `}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle - larger touch target for mobile */}
        <button
          className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none p-2 -m-2"
          {...attributes}
          {...listeners}
          aria-label="Drag task"
        >
          <GripVertical size={20} />
        </button>

        {/* Task content - clickable area */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClick();
            }
          }}
        >
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = "TaskCard";
