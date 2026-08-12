const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Feedback = sequelize.define(
  "Feedback",
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
    complaintId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "complaint_id",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "feedback",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Feedback;
