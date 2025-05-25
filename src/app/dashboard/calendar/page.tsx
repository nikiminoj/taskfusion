"use client";

import React, { useState } from 'react';
import Calendar from '@/components/Calendar/Calendar';
import CalendarFilters from '@/components/Calendar/CalendarFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { projects } from '@/server/db/schema';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { subMonths, addMonths, isSameDay, eachDayOfInterval, startOfMonth, endOfMonth, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Badge } from 'lucide-react';
import { useProjectData } from '@/hooks/use-project-data';

const CalendarPage: React.FC = () => {
  const { projects, tasks } = useProjectData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const filteredTasks = tasks.filter(task => {
    if (selectedProject === 'all') return true;
    return task.projectId === selectedProject;
  });

  const getTasksForDate = (date: Date) => {
    return filteredTasks.filter(task => {
      if (task.dueDate && isSameDay(task.dueDate, date)) return true;
      if (task.startDate && isSameDay(task.startDate, date)) return true;
      return false;
    });
  };

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#3B82F6';
  };

  const getTasksForSelectedDate = () => {
    return getTasksForDate(selectedDate);
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  return (
    <div className="space-y-6">
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600 mt-1">
                View project timelines and track progress across teams.
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-semibold">
                      {format(currentMonth, 'MMMM yyyy')}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date())}
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-2 text-center font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {monthDays.map((day) => {
                      const dayTasks = getTasksForDate(day);
                      const isSelected = isSameDay(day, selectedDate);
                      const isToday = isSameDay(day, new Date());

                      return (
                        <div
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`
                              min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50
                              ${isSelected ? 'bg-blue-50 border-blue-300' : ''}
                              ${isToday ? 'bg-yellow-50' : ''}
                            `}
                        >
                          <div className={`
                              text-sm font-medium mb-1
                              ${isToday ? 'text-blue-600' : 'text-gray-900'}
                            `}>
                            {format(day, 'd')}
                          </div>
                          <div className="space-y-1">
                            {dayTasks.slice(0, 2).map((task) => (
                              <div
                                key={task.id}
                                className="text-xs p-1 rounded text-white truncate"
                                style={{ backgroundColor: getProjectColor(task.projectId) }}
                                title={task.title}
                              >
                                {task.title}
                              </div>
                            ))}
                            {dayTasks.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayTasks.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Date Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTasksForSelectedDate().length === 0 ? (
                      <p className="text-gray-500 text-sm">No tasks for this date</p>
                    ) : (
                      getTasksForSelectedDate().map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {task.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.status}
                            </Badge>
                          </div>
                          {task.assignee && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={task.assignee.avatar} />
                                <AvatarFallback className="text-xs">
                                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-600">{task.assignee.name}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Project Progress */}
              {selectedProject !== 'all' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const project = projects.find(p => p.id === selectedProject);
                      if (!project) return null;

                      return (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: project.color }}
                            />
                            <span className="font-medium">{project.name}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  backgroundColor: project.color,
                                  width: `${project.progress}%`
                                }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Start:</span>
                              <div>{format(project.startDate, 'MMM d')}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">End:</span>
                              <div>{format(project.endDate, 'MMM d')}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;