import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import api from "../../services/api";

export default function Feedback() {
  const [resolved, setResolved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    api.get("/complaints/mine").then(({ data }) => {
      setResolved(data.complaints.filter((c) => c.status === "Resolved"));
      setLoading(false);
    });
  }, []);

  const submitFeedback = async (complaintId) => {
    const rating = ratings[complaintId] || 5;
    setSubmittingId(complaintId);
    try {
      await api.post("/feedback", { complaintId, rating, comment: comments[complaintId] || "" });
      toast.success("Feedback submitted, thank you!");
      setResolved((r) => r.filter((c) => c.id !== complaintId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit feedback");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Give Feedback</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Rate how your resolved complaints were handled.</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : resolved.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          No resolved complaints awaiting feedback right now.
        </div>
      ) : (
        <div className="space-y-4">
          {resolved.map((c) => (
            <div key={c.id} className="card p-5 space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{c.title}</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRatings((r) => ({ ...r, [c.id]: n }))}
                    className="p-0.5"
                  >
                    <Star
                      size={22}
                      className={(ratings[c.id] || 0) >= n ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
              <textarea
                className="input-field text-sm"
                placeholder="Optional comments..."
                value={comments[c.id] || ""}
                onChange={(e) => setComments((cm) => ({ ...cm, [c.id]: e.target.value }))}
              />
              <button
                onClick={() => submitFeedback(c.id)}
                disabled={submittingId === c.id}
                className="btn-primary text-sm"
              >
                {submittingId === c.id ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
