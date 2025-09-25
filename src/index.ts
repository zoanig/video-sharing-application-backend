import { configDotenv } from "dotenv";
configDotenv();
import connectDB from "./db";
import { PORT } from "./constants";
import { app } from "./app";

console.log(process.env.PORT);
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌐  Server Started at port: ${PORT}`);
    });
  })
  .catch((err: any) => console.error("Connection Failed", err));
