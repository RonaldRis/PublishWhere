
import mongoose from "mongoose";


const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);


    console.log(`MongoDB Connected`);
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { connectDatabase };
