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

export const getPublicId = (url: string) => {
  const cleanUrl = url.split("?")[0];
  const parts = cleanUrl.split("/upload/");
  if (parts.length < 2) return "";
  const afterUpload = parts[1];
  const withoutVersion = afterUpload.replace(/^v[0-9]+\//, "");
  return (
    withoutVersion.substring(0, withoutVersion.lastIndexOf(".")) ||
    withoutVersion
  );
};

export const deleteFromCloudinary = async (
  pubId: string,
  resourceType: "image" | "video" = "image"
) => {
  try {
    await cloudinary.uploader.destroy(pubId, {
      resource_type: resourceType,
      invalidate: true,
    });
  } catch (err: any) {
    throw new Error("cloudinaryDelErr");
  }
};
