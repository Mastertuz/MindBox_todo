import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { TodoInput } from "../src/components/shared/todo-input"

const mockOnAdd = vi.fn()

describe("TodoInput", () => {
  beforeEach(() => {
    mockOnAdd.mockClear()
  })

  it("renders input field and button", () => {
    render(<TodoInput onAdd={mockOnAdd} />)

    expect(screen.getByPlaceholderText("Добавить новую задачу...")).toBeInTheDocument()
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("calls onAdd when form is submitted with text", () => {
    render(<TodoInput onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText("Добавить новую задачу...")
    const form = input.closest("form")!

    fireEvent.change(input, { target: { value: "New todo" } })
    fireEvent.submit(form)

    expect(mockOnAdd).toHaveBeenCalledWith("New todo")
  })

  it("clears input after submission", () => {
    render(<TodoInput onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText("Добавить новую задачу...") as HTMLInputElement
    fireEvent.change(input, { target: { value: "New todo" } })

    const form = input.closest("form")!
    fireEvent.submit(form)

    expect(input.value).toBe("")
  })

  it("does not call onAdd with empty text", () => {
    render(<TodoInput onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText("Добавить новую задачу...")
    const form = input.closest("form")!

    fireEvent.submit(form)
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it("trims whitespace from input", () => {
    render(<TodoInput onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText("Добавить новую задачу...")
    const form = input.closest("form")!

    fireEvent.change(input, { target: { value: "  New todo  " } })
    fireEvent.submit(form)

    expect(mockOnAdd).toHaveBeenCalledWith("New todo")
  })

  it("button is disabled when input is empty", () => {
    render(<TodoInput onAdd={mockOnAdd} />)

    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })

  it("button is enabled when input has text", () => {
    render(<TodoInput onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText("Добавить новую задачу...")
    const button = screen.getByRole("button")

    fireEvent.change(input, { target: { value: "Some text" } })
    expect(button).not.toBeDisabled()
  })

  it("shows Plus icon in button", () => {
    render(<TodoInput onAdd={mockOnAdd} />)

    const button = screen.getByRole("button")
    const svg = button.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})
