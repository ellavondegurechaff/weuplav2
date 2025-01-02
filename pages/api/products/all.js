import { query } from '@/lib/db'
import { CACHE_KEYS, getFromCache, setCache } from '@/lib/cache'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const cachedProducts = await getFromCache(CACHE_KEYS.ALL_PRODUCTS)
    if (cachedProducts) {
      return res.status(200).json(cachedProducts)
    }

    const products = await query(`
      SELECT 
        p.*,
        COALESCE(pv.view_count, 0) as view_count,
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
      LEFT JOIN product_views pv ON p.id = pv.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC, p.name
    `)

    const productsWithMedia = products.map(product => ({
      ...product,
      media: product.media.filter(Boolean)
    }))

    await setCache(CACHE_KEYS.ALL_PRODUCTS, productsWithMedia)
    return res.status(200).json(productsWithMedia)
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error fetching products' })
  }
} 