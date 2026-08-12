const asyncHandler = require("express-async-handler");
const { Feedback, Complaint } = require("../models");

// @desc  Submit feedback for a resolved complaint
// @route POST /api/feedback
const submitFeedback = asyncHandler(async (req, res) => {
  const { complaintId, rating, comment } = req.body;

  const complaint = await Complaint.findByPk(complaintId);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }
  if (complaint.userId !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to give feedback for this complaint");
  }
  if (complaint.status !== "Resolved") {
    res.status(400);
    throw new Error("Feedback can only be given for resolved complaints");
  }

  const feedback = await Feedback.create({
    userId: req.user.id,
    complaintId,
    rating,
    comment,
  });

  res.status(201).json({ success: true, message: "Thank you for your feedback", feedback });
});

// @desc  Get all feedback (admin)
// @route GET /api/feedback
const getAllFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findAll({
    include: [{ model: Complaint, as: "complaint", attributes: ["title", "category"] }],
    order: [["created_at", "DESC"]],
  });
  res.json({ success: true, feedback });
});

module.exports = { submitFeedback, getAllFeedback };
