const User = require("../models/User");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const calculateATSScore = require("../services/atsAnalyzer");

const generateSkillGapAnalysis =
require("../services/skillGapAnalyzer");
const calculateRankingScore =
require("../services/resumeRanking");
// Create Job
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      employmentType,
      salary,
      description,
      requirements,
      skills,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      employmentType,
      salary,
      description,
      requirements,
      skills,
      recruiter: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiter", "fullName email profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Job
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiter",
      "fullName email profilePicture"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Apply Job
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadyApplied =
  job.applicants.some(
    applicant =>
      applicant.user.toString() ===
      req.user.userId
  );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You already applied for this job",
      });
    }

    job.applicants.push({
  user: req.user.userId,
  status: "Applied",
});

    await job.save();

    res.status(200).json({
      success: true,
      message: "Applied successfully",
      applicantsCount: job.applicants.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Job Applicants
const getJobApplicants = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id)
      .populate(
        "applicants.user",
        "fullName email profilePicture headline country city skills"
      )
      .populate(
        "recruiter",
        "fullName email"
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view applicants",
      });
    }

    res.status(200).json({
      success: true,
      totalApplicants: job.applicants.length,
      applicants: job.applicants,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const updateApplicantStatus = async (req, res) => {
  try {

    const { applicantId, status } = req.body;

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      job.recruiter.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const applicant =
      job.applicants.find(
        (a) =>
          a.user.toString() ===
          applicantId
      );

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    const validStatuses = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Rejected",
  "Hired",
];

if (!validStatuses.includes(status)) {
  return res.status(400).json({
    success: false,
    message: "Invalid status",
  });
}

applicant.status = status;

    await job.save();

    res.status(200).json({
      success: true,
      message:
        "Status updated successfully",
      applicant,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getRecruiterAnalytics = async (req, res) => {
  try {

    const jobs = await Job.find({
      recruiter: req.user.userId,
    });

    let totalApplicants = 0;
    let applied = 0;
    let underReview = 0;
    let shortlisted = 0;
    let interviewScheduled = 0;
    let rejected = 0;
    let hired = 0;

    jobs.forEach((job) => {

      totalApplicants +=
        job.applicants.length;

      job.applicants.forEach(
        (applicant) => {

          switch (
            applicant.status
          ) {

            case "Applied":
              applied++;
              break;

            case "Under Review":
              underReview++;
              break;

            case "Shortlisted":
              shortlisted++;
              break;

            case "Interview Scheduled":
              interviewScheduled++;
              break;

            case "Rejected":
              rejected++;
              break;

            case "Hired":
              hired++;
              break;
          }

        }
      );

    });

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      totalApplicants,
      applied,
      underReview,
      shortlisted,
      interviewScheduled,
      rejected,
      hired,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getRecommendedJobs = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.userId
    );

    const resume = await Resume.findOne({
      user: req.user.userId,
    });

    const userSkills = [
      ...(user.skills || []),
      ...(resume?.matchedSkills || []),
    ];

    const jobs = await Job.find({
      isActive: true,
    }).populate(
      "recruiter",
      "fullName email profilePicture"
    );

    const recommendations = jobs.map((job) => {

      const matchingSkills =
        job.skills.filter((skill) =>
          userSkills.some(
            (userSkill) =>
              userSkill.toLowerCase() ===
              skill.toLowerCase()
          )
        );

      const matchPercentage =
        job.skills.length > 0
          ? Math.round(
              (matchingSkills.length /
                job.skills.length) *
                100
            )
          : 0;

      return {
        ...job.toObject(),
        matchPercentage,
        matchingSkills,
      };
    });

    recommendations.sort(
      (a, b) =>
        b.matchPercentage -
        a.matchPercentage
    );

    res.status(200).json({
      success: true,
      total: recommendations.length,
      recommendations,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ATS Analysis For Specific Job
const analyzeATS = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const userSkills =
      (user.skills || []).map(skill =>
        skill.toLowerCase()
      );

    const jobSkills =
      (job.skills || []).map(skill =>
        skill.toLowerCase()
      );

    const matchedSkills =
      jobSkills.filter(skill =>
        userSkills.includes(skill)
      );

    const missingSkills =
      jobSkills.filter(
        skill =>
          !userSkills.includes(skill)
      );

    const atsScore =
      jobSkills.length > 0
        ? Math.round(
            (matchedSkills.length /
              jobSkills.length) *
              100
          )
        : 0;

    res.status(200).json({
      success: true,
      user: user.fullName,
      jobTitle: job.title,
      company: job.company,
      atsScore,
      matchedSkills,
      missingSkills,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const analyzeSkillGap = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user.userId
      );

    const job =
      await Job.findById(
        req.params.id
      );

    if (!user || !job) {

      return res.status(404).json({
        success: false,
        message:
          "User or Job not found",
      });

    }

    const result =
      generateSkillGapAnalysis(
        user.skills || [],
        job.skills || []
      );

    res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



const getApplicantRankings =
async (req, res) => {

  try {

    const job =
  await Job.findById(
    req.params.id
  ).populate(
    "applicants.user",
    "fullName email skills"
  );

    if (!job) {

      return res.status(404).json({
        success: false,
        message: "Job not found",
      });

    }

    const rankings =
  job.applicants.map(
    (application) => {

      const applicant =
        application.user;

      const atsScore =
        calculateRankingScore(
          applicant.skills || [],
          job.skills || []
        );

      return {
        candidate:
          applicant.fullName,
        email:
          applicant.email,
        status:
          application.status,
        atsScore,
      };

    }
  );

    rankings.sort(
      (a, b) =>
        b.atsScore -
        a.atsScore
    );

    const rankedApplicants =
      rankings.map(
        (candidate, index) => ({
          rank: index + 1,
          ...candidate,
        })
      );

    res.status(200).json({
      success: true,
      jobTitle: job.title,
      totalApplicants:
        rankedApplicants.length,
      rankings:
        rankedApplicants,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
const saveJob = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.userId
    );

    const jobId = req.params.id;

    if (
      user.savedJobs.includes(jobId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
      });
    }

    user.savedJobs.push(jobId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Job saved successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const removeSavedJob = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.userId
    );

    user.savedJobs =
      user.savedJobs.filter(
        job =>
          job.toString() !==
          req.params.id
      );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Saved job removed",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getSavedJobs = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.user.userId
      ).populate("savedJobs");

    res.status(200).json({
      success: true,
      savedJobs: user.savedJobs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
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
};