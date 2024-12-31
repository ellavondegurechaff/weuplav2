import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const products = await query(`
      SELECT 
        p.*,
        COALESCE(
          JSON_ARRAYAGG(
            IF(pm.id IS NOT NULL,
              JSON_OBJECT(
                'id', pm.id,
                'url', pm.media_url,
                'type', pm.media_type,
                'order', pm.display_order
              ),
              NULL
            )
          ),
          JSON_ARRAY()
        ) as media
      FROM products p
      LEFT JOIN product_media pm ON p.id = pm.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC, p.name
    `)

    // Filter out null values from media array
    const productsWithMedia = products.map(product => ({
      ...product,
      media: product.media.filter(Boolean)
    }))

    return res.status(200).json(productsWithMedia)
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error fetching products' })
  }
} 