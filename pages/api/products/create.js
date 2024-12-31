import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, description, category_id, intown_price, shipped_price, image_url } = req.body

    // Validate category_id
    if (!category_id || isNaN(category_id)) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }

    const result = await query(
      `INSERT INTO products (name, description, category_id, intown_price, shipped_price, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, parseInt(category_id), intown_price, shipped_price, image_url]
    )

    return res.status(200).json({ id: result.insertId })
  } catch (error) {
    console.error('Database error:', error)
    
    // Check for duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: 'A product with this name already exists',
        error: 'DUPLICATE_NAME'
      })
    }
    
    return res.status(500).json({ message: 'Error creating product' })
  }
} 