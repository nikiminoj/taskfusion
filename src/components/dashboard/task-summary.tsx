"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const taskStats = [
  {
    priority: "High",
    count: 8,
    total: 45,
    color: "bg-red-500",
  },
  {
    priority: "Medium",
    count: 23,
    total: 45,
    color: "bg-yellow-500",
  },
  {
    priority: "Low",
    count: 14,
    total: 45,
    color: "bg-green-500",
  },
]

export function TaskSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Summary</CardTitle>
        <CardDescription>Current task distribution by priority</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {taskStats.map((stat) => (
          <div key={stat.priority} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <span className="text-sm font-medium">{stat.priority} Priority</span>
              </div>
              <Badge variant="secondary">{stat.count}</Badge>
            </div>
            <Progress value={(stat.count / stat.total) * 100} className="h-2" />
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Active Tasks</span>
            <span className="font-medium">45</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
