import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const uploadToS3 = async (
    fileBuffer: Buffer,
    fileName: string,
    contentType: string
) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Generate a presigned URL for downloading (valid for 7 days)
    // modifying getObject command access would correspond to reading.
    // For now simple upload.
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

export { s3Client };
