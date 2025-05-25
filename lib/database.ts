// Database schema and connection utilities
// This would typically use Prisma, Drizzle, or similar ORM

export const dbSchema = {
  users: {
    id: "uuid PRIMARY KEY",
    name: "varchar(255) NOT NULL",
    email: "varchar(255) UNIQUE NOT NULL",
    avatar: "text",
    role: "enum('admin', 'manager', 'member', 'viewer') DEFAULT 'member'",
    password_hash: "varchar(255) NOT NULL",
    created_at: "timestamp DEFAULT CURRENT_TIMESTAMP",
    updated_at: "timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  },

  teams: {
    id: "uuid PRIMARY KEY",
    name: "varchar(255) NOT NULL",
    description: "text",
    owner_id: "uuid REFERENCES users(id)",
    created_at: "timestamp DEFAULT CURRENT_TIMESTAMP",
    updated_at: "timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  },

  team_members: {
    user_id: "uuid REFERENCES users(id)",
    team_id: "uuid REFERENCES teams(id)",
    role: "enum('owner', 'admin', 'member') DEFAULT 'member'",
    joined_at: "timestamp DEFAULT CURRENT_TIMESTAMP",
    PRIMARY_KEY: "(user_id, team_id)",
  },

  projects: {
    id: "uuid PRIMARY KEY",
    name: "varchar(255) NOT NULL",
    description: "text",
    status: "enum('planning', 'active', 'on-hold', 'completed', 'cancelled') DEFAULT 'planning'",
    priority: "enum('low', 'medium', 'high', 'critical') DEFAULT 'medium'",
    start_date: "date",
    end_date: "date",
    owner_id: "uuid REFERENCES users(id)",
    team_id: "uuid REFERENCES teams(id)",
    progress: "integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100)",
    budget: "decimal(10,2)",
    created_at: "timestamp DEFAULT CURRENT_TIMESTAMP",
    updated_at: "timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",

    // Indexes for performance
    indexes: [
      "CREATE INDEX idx_projects_team_id ON projects(team_id)",
      "CREATE INDEX idx_projects_owner_id ON projects(owner_id)",
      "CREATE INDEX idx_projects_status ON projects(status)",
      "CREATE INDEX idx_projects_priority ON projects(priority)",
    ],
  },

  tasks: {
    id: "uuid PRIMARY KEY",
    title: "varchar(255) NOT NULL",
    description: "text",
    status: "enum('todo', 'in-progress', 'review', 'done') DEFAULT 'todo'",
    priority: "enum('low', 'medium', 'high', 'critical') DEFAULT 'medium'",
    assignee_id: "uuid REFERENCES users(id)",
    project_id: "uuid REFERENCES projects(id) ON DELETE CASCADE",
    parent_task_id: "uuid REFERENCES tasks(id)",
    estimated_hours: "decimal(5,2)",
    actual_hours: "decimal(5,2)",
    due_date: "timestamp",
    completed_at: "timestamp",
    created_at: "timestamp DEFAULT CURRENT_TIMESTAMP",
    updated_at: "timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",

    // Indexes for performance
    indexes: [
      "CREATE INDEX idx_tasks_project_id ON tasks(project_id)",
      "CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id)",
      "CREATE INDEX idx_tasks_status ON tasks(status)",
      "CREATE INDEX idx_tasks_due_date ON tasks(due_date)",
      "CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id)",
    ],
  },

  task_labels: {
    task_id: "uuid REFERENCES tasks(id) ON DELETE CASCADE",
    label: "varchar(50) NOT NULL",
    PRIMARY_KEY: "(task_id, label)",
  },

  task_dependencies: {
    task_id: "uuid REFERENCES tasks(id) ON DELETE CASCADE",
    depends_on_task_id: "uuid REFERENCES tasks(id) ON DELETE CASCADE",
    PRIMARY_KEY: "(task_id, depends_on_task_id)",

    // Prevent circular dependencies
    CHECK: "task_id != depends_on_task_id",
  },

  comments: {
    id: "uuid PRIMARY KEY",
    content: "text NOT NULL",
    author_id: "uuid REFERENCES users(id)",
    task_id: "uuid REFERENCES tasks(id) ON DELETE CASCADE",
    project_id: "uuid REFERENCES projects(id) ON DELETE CASCADE",
    parent_comment_id: "uuid REFERENCES comments(id)",
    created_at: "timestamp DEFAULT CURRENT_TIMESTAMP",
    updated_at: "timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",

    // Either task_id or project_id must be set, but not both
    CHECK: "(task_id IS NOT NULL AND project_id IS NULL) OR (task_id IS NULL AND project_id IS NOT NULL)",
  },

  notifications: {
    id: "uuid PRIMARY KEY",
    type: "enum('task_assigned', 'task_completed', 'project_updated', 'comment_added', 'deadline_approaching')",
    title: "varchar(255) NOT NULL",
    message: "text NOT NULL",
    user_id: "uuid REFERENCES users(id) ON DELETE CASCADE",
    entity_id: "uuid NOT NULL",
    entity_type: "enum('task', 'project', 'comment')",
    read: "boolean DEFAULT false",
    created_at: "timestamp DEFAULT CURRENT_TIMESTAMP",

    indexes: [
      "CREATE INDEX idx_notifications_user_id ON notifications(user_id)",
      "CREATE INDEX idx_notifications_read ON notifications(read)",
      "CREATE INDEX idx_notifications_created_at ON notifications(created_at)",
    ],
  },

  time_entries: {
    id: "uuid PRIMARY KEY",
    user_id: "uuid REFERENCES users(id)",
    task_id: "uuid REFERENCES tasks(id) ON DELETE CASCADE",
    project_id: "uuid REFERENCES projects(id) ON DELETE CASCADE",
    description: "text",
    start_time: "timestamp NOT NULL",
    end_time: "timestamp",
    duration: "integer NOT NULL", // in minutes
    created_at: "timestamp DEFAULT CURRENT_TIMESTAMP",

    indexes: [
      "CREATE INDEX idx_time_entries_user_id ON time_entries(user_id)",
      "CREATE INDEX idx_time_entries_task_id ON time_entries(task_id)",
      "CREATE INDEX idx_time_entries_project_id ON time_entries(project_id)",
      "CREATE INDEX idx_time_entries_start_time ON time_entries(start_time)",
    ],
  },

  milestones: {
    id: "uuid PRIMARY KEY",
    title: "varchar(255) NOT NULL",
    description: "text",
    project_id: "uuid REFERENCES projects(id) ON DELETE CASCADE",
    due_date: "date NOT NULL",
    completed: "boolean DEFAULT false",
    completed_at: "timestamp",
    created_at: "timestamp DEFAULT CURRENT_TIMESTAMP",
    updated_at: "timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",

    indexes: [
      "CREATE INDEX idx_milestones_project_id ON milestones(project_id)",
      "CREATE INDEX idx_milestones_due_date ON milestones(due_date)",
      "CREATE INDEX idx_milestones_completed ON milestones(completed)",
    ],
  },

  files: {
    id: "uuid PRIMARY KEY",
    name: "varchar(255) NOT NULL",
    original_name: "varchar(255) NOT NULL",
    mime_type: "varchar(100) NOT NULL",
    size: "bigint NOT NULL",
    url: "text NOT NULL",
    project_id: "uuid REFERENCES projects(id) ON DELETE CASCADE",
    task_id: "uuid REFERENCES tasks(id) ON DELETE CASCADE",
    uploaded_by: "uuid REFERENCES users(id)",
    created_at: "timestamp DEFAULT CURRENT_TIMESTAMP",

    // Either project_id or task_id must be set
    CHECK: "(project_id IS NOT NULL) OR (task_id IS NOT NULL)",

    indexes: [
      "CREATE INDEX idx_files_project_id ON files(project_id)",
      "CREATE INDEX idx_files_task_id ON files(task_id)",
      "CREATE INDEX idx_files_uploaded_by ON files(uploaded_by)",
    ],
  },
}

// Performance optimization configurations
export const performanceConfig = {
  // Connection pooling
  connectionPool: {
    min: 5,
    max: 20,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 600000,
  },

  // Query optimization
  queryOptimization: {
    // Use prepared statements
    usePreparedStatements: true,

    // Enable query result caching
    enableQueryCache: true,

    // Batch operations where possible
    enableBatching: true,
  },

  // Partitioning strategy for large tables
  partitioning: {
    tasks: "PARTITION BY RANGE (YEAR(created_at))",
    time_entries: "PARTITION BY RANGE (YEAR(start_time))",
    notifications: "PARTITION BY RANGE (YEAR(created_at))",
  },

  // Archival strategy
  archival: {
    // Archive completed projects older than 2 years
    projects: "completed_projects_archive",

    // Archive old notifications after 6 months
    notifications: "notifications_archive",

    // Archive time entries older than 1 year
    timeEntries: "time_entries_archive",
  },
}
