import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME } from '@/lib/s3'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const buffer = Buffer.from(await req.body, 'base64')
    const key = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ACL: 'public-read',
        ContentType: 'image/jpeg'
      })
    )

    const url = `https://${BUCKET_NAME}.sgp1.cdn.digitaloceanspaces.com/${key}`
    return res.status(200).json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ 
      message: 'Error uploading file',
      error: error.message 
    })
  }
} 