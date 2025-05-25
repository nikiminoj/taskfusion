"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function SearchCommand() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className="relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search projects, tasks...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Projects">
            <CommandItem>
              <span>Website Redesign</span>
            </CommandItem>
            <CommandItem>
              <span>Mobile App Development</span>
            </CommandItem>
            <CommandItem>
              <span>API Integration</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Tasks">
            <CommandItem>
              <span>Design user onboarding flow</span>
            </CommandItem>
            <CommandItem>
              <span>Implement authentication API</span>
            </CommandItem>
            <CommandItem>
              <span>Set up CI/CD pipeline</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
