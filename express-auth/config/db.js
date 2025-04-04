const mongoose = require("mongoose");

const connectDB = async () => {
  let attempts = 0;
  const maxAttempts = 3; // Retry 3 times before failing

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 60000,
        family: 4,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(
        `Attempt ${attempts} - Database connection failed:`,
        error.message
      );
      if (attempts === maxAttempts) {
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
};

module.exports = connectDB;
