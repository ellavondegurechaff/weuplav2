import { query } from '@/lib/db'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME } from '@/lib/s3'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id, image_url } = req.body

    // Delete image from DigitalOcean Spaces if exists
    if (image_url) {
      try {
        // Extract key from the full URL
        const key = image_url.split(`${BUCKET_NAME}.sgp1.cdn.digitaloceanspaces.com/`)[1]
        
        if (key) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: key
            })
          )
        }
      } catch (error) {
        console.error('Error deleting image from storage:', error)
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete product from database
    await query('DELETE FROM products WHERE id = ?', [id])

    return res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error deleting product' })
  }
} 