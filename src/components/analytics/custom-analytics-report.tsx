import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AnalyticsData {
  // Define the structure of your analytics data based on your API response
  metric: string;
  value: number;
  // Add more fields as needed
}

interface CustomAnalyticsReportProps {
  // You might pass project or team IDs here if needed for initial filtering
}

const CustomAnalyticsReport: React.FC<CustomAnalyticsReportProps> = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [timeRange, setTimeRange] = useState<string>('');
  const [reportData, setReportData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const availableMetrics = [
    { value: 'taskCompletionRate', label: 'Task Completion Rate' },
    { value: 'avgTaskCompletionTime', label: 'Average Task Completion Time' },
    // Add more available metrics
  ];

  const availableFilters = [
    { value: 'projectId', label: 'Project' },
    { value: 'teamId', label: 'Team' },
    { value: 'userId', label: 'User' },
    // Add more available filters
  ];

  const timeRangeOptions = [
    { value: 'last7Days', label: 'Last 7 Days' },
    { value: 'last30Days', label: 'Last 30 Days' },
    { value: 'thisMonth', label: 'This Month' },
    // Add more time range options
  ];

  const handleMetricChange = (metric: string) => {
    setSelectedMetrics((prevMetrics) =>
      prevMetrics.includes(metric)
        ? prevMetrics.filter((m) => m !== metric)
        : [...prevMetrics, metric]
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      selectedMetrics.forEach((metric) => queryParams.append('metrics', metric));
      Object.entries(filters).forEach(([key, value]) => queryParams.append(key, value));
      if (timeRange) {
        queryParams.append('timeRange', timeRange);
      }

      const response = await fetch(`/api/analytics?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Error fetching analytics data: ${response.statusText}`);
      }

      const data: AnalyticsData[] = await response.json();
      setReportData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (reportData.length === 0) return;

    const header = Object.keys(reportData[0]).join(',');
    const rows = reportData.map((row) => Object.values(row).join(',')).join('\n');
    const csvContent = `${header}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'analytics_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Custom Analytics Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="metrics">Select Metrics:</Label>
          {availableMetrics.map((metric) => (
            <div key={metric.value} className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id={metric.value}
                checked={selectedMetrics.includes(metric.value)}
                onChange={() => handleMetricChange(metric.value)}
              />
              <Label htmlFor={metric.value}>{metric.label}</Label>
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="filters">Filters:</Label>
          {availableFilters.map((filter) => (
            <div key={filter.value} className="mt-2">
              <Label htmlFor={filter.value}>{filter.label}:</Label>
              <Input
                id={filter.value}
                value={filters[filter.value] || ''}
                onChange={(e) => handleFilterChange(filter.value, e.target.value)}
                placeholder={`Enter ${filter.label.toLowerCase()} ID`}
              />
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="timeRange">Time Range:</Label>
          <Select onValueChange={handleTimeRangeChange} value={timeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={generateReport} disabled={loading || selectedMetrics.length === 0}>
        {loading ? 'Generating...' : 'Generate Report'}
      </Button>

      {error && <div className="text-red-500 mt-4">Error: {error}</div>}

      {reportData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Report Results:</h3>
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(reportData[0]).map((key) => (
                  <TableHead key={key}>{key}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, i) => (
                    <TableCell key={i}>{String(value)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={downloadCSV} className="mt-4">
            Download CSV
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomAnalyticsReport;