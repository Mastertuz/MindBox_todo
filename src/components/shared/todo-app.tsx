import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { TodoInput } from "../shared/todo-input"
import { TodoList } from "../shared/todo-list"
import { useTodos } from "../../hooks/use-todos"
import type { FilterType } from "../../types/todo"
import { ModeToggle } from '../shared/mode-toggle'
import Loader from "./loader"

function TodoApp() {
  const {
    todos,
    filter,
    stats,
    isLoaded,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
  } = useTodos()

  const handleFilterChange = (value: string) => {
    setFilter(value as FilterType)
  }

  if (!isLoaded) {
    return (
      <Loader/>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl relative">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold max-sm:text-xl max-sm:text-start">ToDo Приложение</CardTitle>
            <div className="absolute right-7">
            <ModeToggle/>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <TodoInput onAdd={addTodo} />

            <div className="flex items-center justify-between flex-wrap gap-2 max-sm:gap-4">
              <div className="flex gap-2">
                <Badge variant="secondary">Всего: {stats.total}</Badge>
                <Badge variant="outline">Активных: {stats.active}</Badge>
                <Badge variant="default">Выполнено: {stats.completed}</Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={clearCompleted}
                className="cursor-pointer"
                disabled={!stats.completed}
              >
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Очистить выполненные
              </Button>
            </div>

            <Tabs value={filter} onValueChange={handleFilterChange}>
              <TabsList className="grid w-full grid-cols-3 max-[480px]:grid-cols-1 max-[480px]:h-full">
                <TabsTrigger className="cursor-pointer w-full" value="all">
                  Все задачи
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer w-full" value="active">
                  Невыполненные
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer w-full" value="completed">
                  Выполненные
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
              </TabsContent>
              <TabsContent value="completed" className="mt-4">
                <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TodoApp
