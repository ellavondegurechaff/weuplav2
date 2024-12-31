import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const products = await query(`
      SELECT p.* 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ?
      ORDER BY p.created_at DESC, p.name
    `, ['exotics'])

    return res.status(200).json(products)
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error fetching exotic products' })
  }
} 