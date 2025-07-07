import { useState, useMemo, useEffect } from "react"
import type { Todo, FilterType } from "../types/todo"

const STORAGE_KEY = "todos-app-data"

interface StorageData {
  todos: Todo[]
  filter: FilterType
}

function loadFromStorage(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      const todos = parsed.todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }))
      return { todos, filter: parsed.filter || "all" }
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных из localStorage:", error)
  }

  return { todos: [], filter: "all" }
}

function saveToStorage(data: StorageData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Ошибка при сохранении данных в localStorage:", error)
  }
}

export function useTodos() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>("all")

  useEffect(() => {
    const data = loadFromStorage()
    setTodos(data.todos)
    setFilter(data.filter)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage({ todos, filter })
    }
  }, [todos, filter, isLoaded])

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    }
    setTodos((prev) => [...prev, newTodo])
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed)
      case "completed":
        return todos.filter((todo) => todo.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((todo) => todo.completed).length
    const active = total - completed
    return { total, completed, active }
  }, [todos])

  return {
    todos: filteredTodos,
    filter,
    stats,
    isLoaded,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
  }
}
