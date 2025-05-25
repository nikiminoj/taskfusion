import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectTabs } from "@/components/projects/project-tabs"
import { TaskBoard } from "@/components/tasks/task-board"
import { ProjectTimeline } from "@/components/projects/project-timeline"
import { ProjectTeam } from "@/components/projects/project-team"
import { ProjectFiles } from "@/components/projects/project-files"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateTaskForm } from "@/components/tasks/create-task-form"

interface ProjectPageProps {
  params: {
    id: string
  }
  searchParams: {
    tab?: string
  }
}

export default function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = React.useState(false);
  const activeTab = searchParams.tab || "board"

  const handleTaskCreated = () => {
    setIsCreateTaskModalOpen(false);
    // Optionally, you can trigger a re-fetch of tasks here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ProjectHeader projectId={params.id} />
        <Dialog open={isCreateTaskModalOpen} onOpenChange={setIsCreateTaskModalOpen}>
          <DialogTrigger asChild>
            <Button>Create New Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <CreateTaskForm projectId={params.id} onSuccess={handleTaskCreated} />
          </DialogContent>
        </Dialog>
      </div>
      <ProjectTabs activeTab={activeTab} projectId={params.id} />

      {activeTab === "board" && <TaskBoard projectId={params.id} />}
      {activeTab === "timeline" && <ProjectTimeline projectId={params.id} />}
      {activeTab === "team" && <ProjectTeam projectId={params.id} />}
      {activeTab === "files" && <ProjectFiles projectId={params.id} />}
    </div>
  )
}
