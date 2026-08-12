const asyncHandler = require("express-async-handler");
const { Complaint, AiSuggestion, User } = require("../models");
const { analyzeComplaint } = require("../utils/localAiEngine");

// @desc  Create a new complaint (with AI auto-analysis)
// @route POST /api/complaints
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, location, hostelOrDept, category: manualCategory, priority: manualPriority } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required");
  }

  const ai = analyzeComplaint(description);

  const complaint = await Complaint.create({
    userId: req.user.id,
    studentName: req.user.name,
    category: manualCategory || ai.category,
    title,
    description,
    location,
    hostelOrDept: hostelOrDept || req.user.hostel,
    priority: manualPriority || ai.priority,
    status: "Submitted",
  });

  await AiSuggestion.create({
    complaintId: complaint.id,
    suggestion: ai.suggestion,
    category: ai.category,
    solution: ai.solution,
    estimatedResolutionTime: ai.estimatedResolutionTime,
    confidence: ai.confidence,
  });

  res.status(201).json({
    success: true,
    message: "Complaint submitted successfully",
    complaint,
    aiInsights: ai,
  });
});

// @desc  Get logged-in student's complaints
// @route GET /api/complaints/mine
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.findAll({
    where: { userId: req.user.id },
    include: [{ model: AiSuggestion, as: "aiSuggestions" }],
    order: [["created_at", "DESC"]],
  });
  res.json({ success: true, count: complaints.length, complaints });
});

// @desc  Get single complaint by id (owner or admin/warden)
// @route GET /api/complaints/:id
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByPk(req.params.id, {
    include: [{ model: AiSuggestion, as: "aiSuggestions" }],
  });

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  if (req.user.role === "student" && complaint.userId !== req.user.id) {
    res.status(403);
    throw new Error("You are not authorized to view this complaint");
  }

  res.json({ success: true, complaint });
});

// @desc  Update complaint (student can edit own if still 'Submitted')
// @route PUT /api/complaints/:id
const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByPk(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }
  if (complaint.userId !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized");
  }
  if (complaint.status !== "Submitted") {
    res.status(400);
    throw new Error("Complaint can no longer be edited once it is being processed");
  }

  const { title, description, location } = req.body;
  if (title) complaint.title = title;
  if (description) complaint.description = description;
  if (location) complaint.location = location;

  await complaint.save();
  res.json({ success: true, message: "Complaint updated", complaint });
});

// @desc  Delete complaint (student, only if Submitted; admin any time)
// @route DELETE /api/complaints/:id
const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByPk(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }
  if (req.user.role === "student") {
    if (complaint.userId !== req.user.id || complaint.status !== "Submitted") {
      res.status(403);
      throw new Error("Not authorized to delete this complaint");
    }
  }
  await complaint.destroy();
  res.json({ success: true, message: "Complaint deleted" });
});

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
