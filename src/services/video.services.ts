import { Video } from "../models/video.model";
import { payload } from "../types";

export const storeVideo = async (
  user: payload,
  videoSrc: string,
  thumbnail: string,
  title: string,
  description?: string
) => {
  const savedVid = new Video({
    videoSrc,
    thumbnail,
    description,
    title,
    owner: user._id,
  });
  await savedVid.save();
  return savedVid;
};
