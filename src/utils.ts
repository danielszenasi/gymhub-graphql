import { sign } from "jsonwebtoken";
import * as cloudinary from "cloudinary";

export function generateToken(user: any) {
  return sign(
    {
      userId: user.id,
      trainerProfileId: user.trainerProfileId
    },
    process.env.JWT_SECRET
  );
}

export async function processUpload(upload: any): Promise<string> {
  const { stream } = await upload;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    const url = await new Promise<string>((resolve, reject) => {
      const streamLoad = cloudinary.v2.uploader.upload_stream(
        (error: any, result: any) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        }
      );
      stream.pipe(streamLoad);
    });
    return url;
  } catch (err) {
    throw new Error(`Failed to upload profile picture! Err:${err.message}`);
  }
}
