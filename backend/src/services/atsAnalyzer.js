const commonSkills = [
  "react",
  "node.js",
  "mongodb",
  "express",
  "javascript",
  "typescript",
  "python",
  "java",
  "docker",
  "aws",
  "git",
  "rest api",
  "sql",
];

const analyzeATS = (resumeText) => {
  const matchedSkills = [];
  const missingSkills = [];

  commonSkills.forEach((skill) => {
    if (resumeText.includes(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const atsScore = Math.round(
    (matchedSkills.length / commonSkills.length) * 100
  );

  const suggestions = [];

  if (missingSkills.includes("docker")) {
    suggestions.push(
      "Add Docker experience to improve ATS score"
    );
  }

  if (missingSkills.includes("aws")) {
    suggestions.push(
      "Add cloud projects using AWS"
    );
  }

  if (missingSkills.includes("git")) {
    suggestions.push(
      "Mention version control experience"
    );
  }

  return {
    atsScore,
    matchedSkills,
    missingSkills,
    suggestions,
  };
};

module.exports = analyzeATS;