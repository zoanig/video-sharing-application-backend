import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SCRET,
});

export const uploadtoCloudnary = async (localfile: string, folder: string) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localfile, {
      resource_type: "auto",
      folder,
    });
    fs.unlinkSync(localfile);
    return uploadResult;
  } catch (err: any) {
    throw new Error("cloudinaryErr");
  }
};

export const getPublicId = (imageURL: string) =>
  imageURL.split("/").pop()!.split(".")[0];

export const deleteFromCloudinary = async (pubId: string) => {
  try {
    await cloudinary.uploader.destroy(pubId, {
      invalidate: true,
    });
  } catch (err: any) {
    throw new Error("cloudinaryDelErr");
  }
};
