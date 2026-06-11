const calculateCandidateRanking = (
  atsScore,
  resumeConfidence
) => {
  const rankingScore = Math.round(
    atsScore * 0.7 +
    resumeConfidence * 0.3
  );

  let level = "Beginner";

  if (rankingScore >= 80) {
    level = "Advanced";
  } else if (rankingScore >= 60) {
    level = "Intermediate";
  }

  return {
    rankingScore,
    level,
  };
};

module.exports =
  calculateCandidateRanking;