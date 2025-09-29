import express from "express";

const app = express();

import userRouter from "./routes/user.routes";
import videoRouter from "./routes/video.routes";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/user", userRouter);
app.use("/api/video", videoRouter);

export { app };
