const cron = require("node-cron");
const { Op } = require("sequelize");
const { Complaint, Escalation } = require("../models");

/**
 * Runs every hour. Any complaint that has been open (not Resolved/Rejected/Escalated)
 * for longer than ESCALATION_HOURS is automatically escalated and bumped to Critical priority.
 */
function startEscalationJob() {
  const hours = Number(process.env.ESCALATION_HOURS || 72);

  cron.schedule("0 * * * *", async () => {
    try {
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
      const stale = await Complaint.findAll({
        where: {
          status: { [Op.notIn]: ["Resolved", "Rejected", "Escalated"] },
          created_at: { [Op.lte]: cutoff },
        },
      });

      for (const complaint of stale) {
        complaint.status = "Escalated";
        complaint.priority = "Critical";
        await complaint.save();
        await Escalation.create({
          complaintId: complaint.id,
          reason: `Auto-escalated: unresolved for more than ${hours} hours`,
        });
      }

      if (stale.length > 0) {
        console.log(`⏫ Auto-escalated ${stale.length} complaint(s).`);
      }
    } catch (err) {
      console.error("Escalation job error:", err.message);
    }
  });

  console.log(`🕒 Escalation job scheduled (threshold: ${hours}h, runs hourly).`);
}

module.exports = startEscalationJob;
