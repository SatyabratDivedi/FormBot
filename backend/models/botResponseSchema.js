const mongoose = require("mongoose");

const botResponseSchema = new mongoose.Schema(
  {
    category: String,
    type: String,
    value: String,
    whichBot: {
      type: mongoose.Schema.ObjectId,
      ref: "bot",
    },
  },
  {timestamps: true}
);

const botResponseModel = mongoose.model("botResponse", botResponseSchema);
module.exports = botResponseModel;
