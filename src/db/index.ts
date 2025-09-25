import mongoose, { MongooseError } from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
  try {
    const URI = process.env.MONGODB_URI;
    if (URI) {
      const mongodbInstance = await mongoose.connect(`${URI}/${DB_NAME}`);
      console.log(
        "🛢 MongoDB data base is connected successfully. \nDB Host: ",
        mongodbInstance.connection.host
      );
    }
  } catch (err: unknown) {
    console.log("❌ Failed to connect to mongodb");
    if (err instanceof mongoose.Error) {
      console.error("MongoDB Error: ", err);
    } else if (err instanceof Error) {
      console.error("Connection Error: ", err);
    } else {
      console.error("Unknown error: ", err);
    }
    process.exit();
  }
};

export default connectDB;
