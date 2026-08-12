/**
 * Local AI / NLP Engine
 * ---------------------
 * 100% offline. No OpenAI / ChatGPT / Gemini / external API calls.
 * Implements keyword-weighted classification, rule-based priority
 * scoring, templated professional-complaint generation, and a
 * lightweight retrieval-based resolution suggester + help chatbot.
 */

// Keyword bank per category. Each keyword has a weight (importance).
const CATEGORY_KEYWORDS = {
  Electricity: {
    keywords: [
      ["fan", 3], ["light", 3], ["bulb", 3], ["switch", 2], ["socket", 2],
      ["wiring", 3], ["short circuit", 4], ["power cut", 3], ["electricity", 4],
      ["voltage", 2], ["mcb", 3], ["tripping", 2], ["fuse", 2],
    ],
    department: "Electrical Maintenance Department",
  },
  "Water Problem": {
    keywords: [
      ["water", 3], ["leak", 3], ["leakage", 4], ["tap", 3], ["pipe", 3],
      ["pipeline", 3], ["bathroom", 2], ["drainage", 3], ["no water", 4],
      ["tank", 2], ["seepage", 3], ["flooding", 3],
    ],
    department: "Plumbing / Civil Maintenance Department",
  },
  "Hostel Maintenance": {
    keywords: [
      ["door", 3], ["window", 3], ["furniture", 2], ["bed", 2], ["chair", 2],
      ["table", 2], ["paint", 2], ["ceiling", 2], ["wall", 2], ["lock", 2],
      ["repair", 2], ["broken", 3], ["maintenance", 2], ["room", 1],
    ],
    department: "Hostel Maintenance Department",
  },
  "Food Quality": {
    keywords: [
      ["food", 4], ["mess", 3], ["meal", 3], ["taste", 2], ["hygiene", 3],
      ["stale", 3], ["insect", 3], ["cockroach", 4], ["undercooked", 3],
      ["canteen", 2], ["menu", 1], ["quality of food", 4],
    ],
    department: "Mess / Catering Committee",
  },
  Cleanliness: {
    keywords: [
      ["dirty", 3], ["garbage", 3], ["trash", 3], ["cleanliness", 3],
      ["sanitation", 3], ["dustbin", 2], ["cleaning", 2], ["smell", 2],
      ["unhygienic", 3], ["washroom", 2], ["toilet", 2],
    ],
    department: "Housekeeping Department",
  },
  "Internet Issue": {
    keywords: [
      ["wifi", 4], ["internet", 4], ["network", 3], ["router", 3],
      ["connection", 2], ["lan", 2], ["broadband", 2], ["speed", 2],
      ["disconnect", 2], ["signal", 2],
    ],
    department: "IT / Networking Department",
  },
  Ragging: {
    keywords: [
      ["ragging", 5], ["bully", 4], ["bullying", 4], ["harass", 4],
      ["harassment", 4], ["threat", 4], ["senior", 2], ["intimidate", 4],
      ["abuse", 4],
    ],
    department: "Anti-Ragging Committee",
  },
  Security: {
    keywords: [
      ["security", 4], ["theft", 4], ["stolen", 4], ["intruder", 4],
      ["guard", 2], ["cctv", 3], ["unsafe", 3], ["unknown person", 3],
      ["gate", 2], ["safety", 3],
    ],
    department: "Security Department",
  },
  "Academic Issue": {
    keywords: [
      ["exam", 3], ["marks", 3], ["result", 3], ["faculty", 3], ["lecture", 2],
      ["attendance", 3], ["timetable", 2], ["professor", 3], ["class", 2],
      ["syllabus", 2], ["grades", 3],
    ],
    department: "Academic Affairs Office",
  },
};

const URGENT_TERMS = [
  "urgent", "immediately", "emergency", "danger", "fire", "unsafe",
  "threat", "ragging", "harass", "theft", "short circuit", "no water",
  "not working since", "leakage", "injury", "injured", "smoke",
];

const HIGH_TERMS = [
  "not working", "broken", "leak", "stolen", "bad", "cockroach",
  "no electricity", "no wifi", "disconnected",
];

function normalize(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

/**
 * Feature 4: Smart Complaint Categorization
 * Weighted keyword matching -> best category + confidence score.
 */
function classifyCategory(rawText) {
  const text = normalize(rawText);
  let scores = {};
  let total = 0;

  for (const [category, data] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const [kw, weight] of data.keywords) {
      if (text.includes(kw)) score += weight;
    }
    scores[category] = score;
    total += score;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topCategory, topScore] = sorted[0];

  if (topScore === 0) {
    return { category: "Other", confidence: 0.3, department: "General Administration" };
  }

  const confidence = Math.min(0.5 + topScore / 10, 0.97);
  return {
    category: topCategory,
    confidence: Number(confidence.toFixed(2)),
    department: CATEGORY_KEYWORDS[topCategory].department,
  };
}

/**
 * Rule-based priority scoring based on urgency vocabulary + category severity.
 */
function suggestPriority(rawText, category) {
  const text = normalize(rawText);
  let score = 1; // base = Low

  URGENT_TERMS.forEach((term) => {
    if (text.includes(term)) score += 3;
  });
  HIGH_TERMS.forEach((term) => {
    if (text.includes(term)) score += 2;
  });

  // Category based severity bump
  if (["Ragging", "Security"].includes(category)) score += 4;
  if (["Electricity", "Water Problem"].includes(category)) score += 1;

  if (score >= 8) return "Critical";
  if (score >= 5) return "High";
  if (score >= 2) return "Medium";
  return "Low";
}

// Templated solution recommendations per category
const SOLUTION_TEMPLATES = {
  Electricity:
    "Report to the electrical maintenance team for immediate inspection. Avoid using damaged sockets/switches until repaired. A certified electrician should verify wiring safety.",
  "Water Problem":
    "Contact the plumbing/maintenance department immediately and inspect the pipeline or fixture for leakage. Shut off the local water supply valve if leakage is severe.",
  "Hostel Maintenance":
    "Log a maintenance work order with the hostel warden's office. A maintenance staff member should inspect and repair the reported furniture/fixture within 2-3 working days.",
  "Food Quality":
    "Forward the complaint to the mess committee and hostel warden for a hygiene audit. Sample inspection of the reported meal batch is recommended along with vendor feedback.",
  Cleanliness:
    "Notify the housekeeping supervisor for immediate cleaning of the reported area and review of the daily sanitation schedule.",
  "Internet Issue":
    "Escalate to the IT/networking team to check router/access-point status and bandwidth allocation for the affected block.",
  Ragging:
    "This is a sensitive matter — escalate immediately and confidentially to the Anti-Ragging Committee and hostel warden. Ensure the complainant's identity is protected per institutional policy.",
  Security:
    "Alert the security department and review CCTV footage for the reported area/time. Increase patrol frequency near the affected location.",
  "Academic Issue":
    "Route the complaint to the Academic Affairs Office / concerned faculty coordinator for review and resolution within the semester grievance timeline.",
  Other:
    "Forward the complaint to the general administration office for manual review and department assignment.",
};

const RESOLUTION_TIME_BY_PRIORITY = {
  Critical: "Within 24 hours",
  High: "1-2 working days",
  Medium: "3-5 working days",
  Low: "5-7 working days",
};

/**
 * Feature 1 & 3: AI Complaint Assistant + Suggested Resolution System
 */
function analyzeComplaint(rawText) {
  const { category, confidence, department } = classifyCategory(rawText);
  const priority = suggestPriority(rawText, category);
  const solution = SOLUTION_TEMPLATES[category] || SOLUTION_TEMPLATES.Other;
  const estimatedResolutionTime = RESOLUTION_TIME_BY_PRIORITY[priority];

  return {
    category,
    confidence,
    priority,
    department,
    solution,
    estimatedResolutionTime,
    suggestion: `Detected category "${category}" (confidence ${(confidence * 100).toFixed(
      0
    )}%) with priority "${priority}". Recommended department: ${department}.`,
  };
}

/**
 * Feature 2: AI Complaint Writing Assistant
 * Turns short informal input into a professionally formatted complaint.
 */
const SUBJECT_TEMPLATES = {
  Electricity: "Electrical Fault Complaint",
  "Water Problem": "Water Supply / Leakage Complaint",
  "Hostel Maintenance": "Hostel Maintenance Request",
  "Food Quality": "Poor Food Quality Complaint",
  Cleanliness: "Cleanliness and Sanitation Complaint",
  "Internet Issue": "Internet / Wi-Fi Connectivity Complaint",
  Ragging: "Ragging / Harassment Complaint",
  Security: "Security Concern Report",
  "Academic Issue": "Academic Grievance",
  Other: "General Complaint",
};

const OPENING_TEMPLATES = {
  Electricity:
    "I would like to bring to your attention an electrical issue affecting my room/area.",
  "Water Problem":
    "I would like to report a water-related issue that requires immediate attention.",
  "Hostel Maintenance":
    "I would like to report a maintenance issue in my hostel room/common area.",
  "Food Quality":
    "I would like to report concerns regarding the quality and hygiene of food provided in the hostel mess.",
  Cleanliness:
    "I would like to bring to your notice a cleanliness/sanitation issue that needs urgent attention.",
  "Internet Issue":
    "I would like to report a persistent internet connectivity issue affecting my studies.",
  Ragging:
    "I am writing to report an incident that I believe constitutes ragging/harassment and requires urgent, confidential action.",
  Security:
    "I would like to report a security concern that may pose a risk to students' safety.",
  "Academic Issue":
    "I would like to formally raise an academic concern for review by the appropriate authority.",
  Other: "I would like to formally raise the following concern for your review.",
};

function generateProfessionalComplaint(rawText) {
  const { category } = classifyCategory(rawText);
  const subject = SUBJECT_TEMPLATES[category] || SUBJECT_TEMPLATES.Other;
  const opening = OPENING_TEMPLATES[category] || OPENING_TEMPLATES.Other;
  const cleanedInput = (rawText || "").trim();

  const body = `${opening} Specifically, ${cleanedInput.charAt(0).toLowerCase()}${cleanedInput.slice(
    1
  )}. I kindly request the concerned department to look into this matter at the earliest and take the necessary corrective action. I would appreciate a timely update on the status of this complaint.`;

  return {
    subject: `Subject: ${subject}`,
    description: body,
    category,
  };
}

/**
 * Lightweight help-assistant / chatbot for website guidance.
 * Simple intent matching over predefined Q&A pairs — fully offline.
 */
const CHAT_INTENTS = [
  {
    patterns: ["submit", "file", "raise", "new complaint", "create complaint"],
    reply:
      "To submit a complaint, go to 'New Complaint' from your dashboard, describe your issue, and our AI assistant will auto-suggest a category, priority, and solution before you submit.",
  },
  {
    patterns: ["track", "status", "where is my complaint"],
    reply:
      "You can track all your complaints under 'My Complaints' in the student dashboard. Each entry shows its current status (Submitted, In Progress, Resolved, etc.).",
  },
  {
    patterns: ["escalate", "escalation", "not resolved", "delay"],
    reply:
      "Complaints that remain unresolved beyond the configured time window are automatically escalated to higher authorities and marked 'Escalated' in your history.",
  },
  {
    patterns: ["password", "forgot", "login issue"],
    reply:
      "Use the 'Forgot Password' link on the login page to reset your password via your registered email.",
  },
  {
    patterns: ["feedback", "rate", "rating"],
    reply:
      "Once your complaint is marked 'Resolved', you can leave a rating and feedback comment from the complaint details page.",
  },
  {
    patterns: ["category", "categories", "types of complaint"],
    reply:
      "Supported categories include Hostel Maintenance, Electricity, Water Problem, Food Quality, Cleanliness, Internet Issue, Ragging, Security, Academic Issue, and Other. Our AI can also auto-detect the category from your description.",
  },
  {
    patterns: ["admin", "warden", "contact authority"],
    reply:
      "Admins and wardens manage, assign, and resolve complaints from the Admin Dashboard, and can generate PDF reports of complaint activity.",
  },
];

function chatAssistantReply(message) {
  const text = normalize(message);
  for (const intent of CHAT_INTENTS) {
    if (intent.patterns.some((p) => text.includes(p))) {
      return intent.reply;
    }
  }
  return "I can help you submit complaints, track status, understand escalation, or give feedback. Could you rephrase your question? For example: 'How do I submit a complaint?'";
}

module.exports = {
  classifyCategory,
  suggestPriority,
  analyzeComplaint,
  generateProfessionalComplaint,
  chatAssistantReply,
};
