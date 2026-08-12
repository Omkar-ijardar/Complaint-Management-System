const express = require("express");
const router = express.Router();
const { analyze, generateComplaint, chat } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/analyze", analyze);
router.post("/generate-complaint", generateComplaint);
router.post("/chat", chat);

module.exports = router;
