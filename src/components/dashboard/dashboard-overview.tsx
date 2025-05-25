"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle, Clock, Users } from "lucide-react"

export function DashboardOverview() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsResponse, tasksResponse] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/tasks'),
        ]);

        if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
        if (!tasksResponse.ok) throw new Error('Failed to fetch tasks');

        const projectsData = await projectsResponse.json();
        const tasksData = await tasksResponse.json();

        setProjects(projectsData);
        setTasks(tasksData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Error loading dashboard: {error}</div>;
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter(project => project.status === 'in_progress' || project.status === 'not_started').length;
  const totalTasks = tasks.length;
  const openTasks = tasks.filter(task => task.status === 'todo' || task.status === 'in_progress').length;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects.toString(),
      description: "Overall projects",
      icon: CalendarDays,
      color: "text-blue-600",
    },
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      description: "Currently being worked on",
      icon: CalendarDays, // You might want a different icon for active projects
      color: "text-cyan-600",
    },
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      description: "Across all projects",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Open Tasks",
      value: openTasks.toString(),
      description: "Yet to be completed",
      icon: Clock, // You might want a different icon for open tasks
      color: "text-orange-600",
    },
  ];

  // Calculate project progress (example: based on completed tasks vs total tasks in a project)
  const projectsWithProgress = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.id); // Assuming task has projectId field
    const completedProjectTasks = projectTasks.filter(task => task.status === 'done').length;
    const progress = projectTasks.length > 0 ? (completedProjectTasks / projectTasks.length) * 100 : 0;
    // You'll need to determine how to calculate 'team members' from your data
    // For now, let's assume project object might have a teamMembers count or you fetch it separately
    // Or you could count unique assignees in project tasks.
    const teamMembers = new Set(projectTasks.map(task => task.assigneeId).filter(id => id !== null)).size;

    // Map database status to a display status and badge variant
    let displayStatus = project.status;
    let badgeVariant: "default" | "secondary" | "destructive" = "secondary";
    switch (project.status) {
      case 'in_progress':
        displayStatus = 'In Progress';
        badgeVariant = 'default'; // Or a different color
        break;
      case 'completed':
        displayStatus = 'Completed';
        badgeVariant = 'secondary'; // Or success variant if you have one
        break;
      case 'on_hold':
        displayStatus = 'On Hold';
        badgeVariant = 'destructive'; // Or a warning variant
        break;
      case 'not_started':
        displayStatus = 'Not Started';
        badgeVariant = 'secondary';
        break;
      case 'cancelled':
        displayStatus = 'Cancelled';
        badgeVariant = 'destructive';
        break;
      default:
        break;
    }

    return {
      ...project,
      progress: Math.round(progress),
      displayStatus,
      badgeVariant,
      teamMembersCount: teamMembers,
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon && <stat.icon className={`h-4 w-4 ${stat.color}`} />}\n
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Overview of your active projects and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {project.dueDate} • {project.team} team members
                    </p>
                  </div>
                  <Badge
                    variant={
                      project.status === "On Track"
                        ? "default"
                        : project.status === "At Risk"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <Progress value={project.progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">{project.progress}% complete</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
