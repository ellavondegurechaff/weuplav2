import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id, name, description, category_id, intown_price, shipped_price, image_url } = req.body

  try {
    await query(`
      UPDATE products 
      SET name = ?, 
          description = ?, 
          category_id = ?, 
          intown_price = ?, 
          shipped_price = ?,
          image_url = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, category_id, intown_price, shipped_price, image_url, id])

    return res.status(200).json({ message: 'Product updated successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error updating product' })
  }
} 