const mongoose = require("mongoose");
const seedData = require("./learningPlatformSeeder");
const dotenv = require("dotenv");
dotenv.config();
// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Run seeder
const runSeeder = async () => {
  try {
    await connectDB();
    await seedData();
    console.log("🎉 Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeder();
}

module.exports = runSeeder;
