const calculateATSScore = (
  userSkills,
  jobSkills
) => {

  const matchedSkills = jobSkills.filter(
    skill =>
      userSkills.some(
        userSkill =>
          userSkill.toLowerCase() ===
          skill.toLowerCase()
      )
  );

  const missingSkills = jobSkills.filter(
    skill =>
      !userSkills.some(
        userSkill =>
          userSkill.toLowerCase() ===
          skill.toLowerCase()
      )
  );

  const atsScore = Math.round(
    (matchedSkills.length / jobSkills.length) * 100
  );

  return {
    atsScore,
    matchedSkills,
    missingSkills,
  };
};

module.exports = calculateATSScore;