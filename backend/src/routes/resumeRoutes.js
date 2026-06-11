const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const uploadResumeMiddleware = require("../middleware/uploadResume");

const {
  uploadResume,
} = require("../controllers/resumeController");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Resume routes working",
  });
});

// Protected Resume Upload Route
router.post(
  "/upload",
  authMiddleware,
  uploadResumeMiddleware.single("resume"),

  (req, res, next) => {
    console.log("========== ROUTE DEBUG ==========");
    console.log("req.file:");
    console.log(req.file);

    console.log("req.body:");
    console.log(req.body);

    console.log("================================");

    next();
  },

  uploadResume
);

module.exports = router;