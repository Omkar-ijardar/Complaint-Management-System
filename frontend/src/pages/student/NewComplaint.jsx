import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Sparkles, Wand2 } from "lucide-react";
import api from "../../services/api";

const CATEGORIES = [
  "Hostel Maintenance", "Electricity", "Water Problem", "Food Quality",
  "Cleanliness", "Internet Issue", "Ragging", "Security", "Academic Issue", "Other",
];

export default function NewComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", location: "", category: "", priority: "" });
  const [aiPreview, setAiPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const analyze = async () => {
    if (!form.description.trim()) {
      toast.error("Please describe the issue first");
      return;
    }
    setAnalyzing(true);
    try {
      const { data } = await api.post("/ai/analyze", { text: form.description });
      setAiPreview(data.result);
      setForm((f) => ({ ...f, category: data.result.category, priority: data.result.priority }));
      toast.success("AI analysis complete");
    } catch {
      toast.error("Could not analyze complaint");
    } finally {
      setAnalyzing(false);
    }
  };

  const generateProfessional = async () => {
    if (!form.description.trim()) {
      toast.error("Type a short description first");
      return;
    }
    setGenerating(true);
    try {
      const { data } = await api.post("/ai/generate-complaint", { text: form.description });
      setForm((f) => ({
        ...f,
        title: f.title || data.result.subject.replace("Subject: ", ""),
        description: data.result.description,
        category: data.result.category,
      }));
      toast.success("Professional draft generated");
    } catch {
      toast.error("Could not generate draft");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/complaints", form);
      toast.success("Complaint submitted successfully");
      navigate("/complaints");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Submit a New Complaint</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Describe your issue — our local AI assistant will suggest the category, priority, and solution.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            className="input-field mt-1"
            placeholder="Short summary, e.g. Room fan not working"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            className="input-field mt-1 min-h-[120px]"
            placeholder="e.g. My room fan is not working since yesterday"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={analyze} disabled={analyzing} className="btn-secondary text-xs flex items-center gap-1">
              <Sparkles size={14} /> {analyzing ? "Analyzing..." : "AI: Analyze Complaint"}
            </button>
            <button type="button" onClick={generateProfessional} disabled={generating} className="btn-secondary text-xs flex items-center gap-1">
              <Wand2 size={14} /> {generating ? "Generating..." : "AI: Make it Professional"}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <input
            className="input-field mt-1"
            placeholder="e.g. Block A, Room 204"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              className="input-field mt-1"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Auto-detect (AI)</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <select
              className="input-field mt-1"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="">Auto-detect (AI)</option>
              {["Low", "Medium", "High", "Critical"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {aiPreview && (
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-lg p-4 text-sm text-primary-800 dark:text-primary-300 space-y-1">
            <p className="font-semibold flex items-center gap-1"><Sparkles size={14} /> AI Preview</p>
            <p>Category: <b>{aiPreview.category}</b> (confidence {(aiPreview.confidence * 100).toFixed(0)}%)</p>
            <p>Priority: <b>{aiPreview.priority}</b></p>
            <p>Recommended department: {aiPreview.department}</p>
            <p>Suggested solution: {aiPreview.solution}</p>
            <p>Estimated resolution time: {aiPreview.estimatedResolutionTime}</p>
          </div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
