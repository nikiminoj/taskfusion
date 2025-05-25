"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SC",
    },
    action: "completed task",
    target: "User Authentication Flow",
    project: "Mobile App",
    time: "2 minutes ago",
    type: "completed",
  },
  {
    id: 2,
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MJ",
    },
    action: "created new task",
    target: "API Documentation",
    project: "Backend Services",
    time: "15 minutes ago",
    type: "created",
  },
  {
    id: 3,
    user: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ED",
    },
    action: "updated milestone",
    target: "Beta Release",
    project: "Website Redesign",
    time: "1 hour ago",
    type: "updated",
  },
  {
    id: 4,
    user: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AR",
    },
    action: "commented on",
    target: "Design Review",
    project: "Mobile App",
    time: "2 hours ago",
    type: "commented",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your team and projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {activity.project}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
