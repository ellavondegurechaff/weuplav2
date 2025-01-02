import { transaction } from '@/lib/db'
import { invalidateProductCache } from '@/lib/cache'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, description, category_id, intown_price, shipped_price, media } = req.body

    if (!category_id || isNaN(category_id)) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }

    const result = await transaction(async (connection) => {
      // Insert product
      const [productResult] = await connection.execute(
        `INSERT INTO products (name, description, category_id, intown_price, shipped_price, image_url) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, parseInt(category_id), intown_price, shipped_price, media[0]?.url || null]
      )

      // Insert media
      for (let i = 0; i < media.length; i++) {
        await connection.execute(
          `INSERT INTO product_media (product_id, media_url, media_type, display_order) 
           VALUES (?, ?, ?, ?)`,
          [productResult.insertId, media[i].url, media[i].type, i]
        )
      }

      return productResult
    })

    await invalidateProductCache()
    return res.status(200).json({ id: result.insertId })
  } catch (error) {
    console.error('Database error:', error)
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: 'A product with this name already exists',
        error: 'DUPLICATE_NAME'
      })
    }
    
    return res.status(500).json({ message: 'Error creating product' })
  }
} 