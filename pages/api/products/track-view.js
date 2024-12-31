import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { productId } = req.body

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' })
  }

  try {
    // First try to update existing record
    await query(`
      INSERT INTO product_views (product_id, view_count) 
      VALUES (?, 1)
      ON DUPLICATE KEY UPDATE view_count = view_count + 1
    `, [productId])

    // Get current view count
    const [viewData] = await query(`
      SELECT view_count 
      FROM product_views 
      WHERE product_id = ?
    `, [productId])

    return res.status(200).json({ views: viewData.view_count })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error tracking product view' })
  }
} 