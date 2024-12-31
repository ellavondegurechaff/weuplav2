import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME } from '@/lib/s3'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  },
  runtime: 'nodejs'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { files } = req.body
    
    // Upload files in parallel using Promise.all
    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(file.data, 'base64')
      const fileExtension = file.type.startsWith('video/') ? 'mp4' : 'jpg'
      const key = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ACL: 'public-read',
          ContentType: file.type
        })
      )

      return {
        url: `https://${BUCKET_NAME}.sgp1.cdn.digitaloceanspaces.com/${key}`,
        type: file.type.startsWith('video/') ? 'video' : 'image'
      }
    })

    const uploadedUrls = await Promise.all(uploadPromises)
    return res.status(200).json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ 
      message: 'Error uploading files',
      error: error.message 
    })
  }
} 