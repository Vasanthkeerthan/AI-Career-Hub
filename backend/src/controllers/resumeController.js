const Resume = require("../models/Resume");
const parseResume = require("../services/resumeParser");
const analyzeATS = require("../services/atsAnalyzer");

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
    const parsedData = await parseResume(req.file.path);

    console.log("PARSED DATA:");
    console.log(parsedData);

    if (!parsedData.isValidResume) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid file. Please upload a professional resume only.",
        confidence: parsedData.resumeConfidence,
      });
    }

    // ATS Analysis
    const atsResult = analyzeATS(
      parsedData.extractedText
    );

    console.log("ATS RESULT:");
    console.log(atsResult);

    // Save to MongoDB
    const resume = await Resume.findOneAndUpdate(
      {
        user: req.user.userId,
      },
      {
        user: req.user.userId,

        resumeUrl: req.file.path,
        originalFileName:
          req.file.originalname,

        fileSize: req.file.size,

        extractedText:
          parsedData.extractedText,

        isValidResume:
          parsedData.isValidResume,

        resumeConfidence:
          parsedData.resumeConfidence,

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