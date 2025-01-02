import { transaction } from '@/lib/db'
import { invalidateProductCache } from '@/lib/cache'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id, name, description, category_id, intown_price, shipped_price, media = [] } = req.body

  if (!id || !name || !category_id) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    await transaction(async (connection) => {
      // Update product
      await connection.execute(`
        UPDATE products 
        SET name = ?, 
            description = ?, 
            category_id = ?, 
            intown_price = ?, 
            shipped_price = ?,
            image_url = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, description, category_id, intown_price, shipped_price, media[0]?.url || null, id])

      // Delete existing media
      await connection.execute('DELETE FROM product_media WHERE product_id = ?', [id])

      // Insert new media if provided
      if (media.length > 0) {
        const mediaValues = media.map((item, index) => [id, item.url, item.type || 'image', index])
        
        for (const values of mediaValues) {
          await connection.execute(
            `INSERT INTO product_media (product_id, media_url, media_type, display_order) 
             VALUES (?, ?, ?, ?)`,
            values
          )
        }
      }
    })

    await invalidateProductCache()
    return res.status(200).json({ message: 'Product updated successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error updating product' })
  }
} 