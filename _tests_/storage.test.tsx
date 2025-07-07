import { describe, it, expect, beforeEach, vi } from "vitest"
import { getStorageItem, setStorageItem, removeStorageItem } from "../src/utils/storage"

describe("Storage utilities", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe("getStorageItem", () => {
    it("returns parsed value from localStorage", () => {
      const testData = { test: "value" }
      localStorage.setItem("test-key", JSON.stringify(testData))

      const result = getStorageItem("test-key", {})
      expect(result).toEqual(testData)
    })

    it("returns default value when item not found", () => {
      const defaultValue = { default: true }
      const result = getStorageItem("test-key", defaultValue)

      expect(result).toEqual(defaultValue)
    })

    it("returns default value on JSON parse error", () => {
      localStorage.setItem("test-key", "invalid-json")
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const defaultValue = { default: true }
      const result = getStorageItem("test-key", defaultValue)

      expect(result).toEqual(defaultValue)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe("setStorageItem", () => {
    it("saves value to localStorage", () => {
      const testData = { test: "value" }

      setStorageItem("test-key", testData)

      const stored = localStorage.getItem("test-key")
      expect(stored).toBe(JSON.stringify(testData))
    })

    it("handles localStorage errors gracefully", () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error("Storage full")
      })

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      setStorageItem("test-key", { test: "value" })

      expect(consoleSpy).toHaveBeenCalled()

      localStorage.setItem = originalSetItem
      consoleSpy.mockRestore()
    })
  })

  describe("removeStorageItem", () => {
    it("removes item from localStorage", () => {
      localStorage.setItem("test-key", "test-value")

      removeStorageItem("test-key")

      expect(localStorage.getItem("test-key")).toBeNull()
    })

    it("handles localStorage errors gracefully", () => {
      const originalRemoveItem = localStorage.removeItem
      localStorage.removeItem = vi.fn(() => {
        throw new Error("Remove error")
      })

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      removeStorageItem("test-key")

      expect(consoleSpy).toHaveBeenCalled()

      localStorage.removeItem = originalRemoveItem
      consoleSpy.mockRestore()
    })
  })
})
