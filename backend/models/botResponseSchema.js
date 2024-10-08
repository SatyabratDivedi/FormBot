const mongoose = require("mongoose");

const botResponseSchema = new mongoose.Schema(
  {
    botResponseArr: [
      {
        type: {type: String},
        category: {type: String},
        value: {type: String},
      },
    ],
    whichBot: {
      type: mongoose.Schema.ObjectId,
      ref: "bot",
    },
  },
  {timestamps: true}
);

const botResponseModel = mongoose.model("botResponse", botResponseSchema);
module.exports = botResponseModel;
