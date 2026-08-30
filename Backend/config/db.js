const mongoose = require('mongoose');

// Ensure crypto is available for MongoDB
if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto');
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;