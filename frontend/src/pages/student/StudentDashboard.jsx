import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import api from "../../services/api";
import StatCard from "../../components/StatCard";
import ComplaintCard from "../../components/ComplaintCard";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/complaints/mine").then(({ data }) => {
      setComplaints(data.complaints);
      setLoading(false);
    });
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => !["Resolved", "Rejected"].includes(c.status)).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const escalated = complaints.filter((c) => c.status === "Escalated").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome, {user?.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Here's an overview of your complaints.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ListChecks} label="Total Complaints" value={total} color="indigo" />
        <StatCard icon={Clock} label="Pending" value={pending} color="amber" />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolved} color="green" />
        <StatCard icon={AlertTriangle} label="Escalated" value={escalated} color="red" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Complaints</h2>
        <Link to="/complaints/new" className="btn-primary text-sm">+ New Complaint</Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : complaints.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          You haven't submitted any complaints yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {complaints.slice(0, 4).map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
