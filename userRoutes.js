const router = require("express").Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "Registration successful", user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(400).json({ message: e.code === 11000 ? "Email already registered" : e.message });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email, password: req.body.password });
  if (!user) return res.status(401).json({ message: "Invalid email or password" });
  res.json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
});

module.exports = router;
