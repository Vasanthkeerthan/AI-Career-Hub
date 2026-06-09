const parseResume = async (filePath) => {
  console.log("PARSER CALLED");
  console.log(filePath);

  return {
    extractedText:
      "react node.js mongodb express javascript",
    isValidResume: true,
    resumeConfidence: 90,
  };
};

module.exports = parseResume;