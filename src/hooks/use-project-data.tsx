
import { useState, useEffect } from 'react';
import type { Project, Task, User, Milestone, TimeEntry, Notification } from '@/types/project';

// Mock data generator
const generateMockUsers = (): User[] => [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'admin',
    department: 'Engineering',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'manager',
    department: 'Product',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@company.com',
    role: 'member',
    department: 'Design',
    isOnline: false,
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james@company.com',
    role: 'member',
    department: 'Engineering',
    isOnline: true,
  },
];

const generateMockProjects = (users: User[]): Project[] => [
  {
    id: '1',
    name: 'E-Commerce Platform Redesign',
    description: 'Complete overhaul of the customer-facing e-commerce platform',
    status: 'active',
    priority: 'high',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    progress: 65,
    budget: 150000,
    spentBudget: 87500,
    owner: users[1],
    team: [users[0], users[1], users[2], users[3]],
    tags: ['frontend', 'backend', 'design'],
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android app for customer engagement',
    status: 'active',
    priority: 'critical',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-08-15'),
    progress: 45,
    budget: 200000,
    spentBudget: 75000,
    owner: users[0],
    team: [users[0], users[3]],
    tags: ['mobile', 'ios', 'android'],
    color: '#10B981',
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Internal dashboard for business intelligence and reporting',
    status: 'planning',
    priority: 'medium',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-07-31'),
    progress: 15,
    budget: 80000,
    spentBudget: 12000,
    owner: users[2],
    team: [users[1], users[2]],
    tags: ['analytics', 'dashboard', 'reporting'],
    color: '#8B5CF6',
  },
];

const generateMockTasks = (projects: Project[], users: User[]): Task[] => [
  {
    id: '1',
    title: 'Design System Implementation',
    description: 'Create and implement the new design system components',
    status: 'in-progress',
    priority: 'high',
    assignee: users[2],
    reporter: users[1],
    projectId: '1',
    subtasks: [],
    dependencies: [],
    tags: ['design', 'frontend'],
    estimatedHours: 40,
    loggedHours: 28,
    startDate: new Date('2024-01-20'),
    dueDate: new Date('2024-03-15'),
    attachments: [],
    comments: [],
    customFields: {},
  },
  {
    id: '2',
    title: 'API Integration Layer',
    description: 'Build the API integration layer for third-party services',
    status: 'todo',
    priority: 'medium',
    assignee: users[3],
    reporter: users[0],
    projectId: '1',
    subtasks: [],
    dependencies: ['1'],
    tags: ['backend', 'api'],
    estimatedHours: 32,
    loggedHours: 0,
    startDate: new Date('2024-03-16'),
    dueDate: new Date('2024-04-30'),
    attachments: [],
    comments: [],
    customFields: {},
  },
];

export const useProjectData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers = generateMockUsers();
      const mockProjects = generateMockProjects(mockUsers);
      const mockTasks = generateMockTasks(mockProjects, mockUsers);
      
      setUsers(mockUsers);
      setProjects(mockProjects);
      setTasks(mockTasks);
      setNotifications([
        {
          id: '1',
          type: 'deadline_approaching',
          title: 'Deadline Approaching',
          message: 'Design System Implementation is due in 3 days',
          isRead: false,
          createdAt: new Date(),
          userId: '2',
        },
        {
          id: '2',
          type: 'task_assigned',
          title: 'New Task Assigned',
          message: 'You have been assigned to API Integration Layer',
          isRead: false,
          createdAt: new Date(),
          userId: '3',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return {
    users,
    projects,
    tasks,
    notifications,
    loading,
    setUsers,
    setProjects,
    setTasks,
    setNotifications,
  };
};
