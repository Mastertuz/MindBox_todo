import { renderHook, act, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { useTodos } from "../src/hooks/use-todos"

describe("useTodos", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("initializes with empty todos when no stored data", async () => {
    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })

    expect(result.current.todos).toEqual([])
    expect(result.current.stats).toEqual({
      total: 0,
      completed: 0,
      active: 0,
    })
  })

  it("loads data from localStorage on initialization", async () => {
    const storedData = {
      todos: [
        {
          id: "1",
          text: "Stored todo",
          completed: false,
          createdAt: "2023-01-01T00:00:00.000Z",
        },
      ],
      filter: "active",
    }

    localStorage.setItem("todos-app-data", JSON.stringify(storedData))

    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })

    expect(result.current.filter).toBe("active")
    expect(result.current.stats.total).toBe(1)
  })

  it("adds a new todo", async () => {
    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })

    act(() => {
      result.current.addTodo("New todo")
    })

    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe("New todo")
    expect(result.current.todos[0].completed).toBe(false)
  })

  it("toggles todo completion", async () => {
    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })

    act(() => {
      result.current.addTodo("Test todo")
    })

    const todoId = result.current.todos[0].id

    act(() => {
      result.current.toggleTodo(todoId)
    })

    expect(result.current.todos[0].completed).toBe(true)
  })

  it("deletes a todo", async () => {
    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })

    act(() => {
      result.current.addTodo("Test todo")
    })

    const todoId = result.current.todos[0].id

    act(() => {
      result.current.deleteTodo(todoId)
    })

    expect(result.current.todos).toHaveLength(0)
  })

  it("clears completed todos", async () => {
    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })

    act(() => {
      result.current.addTodo("Todo 1")
      result.current.addTodo("Todo 2")
    })

    const firstTodoId = result.current.todos[0].id

    act(() => {
      result.current.toggleTodo(firstTodoId)
    })

    act(() => {
      result.current.clearCompleted()
    })

    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe("Todo 2")
  })

  it("filters todos correctly", async () => {
    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })

    act(() => {
      result.current.addTodo("Active todo")
      result.current.addTodo("Completed todo")
    })

    const completedTodoId = result.current.todos[1].id

    act(() => {
      result.current.toggleTodo(completedTodoId)
    })

    act(() => {
      result.current.setFilter("active")
    })

    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe("Active todo")

    act(() => {
      result.current.setFilter("completed")
    })

    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe("Completed todo")

    act(() => {
      result.current.setFilter("all")
    })

    expect(result.current.todos).toHaveLength(2)
  })

  it("calculates stats correctly", async () => {
    const { result } = renderHook(() => useTodos())

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })

    act(() => {
      result.current.addTodo("Todo 1")
      result.current.addTodo("Todo 2")
      result.current.addTodo("Todo 3")
    })

    const firstTodoId = result.current.todos[0].id

    act(() => {
      result.current.toggleTodo(firstTodoId)
    })

    expect(result.current.stats).toEqual({
      total: 3,
      completed: 1,
      active: 2,
    })
  })
})
