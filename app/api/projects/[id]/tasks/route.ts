import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import type { Task } from "@/lib/types"

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  assigneeId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
  labels: z.array(z.string()).default([]),
  parentTaskId: z.string().uuid().optional(),
})

const updateTaskSchema = createTaskSchema.partial()

// GET /api/projects/[id]/tasks
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const assigneeId = searchParams.get("assigneeId")
    const priority = searchParams.get("priority")

    // In a real app, implement proper database queries with filters
    // Example with Prisma:
    /*
    const tasks = await prisma.task.findMany({
      where: {
        projectId: params.id,
        ...(status && { status }),
        ...(assigneeId && { assigneeId }),
        ...(priority && { priority }),
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true }
        },
        labels: true,
        dependencies: true,
        subtasks: {
          select: { id: true, title: true, status: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    */

    // Mock data for demonstration
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Design user onboarding flow",
        description: "Create wireframes and mockups for the user registration process",
        status: "todo",
        priority: "high",
        assigneeId: "user-1",
        projectId: params.id,
        estimatedHours: 8,
        dueDate: new Date("2024-12-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
        labels: ["Design", "UX"],
        dependencies: [],
      },
      // Add more mock tasks...
    ]

    return NextResponse.json(mockTasks)
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST /api/projects/[id]/tasks
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = createTaskSchema.parse(body)

    // In a real app, implement proper database creation
    /*
    const task = await prisma.task.create({
      data: {
        ...validatedData,
        projectId: params.id,
        id: crypto.randomUUID(),
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    // Send real-time notification
    await notificationService.send({
      type: 'task_created',
      projectId: params.id,
      taskId: task.id,
      data: task
    })
    */

    const newTask: Task = {
      id: crypto.randomUUID(),
      ...validatedData,
      projectId: params.id,
      status: "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
      labels: validatedData.labels || [],
      dependencies: [],
    }

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("Failed to create task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
