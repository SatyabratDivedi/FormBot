const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  folders: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "folders",
    },
  ],
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
