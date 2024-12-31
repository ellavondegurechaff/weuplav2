import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client, BUCKET_NAME } from '@/lib/s3'

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { fileType, fileName } = req.body
    const key = `products/${Date.now()}-${Math.random().toString(36).substring(7)}-${fileName}`

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      ACL: 'public-read'
    })

    const presignedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600,
      // Add these signableHeaders to ensure CORS works with presigned URLs
      signableHeaders: new Set([
        'host',
        'content-type',
        'x-amz-acl',
        'x-amz-content-sha256'
      ])
    })
    const fileUrl = `https://${BUCKET_NAME}.sgp1.cdn.digitaloceanspaces.com/${key}`

    return res.status(200).json({ presignedUrl, fileUrl })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return res.status(500).json({ message: 'Error generating upload URL' })
  }
} 