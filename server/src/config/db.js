import mongoose from 'mongoose';

// MongoDB connection function
const connectDB = async () => {
  try {
    console.log(process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB database are connected successfully!');
  } catch (err) {
    console.error('DB Connection Error:', err);
    process.exit(1);
  }
};

export default connectDB;