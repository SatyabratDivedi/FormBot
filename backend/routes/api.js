const express = require("express");
const route = express.Router();
const userModel = require("../models/userSchema"); // Adjust the path to your user model
const folderModel = require("../models/folderSchema"); // Adjust the path to your user model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const botModel = require("../models/botSchema");

// Register API
route.post("/register", async (req, res) => {
  const {name, email, password, confirmPassword} = req.body;
  console.log("name, email, password, confirmPassword: ", name, email, password, confirmPassword);
  const findExistUser = await userModel.findOne({email});
  if (!name || !email || !password || !confirmPassword) return res.status(400).json({msg: "All fields are required"});
  if (password !== confirmPassword) return res.status(400).json({msg: "Passwords must be same"});
  if (findExistUser) return res.status(400).json({msg: "This email is already registered"});

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await new userModel({name, email, password: hashPassword}).save();
    console.log("New user created");
    return res.status(201).json({msg: "New user created"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
});

// Login API
route.post("/login", async (req, res) => {
  const {email, password} = req.body;
  const findExistUser = await userModel.findOne({email});
  if (!findExistUser) return res.status(400).json({msg: "User not found"});
  try {
    const isMatch = await bcrypt.compare(password, findExistUser.password);
    if (isMatch) {
      const findFirstFolder = await folderModel.find({folderName: "main", whichUser: findExistUser._id});
      const tokenId = jwt.sign({user: findExistUser}, process.env.JWT_SECRET, {expiresIn: "24h"});
      res.cookie("tokenId", tokenId, {
        httpOnly: true,
        secure: true,
      });
      if (findFirstFolder.length == 0) {
        try {
          const newFolder = await new folderModel({folderName: "main", whichUser: findExistUser._id}).save();
          console.log("newFolder: ", newFolder);
          findExistUser.folders.push(newFolder._id);
          await findExistUser.save();
          console.log("User updated with new folder ID");
        } catch (error) {
          console.error("Error creating new folder or updating user:", error);
        }
      }
      return res.status(200).json({msg: "Sign in successfully"});
    } else {
      return res.status(400).json({msg: "Invalid password"});
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
});

route.get("/user_details", checkAuth, (req, res) => {
  return res.status(200).json({msg: "You are authenticated", user: req.loginUser});
});

// Logout API
route.post("/logout", checkAuth, (req, res) => {
  try {
    if (req.loginUser) {
      res.cookie("tokenId", "", {
        httpOnly: true,
        secure: true,
      });
      console.log("logout successfully");
      return res.status(200).json({msg: "Logout Successfully"});
    }
    return res.status(200).json({msg: "something wrong"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
});

//create folder API
route.post("/create_folder", checkAuth, async (req, res) => {
  const findUserAllFolders = await folderModel.find({whichUser: req.loginUser._id});
  const findLoginUser = await userModel.findOne({_id: req.loginUser._id});
  console.log(findLoginUser);
  console.log(req.body.folderName);
  try {
    if (req.body.folderName !== "") {
      const newFolder = await new folderModel({folderName: req.body.folderName, whichUser: findLoginUser._id}).save();
      console.log("newFolder: ", newFolder);
      findLoginUser.folders.push(newFolder._id);
      await findLoginUser.save();
    }
    return res.status(200).json({allFolder: findUserAllFolders});
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
});

//get all folder API
route.get("/get_folder_details", checkAuth, async (req, res) => {
  try {
    const findUserFolders = await folderModel.find({whichUser: req.loginUser._id}).populate("allBots");
    return res.status(200).json({allFolder: findUserFolders, user: req.loginUser});
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
});

//get bot details API
route.get("/bot_details/:folderName/:botName", checkAuth, async (req, res) => {
  const {folderName, botName} = req.params;
  try {
    const findUserFolder = await folderModel.findOne({whichUser: req.loginUser._id, folderName}).populate("allBots");
    if (!findUserFolder) return res.status(404).json({msg: "Folder not found"});
    const findBot = findUserFolder.allBots.find((bot) => bot.botName === botName);
    if (!findBot) return res.status(404).json({msg: "bot not found"});
    return res.status(200).json(findBot);
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
});

//bot update API
route.patch("/bot_update/:botId", checkAuth, async (req, res) => {
  console.log("paramId", req.params.botId);
  console.log(req.body);
  try {
    const findUpdatedBot = await botModel.findByIdAndUpdate(req.params.botId, req.body, {new: true});
    if (!findUpdatedBot) return res.status(404).json({msg:"Bot not found"});
    return res.status(200).json({msg:'Bot Updated Successfully', updatedBot:findUpdatedBot});
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
});

//delete folder API
route.delete("/delete_folder/:folderId", checkAuth, async (req, res) => {
  try {
    const deleteFolder = await folderModel.findOneAndDelete({_id: req.params.folderId});
    if (!deleteFolder) return res.status(404).json({msg: "Folder not found"});
    await botModel.deleteMany({whichFolder: req.params.folderId});
    const findLoginUser = await userModel.findOne({_id: req.loginUser._id});
    findLoginUser.folders = findLoginUser.folders.filter((folder) => folder.toString() !== req.params.folderId);
    await findLoginUser.save();
    return res.status(200).json({msg: "folder delete successfully"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
});

//save bot API
route.post("/save_bot", checkAuth, async (req, res) => {
  const {data, folder} = req.body;
  console.log(data);
  console.log(folder);
  try {
    const findFolder = await folderModel.findOne({whichUser: req.loginUser._id, folderName: folder});
    console.log("findFolder: ", findFolder);
    if (!findFolder) return res.status(404).json({msg: "folder not found"});
    const newBot = new botModel({
      botName: data.botName,
      theme: data.theme,
      botArr: data.botArr,
      whichFolder: findFolder._id,
    });
    console.log(newBot);
    await newBot.save();
    findFolder.allBots.push(newBot._id);
    await findFolder.save();
    console.log("saveBotInFolder", findFolder);

    return res.status(200).json({msg: "bot saved successfully"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
});

//check auth via jwt
function checkAuth(req, res, next) {
  const token = req.cookies.tokenId;
  if (!token) return res.status(401).json({msg: "Unauthorized"});

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.loginUser = user.user;
    next();
  } catch (error) {
    return res.status(401).json({msg: "Unauthorized"});
  }
}

module.exports = route;
