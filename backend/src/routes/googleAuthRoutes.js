const generateToken = require("../utils/generateToken");
const express = require("express");
const passport = require("passport");

const router = express.Router();

// Start Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const token = generateToken(req.user);

res.json({
  success: true,
  message: "Google Login Successful",
  token,
  user: req.user,
});
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;