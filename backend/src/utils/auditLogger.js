const AuditLog = require("../models/auditLog.model");

async function logEvent({
  actorId,
  actorRole,
  action,
  targetId,
  metadata,
  req
}) {
  try {
    await AuditLog.create({
      actorId,
      actorRole,
      action,
      targetId,
      metadata,
      ip: req?.ip,
      userAgent: req?.headers["user-agent"]
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
}

module.exports = logEvent;
