import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { ProjectsFilters } from "@/components/projects/projects-filters"

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <ProjectsHeader />
      <ProjectsFilters />
      <ProjectsGrid />
    </div>
  )
}
