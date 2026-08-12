import React, { useEffect, useState } from "react";
import { ListChecks, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import api from "../../services/api";
import StatCard from "../../components/StatCard";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#a855f7", "#14b8a6", "#f43f5e", "#84cc16", "#64748b"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard-stats").then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p className="text-sm text-gray-400">Loading dashboard...</p>;

  const { cards, charts } = stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Overview of complaint activity across the college.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ListChecks} label="Total Complaints" value={cards.total} color="indigo" />
        <StatCard icon={Clock} label="Pending" value={cards.pending} color="amber" />
        <StatCard icon={CheckCircle2} label="Resolved" value={cards.resolved} color="green" />
        <StatCard icon={AlertTriangle} label="Escalated" value={cards.escalated} color="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Complaint Category Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={charts.byCategory} dataKey="count" nameKey="category" outerRadius={100} label>
                {charts.byCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Hostel/Department-wise Complaints</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={charts.byHostel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hostel" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={charts.byStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="status" width={90} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 flex flex-col items-center justify-center">
          <h2 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Resolution Rate</h2>
          <div className="text-5xl font-bold text-primary-600">{charts.resolutionPercentage}%</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">of all complaints resolved</p>
        </div>
      </div>
    </div>
  );
}
