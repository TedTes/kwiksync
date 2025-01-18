import { S3Client as S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { configAWS } from "../config";
const { AWSaccessKeyId, AWSsecretAccessKey, region } = configAWS;

class S3Client {
  private s3;
  constructor() {
    this.s3 = new S3({
      region,
      credentials: {
        accessKeyId: AWSaccessKeyId,
        secretAccessKey: AWSsecretAccessKey,
      },
    });
  }
  upload = async ({ bucket, key, body, mimeType }: s3FileObj) => {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: mimeType,
    });

    return await this.s3.send(command);
  };
}

export const s3Client = new S3Client();
