import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tasks } from '@/server/db/schema';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  project_id: z.string().uuid('Invalid project ID'),
  assignee_id: z.string().uuid('Invalid assignee ID').optional(),
  due_date: z.string().datetime().optional(), // Consider a more robust date validation if needed
  status: z.enum(['todo', 'in_progress', 'done', 'blocked']).default('todo'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input data
    const validationResult = createTaskSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validationResult.error.formErrors.fieldErrors }, { status: 400 });
    }

    const { title, description, project_id, assignee_id, due_date, status } = validationResult.data;

    // Insert the new task into the database
    const newTask = await db.insert(tasks).values({
      title,
      description,
      project_id,
      assignee_id,
      due_date: due_date ? new Date(due_date) : null, // Convert date string to Date object
      status,
    }).returning(); // Return the newly created task

    if (!newTask || newTask.length === 0) {
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Task created successfully', task: newTask[0] }, { status: 201 });

  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}