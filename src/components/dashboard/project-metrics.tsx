"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

const chartData = [
  { month: "Jan", completed: 45, inProgress: 23, planned: 12 },
  { month: "Feb", completed: 52, inProgress: 28, planned: 15 },
  { month: "Mar", completed: 48, inProgress: 31, planned: 18 },
  { month: "Apr", completed: 61, inProgress: 25, planned: 14 },
  { month: "May", completed: 55, inProgress: 33, planned: 22 },
  { month: "Jun", completed: 67, inProgress: 29, planned: 16 },
]

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-3))",
  },
}

export function ProjectMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Metrics</CardTitle>
        <CardDescription>Task completion trends over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="completed"
              stackId="1"
              stroke="var(--color-completed)"
              fill="var(--color-completed)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="inProgress"
              stackId="1"
              stroke="var(--color-inProgress)"
              fill="var(--color-inProgress)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="planned"
              stackId="1"
              stroke="var(--color-planned)"
              fill="var(--color-planned)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
