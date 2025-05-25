"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  assignee: {
    name: string
    avatar: string
    initials: string
  }
  labels: string[]
  dueDate: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "1",
        title: "Design user onboarding flow",
        description: "Create wireframes and mockups for the user registration process",
        priority: "high",
        assignee: {
          name: "Sarah Chen",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "SC",
        },
        labels: ["Design", "UX"],
        dueDate: "Dec 15",
      },
      {
        id: "2",
        title: "Set up CI/CD pipeline",
        description: "Configure automated testing and deployment",
        priority: "medium",
        assignee: {
          name: "Mike Johnson",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "MJ",
        },
        labels: ["DevOps", "Backend"],
        dueDate: "Dec 18",
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    tasks: [
      {
        id: "3",
        title: "Implement authentication API",
        description: "Build JWT-based authentication system",
        priority: "high",
        assignee: {
          name: "Alex Rodriguez",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "AR",
        },
        labels: ["Backend", "Security"],
        dueDate: "Dec 20",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    tasks: [
      {
        id: "4",
        title: "Mobile app testing",
        description: "Comprehensive testing of mobile application features",
        priority: "medium",
        assignee: {
          name: "Emily Davis",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "ED",
        },
        labels: ["Testing", "Mobile"],
        dueDate: "Dec 16",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "5",
        title: "Database schema design",
        description: "Complete database structure for user management",
        priority: "low",
        assignee: {
          name: "David Kim",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "DK",
        },
        labels: ["Database", "Backend"],
        dueDate: "Dec 10",
      },
    ],
  },
]

interface TaskBoardProps {
  projectId: string
}

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [columns, setColumns] = useState(initialColumns)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <Card key={column.id} className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {column.tasks.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.tasks.map((task) => (
                <Card key={task.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Assign</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {task.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                          <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                        </Avatar>
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    </div>
                  </div>
                </Card>
              ))}

              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add task
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
