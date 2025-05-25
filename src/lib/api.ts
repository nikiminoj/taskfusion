// API utilities and data fetching functions
// Following Next.js 15 and React Server Components patterns

import { cache } from "react"
import type { Project, Task, User, Notification } from "./types"

// Cache frequently accessed data
export const getUser = cache(async (userId: string): Promise<User | null> => {
  // In a real app, this would fetch from your database
  // Using Prisma, Drizzle, or direct SQL queries
  try {
    const response = await fetch(`/api/users/${userId}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) return null
    return response.json()
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
})

export const getProjects = cache(async (teamId: string): Promise<Project[]> => {
  try {
    const response = await fetch(`/api/teams/${teamId}/projects`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!response.ok) return []
    return response.json()
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return []
  }
})

export const getProjectTasks = cache(async (projectId: string): Promise<Task[]> => {
  try {
    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    })

    if (!response.ok) return []
    return response.json()
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return []
  }
})

export const getTeamMembers = cache(async (teamId: string): Promise<User[]> => {
  try {
    const response = await fetch(`/api/teams/${teamId}/members`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) return []
    return response.json()
  } catch (error) {
    console.error("Failed to fetch team members:", error)
    return []
  }
})

export const getNotifications = cache(async (userId: string): Promise<Notification[]> => {
  try {
    const response = await fetch(`/api/users/${userId}/notifications`, {
      next: { revalidate: 10 }, // Cache for 10 seconds
    })

    if (!response.ok) return []
    return response.json()
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return []
  }
})

// Real-time data fetching with WebSocket support
export class RealtimeAPI {
  private ws: WebSocket | null = null
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()

  connect() {
    if (typeof window === "undefined") return // Server-side guard

    this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001")

    this.ws.onmessage = (event) => {
      const { type: eventType, data: eventData } = JSON.parse(event.data)
      const callbacks = this.subscribers.get(eventType)

      if (callbacks) {
        callbacks.forEach((callback) => callback(eventData))
      }
    }

    this.ws.onopen = () => {
      console.log("WebSocket connected")
    }

    this.ws.onclose = () => {
      console.log("WebSocket disconnected")
      // Attempt to reconnect after 3 seconds
      setTimeout(() => this.connect(), 3000)
    }

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set())
    }
    this.subscribers.get(eventType)!.add(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(eventType)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.subscribers.delete(eventType)
        }
      }
    }
  }

  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// Singleton instance for real-time API
export const realtimeAPI = new RealtimeAPI()

// Error handling utilities
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export async function handleAPIResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }))
    throw new APIError(error.message || "API request failed", response.status, error.code)
  }

  return response.json()
}

// Optimistic updates for better UX
export function optimisticUpdate<T>(
  currentData: T[],
  newItem: Partial<T> & { id: string },
  operation: "create" | "update" | "delete",
): T[] {
  switch (operation) {
    case "create":
      return [...currentData, newItem as T]
    case "update":
      return currentData.map((item) => ((item as any).id === newItem.id ? { ...item, ...newItem } : item))
    case "delete":
      return currentData.filter((item) => (item as any).id !== newItem.id)
    default:
      return currentData
  }
}
