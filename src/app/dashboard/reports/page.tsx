"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProjectData } from "@/hooks/use-project-data";
import { CheckSquare, DollarSign, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ReportsPage = () => {
    const { projects, tasks, users } = useProjectData();

    // Calculate KPIs
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const spentBudget = projects.reduce((sum, p) => sum + (p.spentBudget || 0), 0);
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;

    // Project status distribution
    const statusData = [
        { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: '#10B981' },
        { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: '#3B82F6' },
        { name: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length, color: '#F59E0B' },
        { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#6B7280' },
    ];

    // Task priority distribution
    const priorityData = [
        { priority: 'Critical', count: tasks.filter(t => t.priority === 'critical').length },
        { priority: 'High', count: tasks.filter(t => t.priority === 'high').length },
        { priority: 'Medium', count: tasks.filter(t => t.priority === 'medium').length },
        { priority: 'Low', count: tasks.filter(t => t.priority === 'low').length },
    ];

    // Team productivity (mock data for demonstration)
    const teamProductivity = users.map(user => ({
        name: user.name,
        tasksCompleted: Math.floor(Math.random() * 20) + 5,
        hoursLogged: Math.floor(Math.random() * 40) + 20,
    }));

    return (

        <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-gray-600 mt-1">
                            Track KPIs and analyze project performance.
                        </p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                                    <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
                                    <p className="text-sm text-green-600 flex items-center mt-1">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        {activeProjects} active
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <CheckSquare className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Task Completion</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {Math.round((completedTasks / totalTasks) * 100)}%
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {completedTasks} of {totalTasks} tasks
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckSquare className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {Math.round((spentBudget / totalBudget) * 100)}%
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        ${spentBudget.toLocaleString()} spent
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <DollarSign className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {Math.round(avgProgress)}%
                                    </p>
                                    <p className="text-sm text-green-600 flex items-center mt-1">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        On track
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Project Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Task Priority Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Priority Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={priorityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="priority" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Team Productivity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Productivity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-4">Tasks Completed</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={teamProductivity}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="tasksCompleted" fill="#10B981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-4">Hours Logged</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={teamProductivity}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="hoursLogged" fill="#8B5CF6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Project Progress Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Progress Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: project.color }}
                                            />
                                            <span className="font-medium">{project.name}</span>
                                            <Badge variant="outline">{project.status}</Badge>
                                        </div>
                                        <span className="text-sm font-medium">{project.progress}%</span>
                                    </div>
                                    <Progress value={project.progress} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default ReportsPage;