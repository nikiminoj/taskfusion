"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle, Clock, Users } from "lucide-react"

const stats = [
  {
    title: "Active Projects",
    value: "12",
    description: "+2 from last month",
    icon: CalendarDays,
    color: "text-blue-600",
  },
  {
    title: "Completed Tasks",
    value: "1,429",
    description: "+12% from last week",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Team Members",
    value: "24",
    description: "+3 new this month",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Avg. Completion Time",
    value: "3.2 days",
    description: "-0.5 days improvement",
    icon: Clock,
    color: "text-orange-600",
  },
]

const projects = [
  {
    name: "Website Redesign",
    progress: 75,
    status: "On Track",
    dueDate: "Dec 15, 2024",
    team: 8,
  },
  {
    name: "Mobile App Development",
    progress: 45,
    status: "At Risk",
    dueDate: "Jan 30, 2025",
    team: 12,
  },
  {
    name: "API Integration",
    progress: 90,
    status: "Ahead",
    dueDate: "Dec 8, 2024",
    team: 5,
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
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
