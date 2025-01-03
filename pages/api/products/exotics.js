import { query } from '@/lib/db'
import { CACHE_KEYS, getFromCache, setCache } from '@/lib/cache'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Try cache first
    const cachedProducts = await getFromCache(CACHE_KEYS.EXOTIC_PRODUCTS)
    if (cachedProducts) {
      return res.status(200).json(cachedProducts)
    }

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
        ) as media,
        COALESCE((
          SELECT view_count 
          FROM product_views 
          WHERE product_id = p.id
        ), 0) as view_count
      FROM products p
      LEFT JOIN product_media pm ON p.id = pm.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC, p.name
    `, ['exotics'])

    const productsWithMedia = products.map(product => ({
      ...product,
      media: product.media.filter(Boolean)
    }))

    // Set cache
    await setCache(CACHE_KEYS.EXOTIC_PRODUCTS, productsWithMedia)

    return res.status(200).json(productsWithMedia)
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error fetching exotic products' })
  }
} 