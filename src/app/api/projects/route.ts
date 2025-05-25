import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allProjects = await db.select().from(projects);
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ message: "Error fetching projects" }, { status: 500 });
  }
}