"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface DashboardChartsProps {
  tasks: Task[];
}

const COLORS = {
  todo: "#3B82F6", // blue-600
  inProgress: "#EAB308", // yellow-600
  done: "#16A34A", // green-600
};

export function DashboardCharts({ tasks }: DashboardChartsProps) {
  // Prepare data for bar chart (tasks by status)
  const statusData = [
    {
      status: "To Do",
      count: tasks.filter((t) => t.status === "todo").length,
      fill: COLORS.todo,
    },
    {
      status: "In Progress",
      count: tasks.filter((t) => t.status === "inProgress").length,
      fill: COLORS.inProgress,
    },
    {
      status: "Done",
      count: tasks.filter((t) => t.status === "done").length,
      fill: COLORS.done,
    },
  ];

  // Prepare data for pie chart (completion rate)
  const completionData = [
    {
      name: "Completed",
      value: tasks.filter((t) => t.status === "done").length,
      fill: COLORS.done,
    },
    {
      name: "Incomplete",
      value: tasks.filter((t) => t.status !== "done").length,
      fill: "#D1D5DB", // gray-300
    },
  ];

  // Prepare data for timeline (tasks created over time)
  // Group tasks by date
  const timelineMap = new Map<string, number>();
  tasks.forEach((task) => {
    const date = new Date(task.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    timelineMap.set(date, (timelineMap.get(date) || 0) + 1);
  });

  const timelineData = Array.from(timelineMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      {/* Bar Chart - Tasks by Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Tasks by Status
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Completion Rate */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Completion Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={completionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {completionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Timeline */}
      {timelineData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Task Creation Timeline
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Tasks Created"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
