export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "manager" | "member" | "viewer"
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  startDate: Date
  endDate?: Date
  ownerId: string
  teamId: string
  progress: number
  budget?: number
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "critical"
  assigneeId?: string
  projectId: string
  parentTaskId?: string
  estimatedHours?: number
  actualHours?: number
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  labels: string[]
  dependencies: string[]
}

export interface Team {
  id: string
  name: string
  description?: string
  ownerId: string
  members: TeamMember[]
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  userId: string
  teamId: string
  role: "owner" | "admin" | "member"
  joinedAt: Date
}

export interface Comment {
  id: string
  content: string
  authorId: string
  taskId?: string
  projectId?: string
  parentCommentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  type: "task_assigned" | "task_completed" | "project_updated" | "comment_added" | "deadline_approaching"
  title: string
  message: string
  userId: string
  entityId: string
  entityType: "task" | "project" | "comment"
  read: boolean
  createdAt: Date
}

export interface TimeEntry {
  id: string
  userId: string
  taskId: string
  projectId: string
  description?: string
  startTime: Date
  endTime?: Date
  duration: number
  createdAt: Date
}

export interface Milestone {
  id: string
  title: string
  description?: string
  projectId: string
  dueDate: Date
  completed: boolean
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}
