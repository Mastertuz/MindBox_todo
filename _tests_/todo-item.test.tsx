"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { TodoItem } from "../src/components/shared/todo-item"
import type { Todo } from "../src/types/todo"

const mockTodo: Todo = {
  id: "1",
  text: "Test todo",
  completed: false,
  createdAt: new Date("2023-01-01T00:00:00.000Z"),
}

const mockOnToggle = vi.fn()
const mockOnDelete = vi.fn()

describe("TodoItem", () => {
  beforeEach(() => {
    mockOnToggle.mockClear()
    mockOnDelete.mockClear()
  })

  it("renders todo item correctly", () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    expect(screen.getByText("Test todo")).toBeInTheDocument()
    expect(screen.getByRole("checkbox")).not.toBeChecked()
    expect(screen.getByLabelText("Удалить задачу")).toBeInTheDocument()
  })

  it("renders completed todo with line-through", () => {
    const completedTodo = { ...mockTodo, completed: true }
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const label = screen.getByText("Test todo")
    expect(label).toHaveClass("line-through")
    expect(label).toHaveClass("text-muted-foreground")
    expect(screen.getByRole("checkbox")).toBeChecked()
  })

  it("renders active todo without line-through", () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const label = screen.getByText("Test todo")
    expect(label).not.toHaveClass("line-through")
    expect(label).toHaveClass("text-foreground")
  })

  it("calls onToggle when checkbox is clicked", () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    fireEvent.click(screen.getByRole("checkbox"))
    expect(mockOnToggle).toHaveBeenCalledWith("1")
  })

  it("calls onToggle when label is clicked", () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    fireEvent.click(screen.getByText("Test todo"))
    expect(mockOnToggle).toHaveBeenCalledWith("1")
  })

  it("calls onDelete when delete button is clicked", () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    fireEvent.click(screen.getByLabelText("Удалить задачу"))
    expect(mockOnDelete).toHaveBeenCalledWith("1")
  })

  it("shows Trash2 icon in delete button", () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const deleteButton = screen.getByLabelText("Удалить задачу")
    expect(deleteButton.querySelector("svg")).toBeInTheDocument()
  })

  it("truncates long text", () => {
    const longTodo = {
      ...mockTodo,
      text: "This is a very long todo text that should be truncated when displayed in the todo item component",
    }

    render(<TodoItem todo={longTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const label = screen.getByText(longTodo.text)
    expect(label).toHaveClass("truncate")
  })

  it("has proper accessibility attributes", () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const checkbox = screen.getByRole("checkbox")
    const label = screen.getByText("Test todo")
    const deleteButton = screen.getByLabelText("Удалить задачу")

    expect(checkbox).toHaveAttribute("id", "todo-1")
    expect(label).toHaveAttribute("for", "todo-1")
    expect(deleteButton).toHaveAttribute("aria-label", "Удалить задачу")
  })
})
