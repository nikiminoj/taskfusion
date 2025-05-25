import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectTabs } from "@/components/projects/project-tabs"
import { TaskBoard } from "@/components/tasks/task-board"
import { ProjectTimeline } from "@/components/projects/project-timeline"
import { ProjectTeam } from "@/components/projects/project-team"
import { ProjectFiles } from "@/components/projects/project-files"

interface ProjectPageProps {
  params: {
    id: string
  }
  searchParams: {
    tab?: string
  }
}

export default function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const activeTab = searchParams.tab || "board"

  return (
    <div className="space-y-6">
      <ProjectHeader projectId={params.id} />
      <ProjectTabs activeTab={activeTab} projectId={params.id} />

      {activeTab === "board" && <TaskBoard projectId={params.id} />}
      {activeTab === "timeline" && <ProjectTimeline projectId={params.id} />}
      {activeTab === "team" && <ProjectTeam projectId={params.id} />}
      {activeTab === "files" && <ProjectFiles projectId={params.id} />}
    </div>
  )
}
