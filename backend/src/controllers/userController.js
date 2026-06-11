const User = require("../models/User");

// Get Logged In User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      headline,
      country,
      city,
      about,
      skills,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = fullName || user.fullName;
    user.headline = headline || user.headline;
    user.country = country || user.country;
    user.city = city || user.city;
    user.about = about || user.about;
    if (skills) {
     user.skills = Array.isArray(skills)
       ? skills
       : skills.split(",").map(skill => skill.trim());
}
    user.githubUrl = githubUrl || user.githubUrl;
    user.linkedinUrl = linkedinUrl || user.linkedinUrl;
    user.portfolioUrl = portfolioUrl || user.portfolioUrl;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};