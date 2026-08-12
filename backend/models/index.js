const { sequelize } = require("../config/db");
const User = require("./User");
const Complaint = require("./Complaint");
const AiSuggestion = require("./AiSuggestion");
const Escalation = require("./Escalation");
const Feedback = require("./Feedback");

// Associations
User.hasMany(Complaint, { foreignKey: "userId", as: "complaints" });
Complaint.belongsTo(User, { foreignKey: "userId", as: "student" });

Complaint.hasMany(AiSuggestion, { foreignKey: "complaintId", as: "aiSuggestions" });
AiSuggestion.belongsTo(Complaint, { foreignKey: "complaintId", as: "complaint" });

Complaint.hasMany(Escalation, { foreignKey: "complaintId", as: "escalations" });
Escalation.belongsTo(Complaint, { foreignKey: "complaintId", as: "complaint" });

Complaint.hasMany(Feedback, { foreignKey: "complaintId", as: "feedbacks" });
Feedback.belongsTo(Complaint, { foreignKey: "complaintId", as: "complaint" });

User.hasMany(Feedback, { foreignKey: "userId", as: "feedbacks" });
Feedback.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  sequelize,
  User,
  Complaint,
  AiSuggestion,
  Escalation,
  Feedback,
};
