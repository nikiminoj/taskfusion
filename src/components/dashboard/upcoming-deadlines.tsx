"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

const deadlines = [
  {
    id: 1,
    title: "Website Launch",
    project: "Website Redesign",
    dueDate: "Dec 15, 2024",
    daysLeft: 3,
    priority: "high",
  },
  {
    id: 2,
    title: "API Testing Complete",
    project: "Backend Services",
    dueDate: "Dec 18, 2024",
    daysLeft: 6,
    priority: "medium",
  },
  {
    id: 3,
    title: "User Feedback Review",
    project: "Mobile App",
    dueDate: "Dec 22, 2024",
    daysLeft: 10,
    priority: "low",
  },
  {
    id: 4,
    title: "Security Audit",
    project: "Platform Security",
    dueDate: "Dec 25, 2024",
    daysLeft: 13,
    priority: "high",
  },
]

export function UpcomingDeadlines() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Important milestones and deadlines to track</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium">{deadline.title}</h4>
                  <Badge
                    variant={
                      deadline.priority === "high"
                        ? "destructive"
                        : deadline.priority === "medium"
                          ? "default"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {deadline.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{deadline.project}</p>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{deadline.dueDate}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span className={deadline.daysLeft <= 5 ? "text-red-600 font-medium" : ""}>
                    {deadline.daysLeft} days left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
