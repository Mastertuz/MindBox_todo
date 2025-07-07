
import { render, screen } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { TodoList } from "../src/components/shared/todo-list"
import type { Todo } from "../src/types/todo"

const mockTodos: Todo[] = [
  {
    id: "1",
    text: "First todo",
    completed: false,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
  },
  {
    id: "2",
    text: "Second todo",
    completed: true,
    createdAt: new Date("2023-01-02T00:00:00.000Z"),
  },
]

const mockOnToggle = vi.fn()
const mockOnDelete = vi.fn()

describe("TodoList", () => {
  beforeEach(() => {
    mockOnToggle.mockClear()
    mockOnDelete.mockClear()
  })

  it("renders list of todos", () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    expect(screen.getByText("First todo")).toBeInTheDocument()
    expect(screen.getByText("Second todo")).toBeInTheDocument()
  })

  it("renders empty state when no todos", () => {
    render(<TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    expect(screen.getByText("Задач нет")).toBeInTheDocument()
  })

  it("renders correct number of todo items", () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes).toHaveLength(2)
  })

  it("applies correct spacing classes", () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const container = screen.getByText("First todo").closest(".space-y-2")
    expect(container).toBeInTheDocument()
  })

  it("empty state has correct styling", () => {
    render(<TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />)

    const emptyState = screen.getByText("Задач нет")
    expect(emptyState).toHaveClass("text-center", "py-8", "text-muted-foreground")
  })
})
