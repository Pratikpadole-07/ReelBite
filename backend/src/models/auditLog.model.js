const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    actorRole: {
      type: String,
      enum: ["user", "partner", "system"],
      required: true
    },
    action: {
      type: String,
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId
    },
    metadata: {
      type: Object
    },
    ip: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("auditlog", auditLogSchema);
