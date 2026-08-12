import React from "react";

const statusColors = {
  Submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Under Review": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Assigned: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "In Progress": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Resolved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Rejected: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  Escalated: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const priorityColors = {
  Low: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  Medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function ComplaintCard({ complaint, children }) {
  const ai = complaint.aiSuggestions?.[0];
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{complaint.title}</h3>
          <p className="text-xs text-gray-400">#{complaint.id} • {complaint.category}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`badge ${statusColors[complaint.status] || ""}`}>{complaint.status}</span>
          <span className={`badge ${priorityColors[complaint.priority] || ""}`}>{complaint.priority}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{complaint.description}</p>
      {ai && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-lg p-3 text-xs text-primary-800 dark:text-primary-300">
          <p className="font-semibold mb-1">🤖 AI Insight</p>
          <p>{ai.suggestion}</p>
          {ai.solution && <p className="mt-1"><span className="font-medium">Suggested solution:</span> {ai.solution}</p>}
          {ai.estimatedResolutionTime && (
            <p className="mt-1"><span className="font-medium">Estimated resolution:</span> {ai.estimatedResolutionTime}</p>
          )}
        </div>
      )}
      {complaint.assignedTo && (
        <p className="text-xs text-gray-500">Assigned to: <span className="font-medium">{complaint.assignedTo}</span></p>
      )}
      {complaint.resolutionNotes && (
        <p className="text-xs text-gray-500">Resolution notes: {complaint.resolutionNotes}</p>
      )}
      {children}
    </div>
  );
}
