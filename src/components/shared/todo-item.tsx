"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Todo } from "../../types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-card">
      <Checkbox
        className="cursor-pointer"
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`cursor-pointer flex-1 truncate ${
          todo.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {todo.text}
      </label>

      <Button
        className="cursor-pointer"
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        aria-label="Удалить задачу"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
