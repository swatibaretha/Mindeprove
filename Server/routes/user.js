const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const nodemailer = require("nodemailer");


router.post("/signup", async (req, res) => {
  try {
    console.log("i am signup");
    const { name, email, city, password ,mobile} = req.body;
    const user = new User({ name, email, city, password ,mobile});
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  console.log("i am signin........");
  
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    if(user.password==password)
    res.status(200).json({ message: "success", data: user });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS,
  },
});

router.post("/send-message", async (req, res) => {
  try {
    const msg= "your city is selected"
    const { userIds } = req.body;

   
    const users = await User.find({ _id: { $in: userIds } });

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    for (const user of users) {
      let info = await transporter.sendMail({
        from: `"Your App" <${process.env.GMAIL_USER}>`,
        to: user.email, 
        subject: "your city is selected", 
        text: msg,
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    res.status(200).json({ message: "Messages sent successfully" });
  } catch (error) {
    console.error("Error sending message: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
