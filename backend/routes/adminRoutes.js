const express = require("express");
const router = express.Router();
const {
  getAllComplaints,
  assignComplaint,
  updateStatus,
  escalateComplaint,
  getDashboardStats,
  exportComplaintsPdf,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin", "warden"));

router.get("/complaints", getAllComplaints);
router.put("/complaints/:id/assign", assignComplaint);
router.put("/complaints/:id/status", updateStatus);
router.post("/complaints/:id/escalate", escalateComplaint);
router.get("/dashboard-stats", getDashboardStats);
router.get("/reports/pdf", exportComplaintsPdf);

module.exports = router;
