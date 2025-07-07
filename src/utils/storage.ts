export const STORAGE_KEYS = {
  TODOS: "todos-app-data",
} as const

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Ошибка при чтении из localStorage (${key}):`, error)
    return defaultValue
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Ошибка при записи в localStorage (${key}):`, error)
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Ошибка при удалении из localStorage (${key}):`, error)
  }
}
