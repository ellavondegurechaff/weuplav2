import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const categories = await query('SELECT * FROM categories')
    return res.status(200).json(categories)
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error fetching categories' })
  }
} 