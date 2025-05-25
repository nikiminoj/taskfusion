import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { analytics, projects, tasks, users } from '@/server/db/schema';
import { eq, and, sql, count, avg, sum, gte, lte } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const teamId = searchParams.get('teamId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    let query = db.$with('project_task_counts').as(
      db.select({
        projectId: projects.id,
        totalTasks: count(tasks.id).as('totalTasks'),
        completedTasks: sum(sql`CASE WHEN ${tasks.status} = 'completed' THEN 1 ELSE 0 END`).as('completedTasks')
      })
      .from(projects)
      .leftJoin(tasks, eq(projects.id, tasks.projectId))
      .groupBy(projects.id)
    );

    let analyticsQuery = db
      .select({
        projectId: projects.id,
        projectName: projects.name,
        totalTasks: query.totalTasks,
        completedTasks: query.completedTasks,
        completionRate: sql<number>`CAST(${query.completedTasks} AS REAL) * 100 / ${query.totalTasks}`,
        totalUsers: count(sql`${users.id}`).as('totalUsers'),
        averageTasksPerUser: avg(sql`user_task_counts.taskCount`).as('averageTasksPerUser'),
      })
      .from(projects)
      .leftJoin(query, eq(projects.id, query.projectId))
      .leftJoin(users, sql`EXISTS (SELECT 1 FROM project_members WHERE project_members.project_id = ${projects.id} AND project_members.user_id = ${users.id})`) // Assuming a project_members table for team
      .leftJoin(db.$with('user_task_counts').as(
        db.select({
          userId: tasks.assignedTo,
          taskCount: count(tasks.id).as('taskCount')
        })
        .from(tasks)
        .where(tasks.assignedTo.isNotNull())
        .groupBy(tasks.assignedTo)
      ), eq(users.id, sql`user_task_counts.userId`))
      .groupBy(projects.id, projects.name, query.totalTasks, query.completedTasks);


    const conditions = [];

    if (projectId) {
      conditions.push(eq(projects.id, projectId));
    }

    if (teamId) {
        // Assuming a team_members table and a projects_teams table
        const projectsInTeam = db.select({ projectId: sql`${projects.id}` })
            .from(projects)
            .leftJoin(sql`projects_teams`, eq(projects.id, sql`projects_teams.project_id`))
            .where(eq(sql`projects_teams.team_id`, teamId));
        conditions.push(sql`${projects.id} IN ${projectsInTeam}`);
    }


    if (startDate && endDate) {
      conditions.push(and(gte(projects.createdAt, new Date(startDate)), lte(projects.createdAt, new Date(endDate)))); // Or filter tasks by date
    } else if (startDate) {
      conditions.push(gte(projects.createdAt, new Date(startDate)));
    } else if (endDate) {
      conditions.push(lte(projects.createdAt, new Date(endDate)));
    }

    if (conditions.length > 0) {
      // @ts-ignore
      analyticsQuery = analyticsQuery.where(and(...conditions));
    }

    const result = await analyticsQuery.execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}