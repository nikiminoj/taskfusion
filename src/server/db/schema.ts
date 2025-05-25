import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  primaryKey,
  pgEnum,
  uuid,
  text,
  date,
  timestamp,
  boolean,
  jsonb,
  varchar,
  uuid as uuid_pg, // Rename to avoid conflict with the uuid import
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `demo_${name}`);

// --- ENUMS ---
export const project_status = pgEnum('project_status', [
    'not_started',
    'in_progress',
    'on_hold',
    'completed',
    'cancelled'
]);

export const project_priority = pgEnum('project_priority', [
    'low',
    'medium',
    'high'
]);

export const task_status_enum = pgEnum('task_status', [ // Renamed to avoid conflict with table name
    'todo',
    'in_progress',
    'completed',
    'blocked'
]);

export const task_priority = pgEnum('task_priority', [
    'low',
    'medium',
    'high'
]);

export const notification_type = pgEnum('notification_type', [
    'project_assigned',
    'task_assigned',
    'comment_mention',
    'status_update'
]);

export const activity_log_type = pgEnum('activity_log_type', [
    'project_created',
    'project_updated',
    'task_created',
    'task_updated',
    'comment_added'
]);

export const user_role_enum = pgEnum('user_role', [ // Renamed to avoid conflict with a potential table named user_role
    'admin',
    'project_manager',
    'developer',
    'viewer'
]);


// --- NEXTAUTH TABLES (EXISTING) ---
export const users = createTable("user", (d) => ({
  id: d
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar("name", { length: 255 }),
  email: d.varchar("email", { length: 255 }).notNull(),
  emailVerified: d
    .timestamp("emailVerified", { // Corrected column name
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar("image", { length: 255 }),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar("provider", { length: 255 }).notNull(),
    providerAccountId: d.varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: d.text("refresh_token"),
    access_token: d.text("access_token"),
    expires_at: d.integer("expires_at"),
    token_type: d.varchar("token_type", { length: 255 }),
    scope: d.varchar("scope", { length: 255 }),
    id_token: d.text("id_token"),
    session_state: d.varchar("session_state", { length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ]
);

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)] // Corrected index name from t_user_id_idx
);

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar("identifier", { length: 255 }).notNull(),
    token: d.varchar("token", { length: 255 }).notNull(),
    expires: d.timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// --- APPLICATION TABLES (NEW) ---

// Profiles Table
export const profiles = createTable("profiles", (d) => ({
    id: d.varchar("id", { length: 255 }).primaryKey().references(() => users.id), // Links to NextAuth users.id
    full_name: d.text("full_name"),
    avatar_url: d.text("avatar_url"),
    email: d.text("email"), // Nullable, canonical email is in users.email
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: d.timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
}));

// User Roles Table
export const user_roles = createTable("user_roles", (d) => ({
    user_id: d.varchar("user_id", { length: 255 }).notNull().references(() => profiles.id, { onDelete: 'cascade' }),
    role: user_role_enum("role").notNull(),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }), (t) => [
    primaryKey({ columns: [t.user_id, t.role] }),
]);

// Projects Table
export const projects = createTable("projects", (d) => ({
    id: d
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    name: d.text("name").notNull(),
    description: d.text("description"),
    status: project_status("status").default('not_started'),
    priority: project_priority("priority").default('medium'),
    start_date: d.date("start_date"),
    due_date: d.date("due_date"),
    owner_id: d.varchar("owner_id", { length: 255 }).references(() => profiles.id, { onDelete: 'set null' }),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: d.timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  }), (t) => [
    index("idx_projects_owner_id").on(t.owner_id),
]);

// Project Tags Table
export const project_tags = createTable("project_tags", (d) => ({
    project_id: d.varchar("project_id", { length: 255 }).notNull().references(() => projects.id, { onDelete: 'cascade' }),
    tag_name: d.text("tag_name").notNull(),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }), (t) => [
    primaryKey({ columns: [t.project_id, t.tag_name] }),
]);

// Project Members Table
export const project_members = createTable("project_members", (d) => ({
    project_id: d.varchar("project_id", { length: 255 }).notNull().references(() => projects.id, { onDelete: 'cascade' }),
    user_id: d.varchar("user_id", { length: 255 }).notNull().references(() => profiles.id, { onDelete: 'cascade' }),
    role: d.text("role"), // e.g., 'Lead', 'Contributor'
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }), (t) => [
    primaryKey({ columns: [t.project_id, t.user_id] }),
    index("idx_project_members_user_id").on(t.user_id),
]);

// Tasks Table
export const tasks = createTable("tasks", (d) => ({
    id: d.varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    project_id: d.uuid("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    title: d.varchar("title", { length: 255 }).notNull(),
    description: d.text("description"),
    status: task_status_enum("status").default('todo'),
    priority: task_priority("priority").default('medium'),
    due_date: d.date("due_date"),
    assignee_id: d.varchar("assignee_id", { length: 255 }).references(() => profiles.id, { onDelete: 'set null' }),
    reporter_id: d.varchar("reporter_id", { length: 255 }).references(() => profiles.id, { onDelete: 'set null' }),
    parent_task_id: d.uuid("parent_task_id").references(() => tasks.id, { onDelete: 'set null' }),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: d.timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  }), (t) => [
    index("idx_tasks_project_id").on(t.project_id),
    index("idx_tasks_assignee_id").on(t.assignee_id),
    index("idx_tasks_reporter_id").on(t.reporter_id),
]);

// Task Tags Table
export const task_tags = createTable("task_tags", (d) => ({
    task_id: d.varchar("task_id", { length: 255 }).notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    tag_name: d.text("tag_name").notNull(),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }), (t) => [
    primaryKey({ columns: [t.task_id, t.tag_name] }),
]);

// Task Dependencies Table
export const task_dependencies = createTable("task_dependencies", (d) => ({
    task_id: d.varchar("task_id", { length: 255 }).notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    depends_on_task_id: d.varchar("depends_on_task_id", { length: 255 }).notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }), (t) => [
    primaryKey({ columns: [t.task_id, t.depends_on_task_id] }),
    // Drizzle doesn't directly support CHECK constraints like `task_id <> depends_on_task_id` in its schema definition.
    // This would typically be handled at the database level or application logic.
]);

// Comments Table
export const comments = createTable("comments", (d) => ({
    id: d
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    task_id: d.varchar("task_id", { length: 255 }).references(() => tasks.id, { onDelete: 'cascade' }),
    project_id: d.varchar("project_id", { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }),
    user_id: d.varchar("user_id", { length: 255 }).references(() => profiles.id, { onDelete: 'set null' }),
    content: d.text("content").notNull(),
    parent_comment_id: d.uuid("parent_comment_id").references(() => comments.id, { onDelete: 'cascade' }),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: d.timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    // CONSTRAINT check_comment_target CHECK (task_id IS NOT NULL OR project_id IS NOT NULL)
    // This check needs to be handled at application level or via custom SQL in migrations if critical.
  }), (t) => [
    index("idx_comments_task_id").on(t.task_id),
    index("idx_comments_project_id").on(t.project_id),
    index("idx_comments_user_id").on(t.user_id),
]);

// Comment Mentions Table
export const comment_mentions = createTable("comment_mentions", (d) => ({
    comment_id: d.varchar("comment_id", { length: 255 }).notNull().references(() => comments.id, { onDelete: 'cascade' }),
    user_id: d.varchar("user_id", { length: 255 }).notNull().references(() => profiles.id, { onDelete: 'cascade' }),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }), (t) => [
    primaryKey({ columns: [t.comment_id, t.user_id] }),
]);

// Notifications Table
export const notifications = createTable("notifications", (d) => ({
    id: d
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    user_id: d.varchar("user_id", { length: 255 }).notNull().references(() => profiles.id, { onDelete: 'cascade' }),
    type: notification_type("type").notNull(),
    related_project_id: d.varchar("related_project_id", { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }),
    related_task_id: d.uuid("related_task_id").references(() => tasks.id, { onDelete: 'cascade' }),
    related_comment_id: d.uuid("related_comment_id").references(() => comments.id, { onDelete: 'cascade' }),
    is_read: d.boolean("is_read").default(false),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: d.timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  }), (t) => [
    index("idx_notifications_user_id").on(t.user_id),
]);

// Activity Logs Table
export const activity_logs = createTable("activity_logs", (d) => ({
    id: d
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    user_id: d.varchar("user_id", { length: 255 }).references(() => profiles.id, { onDelete: 'set null' }),
    type: activity_log_type("type").notNull(),
    details: jsonb("details"),
    related_project_id: d.varchar("related_project_id", { length: 255 }).references(() => projects.id, { onDelete: 'set null' }),
    related_task_id: d.uuid("related_task_id").references(() => tasks.id, { onDelete: 'set null' }),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }), (t) => [
    index("idx_activity_logs_user_id").on(t.user_id),
]);

// Time Entries Table
export const time_entries = createTable("time_entries", (d) => ({
    id: d
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    task_id: d.varchar("task_id", { length: 255 }).notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    user_id: d.varchar("user_id", { length: 255 }).notNull().references(() => profiles.id, { onDelete: 'cascade' }),
    start_time: d.timestamp("start_time", { withTimezone: true }).notNull(),
    end_time: d.timestamp("end_time", { withTimezone: true }),
    notes: d.text("notes"),
    created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: d.timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    // CONSTRAINT check_end_time_after_start_time CHECK (end_time IS NULL OR end_time > start_time)
    // This check needs to be handled at application level or via custom SQL in migrations.
  }), (t) => [
    index("idx_time_entries_task_id").on(t.task_id),
    index("idx_time_entries_user_id").on(t.user_id),
]);

// Analytics Data Table
export const analytics_data = createTable("analytics_data", (d) => ({
    id: d
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
 project_id: d.varchar("project_id", { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }),
 user_id: d.varchar("user_id", { length: 255 }).references(() => profiles.id, { onDelete: 'cascade' }),
 type: d.varchar("type", { length: 255 }).notNull(), // e.g., 'project_progress', 'task_completion_rate', 'user_performance'
 data: jsonb("data").notNull(), // JSON field to store flexible analytics data
 created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }), (t) => [
 index("idx_analytics_data_project_id").on(t.project_id),
 index("idx_analytics_data_user_id").on(t.user_id),
]);

// Files Table
export const files = createTable("files", (d) => ({
 id: d
 .varchar("id", { length: 255 })
 .notNull()
 .primaryKey()
 .$defaultFn(() => crypto.randomUUID()),
 file_name: d.varchar("file_name", { length: 255 }).notNull(),
 file_type: d.varchar("file_type", { length: 255 }),
 file_size: d.integer("file_size"),
 file_url: d.text("file_url").notNull(),
 project_id: d.varchar("project_id", { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }),
 task_id: d.varchar("task_id", { length: 255 }).references(() => tasks.id, { onDelete: 'cascade' }),
 uploaded_by: d.varchar("uploaded_by", { length: 255 }).references(() => profiles.id, { onDelete: 'set null' }),
 created_at: d.timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
 updated_at: d.timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
}), (t) => [
 index("idx_files_project_id").on(t.project_id),
 index("idx_files_task_id").on(t.task_id),
 index("idx_files_uploaded_by").on(t.uploaded_by),
]);


// --- RELATIONS ---

// Existing NextAuth relations
export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions), // Added missing sessions relation
  profile: one(profiles, { fields: [users.id], references: [profiles.id] }), // Added profile relation
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// Existing posts (possibly from a previous example/iteration) - kept for now
export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ]
);
// Existing posts relations
export const postsRelations = relations(posts, ({ one }) => ({
 author: one(users, { fields: [posts.createdById], references: [users.id] }),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
    user: one(users, { fields: [profiles.id], references: [users.id] }),
    user_roles: many(user_roles),
    owned_projects: many(projects, { relationName: 'profile_to_owned_projects' }),
    project_memberships: many(project_members),
    assigned_tasks: many(tasks, { relationName: 'profile_to_assigned_tasks' }),
    reported_tasks: many(tasks, { relationName: 'profile_to_reported_tasks' }),
    comments: many(comments),
    comment_mentions: many(comment_mentions),
    notifications: many(notifications),
    activity_logs: many(activity_logs),
    time_entries: many(time_entries),
    analytics_data: many(analytics_data), // Added relation for analytics data linked to a user
 files: many(files, { relationName: 'files_uploaded_by' }), // Added relation for files uploaded by user
}));

export const userRolesRelations = relations(user_roles, ({ one }) => ({
    profile: one(profiles, { fields: [user_roles.user_id], references: [profiles.id] }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    owner: one(profiles, { fields: [projects.owner_id], references: [profiles.id], relationName: 'profile_to_owned_projects' }),
    project_tags: many(project_tags),
    project_members: many(project_members),
    tasks: many(tasks),
    comments: many(comments), // For comments directly on projects
    notifications: many(notifications),
    activity_logs: many(activity_logs),
 analytics_data: many(analytics_data), // Added relation for analytics data linked to a project
 files: many(files, { relationName: 'project_files' }), // Added relation for files linked to a project
}));

export const projectTagsRelations = relations(project_tags, ({ one }) => ({
    project: one(projects, { fields: [project_tags.project_id], references: [projects.id] }),
}));

export const projectMembersRelations = relations(project_members, ({ one }) => ({
    project: one(projects, { fields: [project_members.project_id], references: [projects.id] }),
    user: one(profiles, { fields: [project_members.user_id], references: [profiles.id] }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
    project: one(projects, { fields: [tasks.project_id], references: [projects.id] }),
    assignee: one(profiles, { fields: [tasks.assignee_id], references: [profiles.id], relationName: 'profile_to_assigned_tasks' }),
    reporter: one(profiles, { fields: [tasks.reporter_id], references: [profiles.id], relationName: 'profile_to_reported_tasks' }),
    parent_task: one(tasks, { fields: [tasks.parent_task_id], references: [tasks.id], relationName: "parent_task_relation" }),
    sub_tasks: many(tasks, { relationName: "parent_task_relation" }),
    task_tags: many(task_tags),
    dependencies: many(task_dependencies, { relationName: 'task_dependencies' }),
    dependents: many(task_dependencies, { relationName: 'task_dependents' }),
    comments: many(comments),
    notifications: many(notifications),
    activity_logs: many(activity_logs),
    time_entries: many(time_entries),
 files: many(files, { relationName: 'task_files' }), // Added relation for files linked to a task
}));

export const taskTagsRelations = relations(task_tags, ({ one }) => ({
    task: one(tasks, { fields: [task_tags.task_id], references: [tasks.id] }),
}));

export const taskDependenciesRelations = relations(task_dependencies, ({ one }) => ({
    task: one(tasks, { fields: [task_dependencies.task_id], references: [tasks.id], relationName: 'task_dependents' }),
    depends_on_task: one(tasks, { fields: [task_dependencies.depends_on_task_id], references: [tasks.id], relationName: 'task_dependencies' }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
    task: one(tasks, { fields: [comments.task_id], references: [tasks.id] }),
    project: one(projects, { fields: [comments.project_id], references: [projects.id] }),
    user: one(profiles, { fields: [comments.user_id], references: [profiles.id] }),
    parent_comment: one(comments, { fields: [comments.parent_comment_id], references: [comments.id], relationName: "parent_comment_relation" }),
    replies: many(comments, { relationName: "parent_comment_relation" }),
    mentions: many(comment_mentions),
    notifications: many(notifications),
}));

export const commentMentionsRelations = relations(comment_mentions, ({ one }) => ({
    comment: one(comments, { fields: [comment_mentions.comment_id], references: [comments.id] }),
    user: one(profiles, { fields: [comment_mentions.user_id], references: [profiles.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(profiles, { fields: [notifications.user_id], references: [profiles.id] }),
    project: one(projects, { fields: [notifications.related_project_id], references: [projects.id] }),
    task: one(tasks, { fields: [notifications.related_task_id], references: [tasks.id] }),
    comment: one(comments, { fields: [notifications.related_comment_id], references: [comments.id] }),
}));

export const activityLogsRelations = relations(activity_logs, ({ one }) => ({
    user: one(profiles, { fields: [activity_logs.user_id], references: [profiles.id] }),
    project: one(projects, { fields: [activity_logs.related_project_id], references: [projects.id] }),
    task: one(tasks, { fields: [activity_logs.related_task_id], references: [tasks.id] }),
}));

export const timeEntriesRelations = relations(time_entries, ({ one }) => ({
    task: one(tasks, { fields: [time_entries.task_id], references: [tasks.id] }),
    user: one(profiles, { fields: [time_entries.user_id], references: [profiles.id] }),
}));

// New relations for analytics data
export const analyticsDataRelations = relations(analytics_data, ({ one }) => ({
 project: one(projects, { fields: [analytics_data.project_id], references: [projects.id] }),
 user: one(profiles, { fields: [analytics_data.user_id], references: [profiles.id] }),
}));

// New relations for files
export const filesRelations = relations(files, ({ one }) => ({
 project: one(projects, { fields: [files.project_id], references: [projects.id], relationName: 'project_files' }),
 task: one(tasks, { fields: [files.task_id], references: [tasks.id], relationName: 'task_files' }),
 uploaded_by: one(profiles, { fields: [files.uploaded_by], references: [profiles.id], relationName: 'files_uploaded_by' }),
}));