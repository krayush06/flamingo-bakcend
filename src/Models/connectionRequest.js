const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status type`,
    },
  },
}, { timestamps: true });

// Compound index for query optimization
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Pre-save middleware hook
connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send a connection request to yourself!");
  }
});

module.exports = mongoose.models.ConnectionRequest || mongoose.model("ConnectionRequest", connectionRequestSchema);