const asyncHandler = require("express-async-handler");
const {
  analyzeComplaint,
  generateProfessionalComplaint,
  chatAssistantReply,
} = require("../utils/localAiEngine");

// @desc  Analyze free-text complaint -> category, priority, department, solution
// @route POST /api/ai/analyze
const analyze = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim().length < 3) {
    res.status(400);
    throw new Error("Please provide complaint text to analyze");
  }
  const result = analyzeComplaint(text);
  res.json({ success: true, result });
});

// @desc  Convert informal text into a professional complaint draft
// @route POST /api/ai/generate-complaint
const generateComplaint = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim().length < 3) {
    res.status(400);
    throw new Error("Please provide input text");
  }
  const result = generateProfessionalComplaint(text);
  res.json({ success: true, result });
});

// @desc  Website help chatbot
// @route POST /api/ai/chat
const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }
  const reply = chatAssistantReply(message);
  res.json({ success: true, reply });
});

module.exports = { analyze, generateComplaint, chat };
