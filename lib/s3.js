import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  endpoint: 'https://sgp1.digitaloceanspaces.com',
  region: 'sgp1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET
  }
})

export const BUCKET_NAME = 'weupla' 