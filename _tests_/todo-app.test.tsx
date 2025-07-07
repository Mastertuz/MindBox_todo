import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import TodoApp from "../src/components/shared/todo-app"
import { ThemeProvider } from "../src/components/shared/theme-provider"

const TodoAppWithProvider = () => (
  <ThemeProvider>
    <TodoApp />
  </ThemeProvider>
)

describe("TodoApp Integration", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })


  it("renders the main app components after loading", async () => {
    render(<TodoAppWithProvider />)

    await waitFor(() => {
      expect(screen.getByText("ToDo Приложение")).toBeInTheDocument()
    })

    expect(screen.getByPlaceholderText("Добавить новую задачу...")).toBeInTheDocument()
    expect(screen.getByText("Все задачи")).toBeInTheDocument()
    expect(screen.getByText("Невыполненные")).toBeInTheDocument()
    expect(screen.getByText("Выполненные")).toBeInTheDocument()
  })

  it("can add a new todo", async () => {
    render(<TodoAppWithProvider />)

    await waitFor(() => {
      expect(screen.getByText("ToDo Приложение")).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText("Добавить новую задачу...")
    const addButton = screen.getByRole("button", { name: /добавить/i })

    fireEvent.change(input, { target: { value: "Test todo" } })
    fireEvent.click(addButton)

    expect(await screen.findByText("Test todo")).toBeInTheDocument()
  })

  it("shows empty state initially", async () => {
    render(<TodoAppWithProvider />)

    await waitFor(() => {
      expect(screen.getByText("ToDo Приложение")).toBeInTheDocument()
    })

    expect(screen.getByText("Задач нет")).toBeInTheDocument()
  })

  it("updates stats when todos are added", async () => {
    render(<TodoAppWithProvider />)

    await waitFor(() => {
      expect(screen.getByText("ToDo Приложение")).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText("Добавить новую задачу...")
    const addButton = screen.getByRole("button", { name: /добавить/i })

    fireEvent.change(input, { target: { value: "Test todo" } })
    fireEvent.click(addButton)

    expect(await screen.findByText("Всего: 1")).toBeInTheDocument()
    expect(screen.getByText("Активных: 1")).toBeInTheDocument()
    expect(screen.getByText("Выполнено: 0")).toBeInTheDocument()
  })

  it("clear completed button is disabled when no completed todos", async () => {
    render(<TodoAppWithProvider />)

    await waitFor(() => {
      expect(screen.getByText("ToDo Приложение")).toBeInTheDocument()
    })

    const clearButton = screen.getByText("Очистить выполненные")
    expect(clearButton).toBeDisabled()
  })
})
