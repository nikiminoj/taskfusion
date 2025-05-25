import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { ProjectMetrics } from "@/components/dashboard/project-metrics"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { TaskSummary } from "@/components/dashboard/task-summary"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <DashboardOverview />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProjectMetrics />
        </div>
        <TaskSummary />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <UpcomingDeadlines />
      </div>
    </div>
  )
}
