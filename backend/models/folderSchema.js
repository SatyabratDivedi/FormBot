const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
  },
  whichUser: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  allBots: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "bot",
    },
  ],
});

const folderModel = mongoose.model("folder", folderSchema);
module.exports = folderModel;
