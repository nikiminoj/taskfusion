"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, Users, Target } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const projects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    status: "In Progress",
    progress: 75,
    dueDate: "Dec 15, 2024",
    team: [
      { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "SC" },
      { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "MJ" },
      { name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32", initials: "ED" },
    ],
    tasksCompleted: 24,
    totalTasks: 32,
    priority: "High",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Native mobile application for iOS and Android platforms",
    status: "In Progress",
    progress: 45,
    dueDate: "Jan 30, 2025",
    team: [
      { name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
      { name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "DK" },
    ],
    tasksCompleted: 18,
    totalTasks: 40,
    priority: "Medium",
  },
  {
    id: "3",
    name: "API Integration",
    description: "Integration with third-party APIs and services",
    status: "Review",
    progress: 90,
    dueDate: "Dec 8, 2024",
    team: [{ name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "MJ" }],
    tasksCompleted: 9,
    totalTasks: 10,
    priority: "Low",
  },
  {
    id: "4",
    name: "Database Migration",
    description: "Migration to new database infrastructure with improved performance",
    status: "Planning",
    progress: 15,
    dueDate: "Feb 15, 2025",
    team: [
      { name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "DK" },
      { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "SC" },
    ],
    tasksCompleted: 3,
    totalTasks: 20,
    priority: "High",
  },
]

export function ProjectsGrid() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "default"
      case "Review":
        return "secondary"
      case "Planning":
        return "outline"
      case "Completed":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  <Link href={`/projects/${project.id}`} className="hover:underline">
                    {project.name}
                  </Link>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                  <Badge variant={getPriorityColor(project.priority)}>{project.priority}</Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Project</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due {project.dueDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {project.tasksCompleted}/{project.totalTasks} tasks
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.team.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{project.team.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/projects/${project.id}`}>View Project</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
