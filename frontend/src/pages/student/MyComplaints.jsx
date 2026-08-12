import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ComplaintCard from "../../components/ComplaintCard";

const STATUSES = ["All", "Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Rejected", "Escalated"];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/complaints/mine").then(({ data }) => {
      setComplaints(data.complaints);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Complaints</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track the status of everything you've submitted.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              filter === s
                ? "bg-primary-600 text-white border-primary-600"
                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">No complaints match this filter.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
