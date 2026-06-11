const fs = require("fs");
const pdfParse = require("pdf-parse");

const parseResume = async (filePath) => {
  try {
    const pdfBuffer = fs.readFileSync(filePath);

    const data = await pdfParse(pdfBuffer);

    const extractedText = data.text || "";
    console.log("TEXT LENGTH:");
console.log(extractedText.length);

console.log("FIRST 500 CHARS:");
console.log(extractedText.substring(0, 500));

    const lowerText = extractedText.toLowerCase();

    const skillsDatabase = [
      "javascript",
      "typescript",
      "react",
      "node.js",
      "express",
      "mongodb",
      "mysql",
      "postgresql",
      "python",
      "java",
      "c++",
      "html",
      "css",
      "tailwind",
      "bootstrap",
      "docker",
      "aws",
      "git",
      "github",
      "redux",
      "next.js",
      "firebase",
      "socket.io"
    ];

    const extractedSkills =
      skillsDatabase.filter((skill) =>
        lowerText.includes(skill.toLowerCase())
      );

    let education = [];

    const educationKeywords = [
      "b.tech",
      "bachelor",
      "master",
      "m.tech",
      "degree",
      "university",
      "college"
    ];

    educationKeywords.forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        education.push(keyword);
      }
    });

    let experience = "Fresher";

    const experienceMatch =
      extractedText.match(
        /(\d+)\+?\s*(years|year)/i
      );

    if (experienceMatch) {
      experience = experienceMatch[0];
    }

    const isScannedResume =
  extractedText.trim().length < 100;

const isValidResume =
  !isScannedResume;

    const resumeConfidence =
      Math.min(
        100,
        Math.round(
          extractedSkills.length * 10 + 40
        )
      );

    return {
     extractedText,
     extractedSkills,
     education,
     experience,
     isValidResume,
     isScannedResume,
     resumeConfidence
    };
  } catch (error) {
    console.error(error);

    return {
      extractedText: "",
      extractedSkills: [],
      education: [],
      experience: "Unknown",
      isValidResume: false,
      resumeConfidence: 0
    };
  }
};

module.exports = parseResume;