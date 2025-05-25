import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tasks } from '@/server/db/schema';
import { z } from 'zod';

const createSubtaskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(['todo', 'in_progress', 'done', 'blocked']).default('todo'),
  parentTaskId: z.string().uuid(), // Assuming parentTaskId is a UUID
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createSubtaskSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedData.error.errors }, { status: 400 });
    }

    const { title, status, parentTaskId } = validatedData.data;

    // Optional: Verify if the parent task exists and belongs to a project.
    // For simplicity here, we'll assume the parentTaskId is valid and we can inherit the project_id.
    // A more robust implementation would fetch the parent task first.

    // For now, we need a project_id to create a task.
    // Since a subtask belongs to a task, which belongs to a project,
    // we should ideally get the project_id from the parent task.
    // As a temporary measure for this API, we'll need to fetch the parent task first
    // to get its project_id. A more efficient design might pass project_id from client
    // or have a trigger/function in the DB. Let's fetch for now.

    const parentTask = await db.query.tasks.findFirst({
      where: (tasks, { eq }) => eq(tasks.id, parentTaskId),
    });

    if (!parentTask) {
      return NextResponse.json({ error: 'Parent task not found' }, { status: 404 });
    }

    const [newSubtask] = await db
      .insert(tasks)
      .values({
        title,
        status,
        parentId: parentTaskId, // Link to the parent task
        projectId: parentTask.projectId, // Inherit project_id from parent
        // assignee_id, reporter_id, due_date, priority would typically be inherited or optional for subtasks
        // For this basic implementation, we'll omit them or set defaults/null.
        // Depending on requirements, assignees/due_dates might apply directly to subtasks.
      })
      .returning(); // Returning the inserted subtask data

    if (!newSubtask) {
      // This case is unlikely with returning() but good practice
      return NextResponse.json({ error: 'Failed to create subtask' }, { status: 500 });
    }


    return NextResponse.json(newSubtask, { status: 201 });

  } catch (error) {
    console.error('Error creating subtask:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}