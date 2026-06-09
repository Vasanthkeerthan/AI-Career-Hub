const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  applyJob,
  getJobApplicants,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Job
router.post("/", authMiddleware, createJob);

// Get All Jobs
router.get("/", getAllJobs);

// Get Single Job
router.get("/:id", getJobById);

// Update Job
router.put("/:id", authMiddleware, updateJob);

// Apply Job
router.post("/:id/apply", authMiddleware, applyJob);

// Get Applicants For A Job
router.get(
  "/:id/applicants",
  authMiddleware,
  getJobApplicants
);

module.exports = router;