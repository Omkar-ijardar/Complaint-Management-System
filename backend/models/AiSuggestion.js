const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AiSuggestion = sequelize.define(
  "AiSuggestion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    complaintId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "complaint_id",
    },
    suggestion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedResolutionTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "estimated_resolution_time",
    },
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "ai_suggestions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = AiSuggestion;
