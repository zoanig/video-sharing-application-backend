import "dotenv/config";
import connectDB from "./db";
import { PORT } from "./constants";
import { app } from "./app";
import * as requser from "./types/express/";

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌐  Server Started at port: ${PORT}`);
    });
  })
  .catch((err: any) => console.error("Connection Failed", err));
