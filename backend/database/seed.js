require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");
const { User, Complaint, AiSuggestion } = require("../models");
const { analyzeComplaint } = require("../utils/localAiEngine");

async function seed() {
  await sequelize.sync({ alter: true });

  const passwordHash = await bcrypt.hash("Password@123", 10);

  const [admin] = await User.findOrCreate({
    where: { email: "admin@college.edu" },
    defaults: { name: "System Admin", password: passwordHash, role: "admin" },
  });

  const [warden] = await User.findOrCreate({
    where: { email: "warden@college.edu" },
    defaults: { name: "Hostel Warden", password: passwordHash, role: "warden", hostel: "Block A" },
  });

  const [student] = await User.findOrCreate({
    where: { email: "student@college.edu" },
    defaults: {
      name: "Rahul Sharma",
      password: passwordHash,
      role: "student",
      hostel: "Block A",
      roomNumber: "204",
    },
  });

  const sampleTexts = [
    "My room fan is not working since yesterday",
    "Water leakage in bathroom near room 204",
    "WiFi has been disconnected in Block A for two days",
    "Food quality in the mess has been very bad and stale lately",
  ];

  for (const text of sampleTexts) {
    const ai = analyzeComplaint(text);
    const complaint = await Complaint.create({
      userId: student.id,
      studentName: student.name,
      category: ai.category,
      title: text.slice(0, 50),
      description: text,
      location: "Block A",
      hostelOrDept: "Block A",
      priority: ai.priority,
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
  }

  console.log("✅ Seed complete.");
  console.log("Login credentials (password for all: Password@123):");
  console.log("  Admin:   admin@college.edu");
  console.log("  Warden:  warden@college.edu");
  console.log("  Student: student@college.edu");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
