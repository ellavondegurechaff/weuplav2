import { transaction } from '@/lib/db'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME } from '@/lib/s3'
import { invalidateProductCache } from '@/lib/cache'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id } = req.body

    await transaction(async (connection) => {
      // Get media URLs
      const [mediaItems] = await connection.execute(
        'SELECT media_url FROM product_media WHERE product_id = ?',
        [id]
      )

      // Delete media files from storage
      for (const item of mediaItems) {
        try {
          const key = item.media_url.split(`${BUCKET_NAME}.sgp1.cdn.digitaloceanspaces.com/`)[1]
          if (key) {
            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key
              })
            )
          }
        } catch (error) {
          console.error('Error deleting media from storage:', error)
        }
      }

      // Delete from database in correct order (foreign key constraints)
      await connection.execute('DELETE FROM product_media WHERE product_id = ?', [id])
      await connection.execute('DELETE FROM product_views WHERE product_id = ?', [id])
      await connection.execute('DELETE FROM products WHERE id = ?', [id])
    })

    await invalidateProductCache()
    return res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error deleting product' })
  }
} 