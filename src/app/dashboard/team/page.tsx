"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Mail, Phone } from 'lucide-react';
import { useProjectData } from '@/hooks/use-project-data';
import { TeamMemberDialog } from '@/components/team/team-member-dialog';

const Team = () => {
    const { users, projects } = useProjectData();
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'manager': return 'bg-blue-100 text-blue-800';
            case 'member': return 'bg-green-100 text-green-800';
            case 'client': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUserProjects = (userId: string) => {
        return projects.filter(project =>
            project.team.some(member => member.id === userId) || project.owner.id === userId
        );
    };

    return (
        <>
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Team</h1>
                            <p className="text-gray-600 mt-1">
                                Manage your team members and their roles.
                            </p>
                        </div>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Team Member
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search team members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <Card key={user.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback className="text-lg">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                                {user.isOnline && (
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <Badge className={getRoleColor(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="h-4 w-4" />
                                            {user.email}
                                        </div>
                                        {user.department && (
                                            <div className="text-sm text-gray-600">
                                                Department: {user.department}
                                            </div>
                                        )}
                                    </div>

                                    {/* Projects */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Projects</h4>
                                        <div className="space-y-1">
                                            {getUserProjects(user.id).slice(0, 3).map((project) => (
                                                <div key={project.id} className="flex items-center gap-2 text-sm">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: project.color }}
                                                    />
                                                    <span className="text-gray-600">{project.name}</span>
                                                    {project.owner.id === user.id && (
                                                        <Badge variant="outline" className="text-xs">Owner</Badge>
                                                    )}
                                                </div>
                                            ))}
                                            {getUserProjects(user.id).length > 3 && (
                                                <div className="text-xs text-gray-500">
                                                    +{getUserProjects(user.id).length - 3} more projects
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            View Profile
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>


            <TeamMemberDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
            />
        </>
    );
};

export default Team;
