const mongoose = require("mongoose");

const botSchema = new mongoose.Schema({
  botName: String,
  theme: String,
  botArr: [
    {
      type: {type: String, required: true},
      category: {type: String, required: true},
      value: {type: String},
    },
  ],
  whichFolder: {
    type: mongoose.Schema.ObjectId,
    ref: "folder",
  },
  botResponse: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "botResponse",
    },
  ],
});

const botModel = mongoose.model("bot", botSchema);
module.exports = botModel;
