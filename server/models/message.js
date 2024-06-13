const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Messages", messageSchema);
module.exports = Message;
