"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Subtask } from "@/server/db/schema"
import { fetchTasksByProjectId } from "@/lib/api"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "inprogress" | "review" | "done"
 dueDate: string | null
  projectId: string
  subtasks: Subtask[]
  assignee: {
    name: string
    avatar: string
    initials: string
  }
  labels: string[]
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const statuses = ["todo", "inprogress", "review", "done"]

interface TaskBoardProps {
  projectId: string
}

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const tasks = await fetchTasksByProjectId(projectId)
        const initialColumns: Column[] = statuses.map(status => ({
          id: status,
          title: status.charAt(0).toUpperCase() + status.slice(1),
          tasks: tasks.filter(task => task.status === status)
        }))
        setColumns(initialColumns)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        // Handle error, maybe set an error state
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [projectId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "inprogress":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      {loading && <p>Loading tasks...</p>}
      {!loading && columns.every(column => column.tasks.length === 0) && (
        <p>No tasks found for this project.</p>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {!loading && (
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
                          {/* Assuming assignee data is available in the fetched tasks */}
                          {/* <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                          <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback> */}
                          <AvatarFallback className="text-xs">?</AvatarFallback> {/* Placeholder */}
                        </Avatar>
                        <Badge variant={getStatusColor(task.status)} className="text-xs">
                          {task.status}
                        </Badge>
                      </div>
                      {task.dueDate && <span className="text-xs text-muted-foreground">{task.dueDate}</span>}
                    </div>

                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="space-y-1 mt-2">
                        <h5 className="text-xs font-medium">Subtasks:</h5>
                        {task.subtasks.map(subtask => (
                          <p key={subtask.id} className="text-xs text-muted-foreground">- {subtask.title} ({subtask.status})</p>
                        ))}
                      </div>
                    )}
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
