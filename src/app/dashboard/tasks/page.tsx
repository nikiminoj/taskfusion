"use client";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProjectData } from "@/hooks/use-project-data";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const TasksPage = () => {
    const { tasks, projects, users } = useProjectData();
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'review': return 'bg-purple-100 text-purple-800';
            case 'blocked': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getProjectName = (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        return project?.name || 'Unknown Project';
    };

    return (
        <>
            <main className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                            <p className="text-gray-600 mt-1">
                                Track and manage all your tasks across projects.
                            </p>
                        </div>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Task
                        </Button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['all', 'todo', 'in-progress', 'review', 'completed', 'blocked'].map((status) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter(status)}
                                >
                                    {status === 'all' ? 'All' : status.replace('-', ' ')}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-4">
                        {filteredTasks.map((task) => (
                            <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                                                <Badge className={getStatusColor(task.status)}>
                                                    {task.status}
                                                </Badge>
                                                <Badge className={getPriorityColor(task.priority)}>
                                                    {task.priority}
                                                </Badge>
                                            </div>

                                            {task.description && (
                                                <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>Project: {getProjectName(task.projectId)}</span>
                                                {task.dueDate && (
                                                    <span>Due: {task.dueDate.toLocaleDateString()}</span>
                                                )}
                                                {task.estimatedHours && (
                                                    <span>Est: {task.estimatedHours}h</span>
                                                )}
                                                {task.loggedHours && (
                                                    <span>Logged: {task.loggedHours}h</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {task.assignee && (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={task.assignee.avatar} />
                                                        <AvatarFallback>
                                                            {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm text-gray-600">{task.assignee.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>

            <TaskFormDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                projects={projects}
                users={users}
            />
        </>
    );
}

export default TasksPage;