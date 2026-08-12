const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Complaint = sequelize.define(
  "Complaint",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    studentName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "student_name",
    },
    category: {
      type: DataTypes.ENUM(
        "Hostel Maintenance",
        "Electricity",
        "Water Problem",
        "Food Quality",
        "Cleanliness",
        "Internet Issue",
        "Ragging",
        "Security",
        "Academic Issue",
        "Other"
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    hostelOrDept: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "hostel_or_dept",
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High", "Critical"),
      allowNull: false,
      defaultValue: "Medium",
    },
    status: {
      type: DataTypes.ENUM(
        "Submitted",
        "Under Review",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
        "Escalated"
      ),
      allowNull: false,
      defaultValue: "Submitted",
    },
    assignedTo: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "assigned_to",
    },
    resolutionNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "resolution_notes",
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "resolved_at",
    },
  },
  {
    tableName: "complaints",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Complaint;
