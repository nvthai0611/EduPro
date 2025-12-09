import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixPhoneNumberIndex = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "";

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("Users");

    // Get current indexes
    const indexes = await usersCollection.indexes();
    console.log("Current indexes:", JSON.stringify(indexes, null, 2));

    // Check if phoneNumber index exists
    const phoneNumberIndex = indexes.find(
      (idx) => idx.key && idx.key.phoneNumber === 1
    );

    if (phoneNumberIndex) {
      console.log("Found phoneNumber index:", phoneNumberIndex.name);

      // Drop the old index
      await usersCollection.dropIndex(phoneNumberIndex.name);
      console.log(`Dropped old index: ${phoneNumberIndex.name}`);
    }

    // Create new sparse unique index
    await usersCollection.createIndex(
      { phoneNumber: 1 },
      { unique: true, sparse: true }
    );
    console.log("Created new sparse unique index on phoneNumber");

    // Verify new indexes
    const newIndexes = await usersCollection.indexes();
    const newPhoneNumberIndex = newIndexes.find(
      (idx) => idx.key && idx.key.phoneNumber === 1
    );
    console.log("New phoneNumber index:", newPhoneNumberIndex);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

fixPhoneNumberIndex()
  .then(() => {
    console.log("✓ Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("✗ Migration script failed:", error);
    process.exit(1);
  });
