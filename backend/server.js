require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const passport = require("passport");

// Load Google Strategy
require("./src/config/passport");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Initialize Passport
app.use(passport.initialize());

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});