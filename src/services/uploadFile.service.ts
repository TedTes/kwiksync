import { s3Client } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { envVariables } from "../config";
const {
  configAWS: { s3BucketName },
  configCDN: cdnBaseURL,
} = envVariables;

export const upload = async (file: Express.Multer.File): Promise<string> => {
  try {
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const filePath = `uploads/${year}/${month}/${fileName}`;

    const command: s3FileObj = {
      bucket: s3BucketName!,
      key: filePath,
      body: file.buffer,
      mimeType: file.mimetype,
    };

    await s3Client.upload(command);

    // Return CDN URL
    return `${cdnBaseURL}/${filePath}`;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file to cloud storage");
  }
};
