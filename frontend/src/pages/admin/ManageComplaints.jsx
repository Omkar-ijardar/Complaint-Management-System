import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, Zap } from "lucide-react";
import api from "../../services/api";
import ComplaintCard from "../../components/ComplaintCard";

const STATUS_OPTIONS = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Rejected", "Escalated"];

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [assignInput, setAssignInput] = useState({});
  const [notesInput, setNotesInput] = useState({});

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/admin/complaints", { params: statusFilter ? { status: statusFilter } : {} });
    setComplaints(data.complaints);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/complaints/${id}/status`, { status, resolutionNotes: notesInput[id] });
      toast.success("Status updated");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAssign = async (id) => {
    if (!assignInput[id]) {
      toast.error("Enter staff/department name to assign");
      return;
    }
    try {
      await api.put(`/admin/complaints/${id}/assign`, { assignedTo: assignInput[id] });
      toast.success("Complaint assigned");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign");
    }
  };

  const handleEscalate = async (id) => {
    try {
      await api.post(`/admin/complaints/${id}/escalate`, { reason: "Manually escalated by authority" });
      toast.success("Complaint escalated");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to escalate");
    }
  };

  const downloadPdf = async () => {
    try {
      const res = await api.get("/admin/reports/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "complaint_report.pdf";
      link.click();
    } catch {
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Complaints</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Assign, update, and escalate complaints.</p>
        </div>
        <button onClick={downloadPdf} className="btn-primary flex items-center gap-2 text-sm">
          <Download size={16} /> Export PDF Report
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
            !statusFilter ? "bg-primary-600 text-white border-primary-600" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              statusFilter === s ? "bg-primary-600 text-white border-primary-600" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : complaints.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">No complaints found.</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {complaints.map((c) => (
            <ComplaintCard key={c.id} complaint={c}>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-2 space-y-2">
                <p className="text-xs text-gray-400">
                  Student: {c.student?.name} ({c.student?.email}) • {c.student?.hostel || "N/A"}
                </p>
                <div className="flex gap-2">
                  <select
                    className="input-field text-xs"
                    defaultValue={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => handleEscalate(c.id)} className="btn-secondary text-xs flex items-center gap-1">
                    <Zap size={14} /> Escalate
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="Assign to staff/department"
                    className="input-field text-xs"
                    value={assignInput[c.id] || ""}
                    onChange={(e) => setAssignInput((a) => ({ ...a, [c.id]: e.target.value }))}
                  />
                  <button onClick={() => handleAssign(c.id)} className="btn-secondary text-xs">Assign</button>
                </div>
                <textarea
                  placeholder="Resolution notes (used when marking Resolved)"
                  className="input-field text-xs"
                  value={notesInput[c.id] || ""}
                  onChange={(e) => setNotesInput((n) => ({ ...n, [c.id]: e.target.value }))}
                />
              </div>
            </ComplaintCard>
          ))}
        </div>
      )}
    </div>
  );
}
