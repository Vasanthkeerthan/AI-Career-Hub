const generateSkillGapAnalysis = (
  userSkills,
  jobSkills
) => {

  const normalizedUserSkills =
    userSkills.map(skill =>
      skill.toLowerCase()
    );

  const normalizedJobSkills =
    jobSkills.map(skill =>
      skill.toLowerCase()
    );

  const matchedSkills =
    normalizedJobSkills.filter(skill =>
      normalizedUserSkills.includes(skill)
    );

  const missingSkills =
    normalizedJobSkills.filter(
      skill =>
        !normalizedUserSkills.includes(skill)
    );

  const matchPercentage =
    jobSkills.length > 0
      ? Math.round(
          (matchedSkills.length /
            jobSkills.length) *
            100
        )
      : 0;

  const learningPath =
    missingSkills.map(skill =>
      `Learn ${skill.toUpperCase()} Fundamentals`
    );

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    learningPath,
  };

};

module.exports =
  generateSkillGapAnalysis;