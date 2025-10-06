import express from "express";

const app = express();

import userRouter from "./routes/user.routes";
import videoRouter from "./routes/video.routes";
import likeRouter from "./routes/like.routes";
import playlistRouter from "./routes/playlist.routes";
import commentRouter from "./routes/comment.routes";
import subcriptionRouter from "./routes/subscription.routes";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/user", userRouter);
app.use("/api/video", videoRouter);
app.use("/api/like", likeRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/comment", commentRouter);
app.use("/api/subscription", subcriptionRouter);

export { app };
