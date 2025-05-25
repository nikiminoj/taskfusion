
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member' | 'client';
  department?: string;
  isOnline?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate: Date;
  progress: number;
  budget?: number;
  spentBudget?: number;
  owner: User;
  team: User[];
  tags: string[];
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: User;
  reporter: User;
  projectId: string;
  parentTaskId?: string;
  subtasks: Task[];
  dependencies: string[];
  tags: string[];
  estimatedHours?: number;
  loggedHours?: number;
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  attachments: string[];
  comments: Comment[];
  customFields: Record<string, any>;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  mentions: string[];
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  dueDate: Date;
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
  projectId: string;
  tasks: string[];
  progress: number;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  description: string;
  hours: number;
  date: Date;
  billable: boolean;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'deadline_approaching' | 'mention' | 'project_update';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: string;
  actionUrl?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: 'project' | 'task' | 'user' | 'comment';
  entityId: string;
  userId: string;
  details: Record<string, any>;
  timestamp: Date;
}
