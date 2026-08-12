const asyncHandler = require("express-async-handler");
const PDFDocument = require("pdfkit");
const { Op, fn, col } = require("sequelize");
const { Complaint, User, AiSuggestion, Escalation } = require("../models");

// @desc  Get all complaints (with filters)
// @route GET /api/admin/complaints
const getAllComplaints = asyncHandler(async (req, res) => {
  const { status, category, priority, hostel } = req.query;
  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (priority) where.priority = priority;
  if (hostel) where.hostelOrDept = hostel;

  const complaints = await Complaint.findAll({
    where,
    include: [
      { model: User, as: "student", attributes: ["id", "name", "email", "hostel"] },
      { model: AiSuggestion, as: "aiSuggestions" },
    ],
    order: [["created_at", "DESC"]],
  });

  res.json({ success: true, count: complaints.length, complaints });
});

// @desc  Assign complaint to staff/department
// @route PUT /api/admin/complaints/:id/assign
const assignComplaint = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;
  const complaint = await Complaint.findByPk(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }
  complaint.assignedTo = assignedTo;
  complaint.status = "Assigned";
  await complaint.save();
  res.json({ success: true, message: "Complaint assigned", complaint });
});

// @desc  Update complaint status (Under Review / In Progress / Resolved / Rejected)
// @route PUT /api/admin/complaints/:id/status
const updateStatus = asyncHandler(async (req, res) => {
  const { status, resolutionNotes } = req.body;
  const validStatuses = [
    "Submitted", "Under Review", "Assigned", "In Progress",
    "Resolved", "Rejected", "Escalated",
  ];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const complaint = await Complaint.findByPk(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.status = status;
  if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
  if (status === "Resolved") complaint.resolvedAt = new Date();

  await complaint.save();
  res.json({ success: true, message: "Status updated", complaint });
});

// @desc  Manually escalate a complaint
// @route POST /api/admin/complaints/:id/escalate
const escalateComplaint = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const complaint = await Complaint.findByPk(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.status = "Escalated";
  complaint.priority = "Critical";
  await complaint.save();

  await Escalation.create({
    complaintId: complaint.id,
    reason: reason || "Manually escalated by admin/warden",
  });

  res.json({ success: true, message: "Complaint escalated", complaint });
});

// @desc  Dashboard summary stats + chart data
// @route GET /api/admin/dashboard-stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const total = await Complaint.count();
  const pending = await Complaint.count({
    where: { status: { [Op.in]: ["Submitted", "Under Review", "Assigned", "In Progress"] } },
  });
  const resolved = await Complaint.count({ where: { status: "Resolved" } });
  const escalated = await Complaint.count({ where: { status: "Escalated" } });

  const byCategory = await Complaint.findAll({
    attributes: ["category", [fn("COUNT", col("id")), "count"]],
    group: ["category"],
  });

  const byHostel = await Complaint.findAll({
    attributes: ["hostel_or_dept", [fn("COUNT", col("id")), "count"]],
    group: ["hostel_or_dept"],
  });

  const byStatus = await Complaint.findAll({
    attributes: ["status", [fn("COUNT", col("id")), "count"]],
    group: ["status"],
  });

  const resolutionPercentage = total > 0 ? Number(((resolved / total) * 100).toFixed(1)) : 0;

  res.json({
    success: true,
    cards: { total, pending, resolved, escalated },
    charts: {
      byCategory: byCategory.map((c) => ({ category: c.category, count: Number(c.get("count")) })),
      byHostel: byHostel.map((c) => ({ hostel: c.hostelOrDept || c.get("hostel_or_dept") || "Unspecified", count: Number(c.get("count")) })),
      byStatus: byStatus.map((c) => ({ status: c.status, count: Number(c.get("count")) })),
      resolutionPercentage,
    },
  });
});

// @desc  Export complaint report as PDF
// @route GET /api/admin/reports/pdf
const exportComplaintsPdf = asyncHandler(async (req, res) => {
  const complaints = await Complaint.findAll({
    include: [{ model: User, as: "student", attributes: ["name", "email", "hostel"] }],
    order: [["created_at", "DESC"]],
  });

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=complaint_report.pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Hostel & College Grievance Redressal System", { align: "center" });
  doc.fontSize(12).text("Complaint Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });
  doc.moveDown();

  complaints.forEach((c, idx) => {
    doc
      .fontSize(11)
      .text(`${idx + 1}. [${c.id}] ${c.title}`, { underline: true })
      .fontSize(9)
      .text(`Student: ${c.student ? c.student.name : "N/A"} (${c.student ? c.student.email : "N/A"})`)
      .text(`Category: ${c.category}   Priority: ${c.priority}   Status: ${c.status}`)
      .text(`Hostel/Dept: ${c.hostelOrDept || "N/A"}   Assigned To: ${c.assignedTo || "Unassigned"}`)
      .text(`Description: ${c.description}`)
      .text(`Resolution Notes: ${c.resolutionNotes || "-"}`)
      .text(`Created: ${c.createdAt ? c.createdAt.toLocaleString() : "-"}`)
      .moveDown(0.8);
  });

  doc.end();
});

module.exports = {
  getAllComplaints,
  assignComplaint,
  updateStatus,
  escalateComplaint,
  getDashboardStats,
  exportComplaintsPdf,
};
