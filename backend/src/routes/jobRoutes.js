const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  applyJob,
  getJobApplicants,
  updateApplicantStatus,
  getRecruiterAnalytics,
  getRecommendedJobs,
  analyzeATS,
  analyzeSkillGap,
  getApplicantRankings,
  saveJob,
  removeSavedJob,
  getSavedJobs,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Job
router.post(
  "/",
  authMiddleware,
  createJob
);

// Get All Jobs
router.get(
  "/",
  getAllJobs
);

// Recruiter Analytics
router.get(
  "/analytics",
  authMiddleware,
  getRecruiterAnalytics
);

// AI Recommended Jobs
router.get(
  "/recommended",
  authMiddleware,
  getRecommendedJobs
);

// Get Saved Jobs (MUST BE ABOVE /:id)
router.get(
  "/saved",
  authMiddleware,
  getSavedJobs
);

// ATS Score For Specific Job
router.get(
  "/:id/ats",
  authMiddleware,
  analyzeATS
);

// Skill Gap Analysis For Specific Job
router.get(
  "/:id/skill-gap",
  authMiddleware,
  analyzeSkillGap
);

// Resume Ranking System
router.get(
  "/:id/rankings",
  authMiddleware,
  getApplicantRankings
);

// Save Job
router.post(
  "/:id/save",
  authMiddleware,
  saveJob
);

// Remove Saved Job
router.delete(
  "/:id/save",
  authMiddleware,
  removeSavedJob
);

// Apply Job
router.post(
  "/:id/apply",
  authMiddleware,
  applyJob
);

// Get Applicants For A Job
router.get(
  "/:id/applicants",
  authMiddleware,
  getJobApplicants
);

// Update Applicant Status
router.put(
  "/:id/applicant-status",
  authMiddleware,
  updateApplicantStatus
);

// Get Single Job
router.get(
  "/:id",
  getJobById
);

// Update Job
router.put(
  "/:id",
  authMiddleware,
  updateJob
);

module.exports = router;