const Resume = require("../models/Resume");
const parseResume = require("../services/resumeParser");
const analyzeATS = require("../services/atsAnalyzer");
const calculateCandidateRanking =
require("../services/candidateRanking");

const uploadResume = async (req, res) => {
  try {

    console.log("FILE RECEIVED:");
    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    // Parse Resume
    const parsedData = await parseResume(
      req.file.path
    );

    console.log("PARSED DATA:");
    console.log(parsedData);

    if (parsedData.isScannedResume) {
      return res.status(400).json({
        success: false,
        message:
          "Scanned PDF detected. OCR processing required.",
        confidence:
          parsedData.resumeConfidence,
      });
    }

    // ATS Analysis
    const atsResult = analyzeATS(
      parsedData.extractedText
    );

    console.log("ATS RESULT:");
    console.log(atsResult);

    // Candidate Ranking
    const rankingResult =
      calculateCandidateRanking(
        atsResult.atsScore,
        parsedData.resumeConfidence
      );

    console.log(
      "RANKING RESULT:"
    );

    console.log(
      rankingResult
    );

    // Save Resume
    const resume =
      await Resume.findOneAndUpdate(
        {
          user: req.user.userId,
        },
        {
          user: req.user.userId,

          resumeUrl:
            req.file.path,

          originalFileName:
            req.file.originalname,

          fileSize:
            req.file.size,

          extractedText:
            parsedData.extractedText,

          isValidResume:
            parsedData.isValidResume,

          resumeConfidence:
            parsedData.resumeConfidence,

          extractedSkills:
            parsedData.extractedSkills,

          education:
            parsedData.education,

          experience:
            parsedData.experience,

          resumeStrength:
            parsedData.resumeConfidence,

          rankingScore:
            rankingResult.rankingScore,

          candidateLevel:
            rankingResult.level,

          atsScore:
            atsResult.atsScore,

          matchedSkills:
            atsResult.matchedSkills,

          missingSkills:
            atsResult.missingSkills,

          suggestions:
            atsResult.suggestions,
        },
        {
          upsert: true,
          new: true,
        }
      );

    console.log(
      "RESUME SAVED TO DATABASE"
    );

    res.status(200).json({
      success: true,

      message:
        "Resume uploaded successfully",

      atsScore:
        atsResult.atsScore,

      rankingScore:
        rankingResult.rankingScore,

      candidateLevel:
        rankingResult.level,

      matchedSkills:
        atsResult.matchedSkills,

      missingSkills:
        atsResult.missingSkills,

      suggestions:
        atsResult.suggestions,

      resume,
    });

  } catch (error) {

    console.error(
      "UPLOAD ERROR:"
    );

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  uploadResume,
};