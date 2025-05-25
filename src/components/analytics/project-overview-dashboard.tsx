'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

interface TaskData {
  status: string;
  count: number;
}

interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  taskDistributionByStatus: TaskData[];
  // Add other relevant analytics data fields here
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProjectOverviewDashboard: React.FC = () => {
  const { id } = useParams(); // Assuming project ID is in the URL params
  const projectId = Array.isArray(id) ? id[0] : id;

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`/api/analytics?projectId=${projectId}`);
        if (!response.ok) {
          throw new Error(`Error fetching analytics data: ${response.statusText}`);
        }
        const data: AnalyticsData = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [projectId]);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!analyticsData) {
    return <div>No analytics data available for this project.</div>;
  }

  const projectProgress = analyticsData.totalTasks > 0
    ? (analyticsData.completedTasks / analyticsData.totalTasks) * 100
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectProgress.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {analyticsData.completedTasks} of {analyticsData.totalTasks} tasks completed
          </p>
          {/* Could add a progress bar here */}
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Task Distribution by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.taskDistributionByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Add more cards and charts for other KPIs */}
      {/* Example: Pie chart for task distribution */}
      {analyticsData.taskDistributionByStatus && analyticsData.taskDistributionByStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Task Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analyticsData.taskDistributionByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label
                  >
                    {analyticsData.taskDistributionByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default ProjectOverviewDashboard;