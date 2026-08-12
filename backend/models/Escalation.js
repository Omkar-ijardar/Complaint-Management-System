const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Escalation = sequelize.define(
  "Escalation",
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
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("Open", "Reviewed", "Closed"),
      allowNull: false,
      defaultValue: "Open",
    },
  },
  {
    tableName: "escalations",
    timestamps: false,
  }
);

module.exports = Escalation;
