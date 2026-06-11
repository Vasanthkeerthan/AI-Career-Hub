const calculateATSScore = (
  userSkills,
  jobSkills
) => {

  const matchedSkills =
    jobSkills.filter(skill =>
      userSkills.some(
        userSkill =>
          userSkill.toLowerCase() ===
          skill.toLowerCase()
      )
    );

  const score =
    jobSkills.length > 0
      ? Math.round(
          (matchedSkills.length /
            jobSkills.length) *
            100
        )
      : 0;

  return score;

};

module.exports =
  calculateATSScore;