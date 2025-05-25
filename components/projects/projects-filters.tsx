"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Filter, Search, X } from "lucide-react"

export function ProjectsFilters() {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search projects..." className="pl-8" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Planning</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>On Hold</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Completed</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Priority
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>Critical</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>High</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Medium</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Low</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="gap-1">
          Active
          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
            <X className="h-3 w-3" />
          </Button>
        </Badge>
        <Badge variant="secondary" className="gap-1">
          High Priority
          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      </div>
    </div>
  )
}
