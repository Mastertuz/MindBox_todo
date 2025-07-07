import './App.css'

import { ThemeProvider } from "@/components/shared/theme-provider"
import TodoApp from './components/shared/todo-app'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TodoApp />
    </ThemeProvider>
  )
}

export default App
