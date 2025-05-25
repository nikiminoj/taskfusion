import { db } from "@/server/db";
import { tasks, projects, profiles } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allTasks = await db.query.tasks.findMany({
      with: {
        project: true,
        assignee: true,
      },
    });

    return NextResponse.json(allTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}