import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { touchdownId } = req.body

  if (!touchdownId) {
    return res.status(400).json({ message: 'Touchdown ID is required' })
  }

  try {
    // First, check if a record exists
    const [existingView] = await query(`
      SELECT view_count 
      FROM touchdown_views 
      WHERE touchdown_id = ?
    `, [touchdownId])

    if (existingView) {
      // Update existing record
      await query(`
        UPDATE touchdown_views 
        SET view_count = view_count + 1 
        WHERE touchdown_id = ?
      `, [touchdownId])
    } else {
      // Create new record
      await query(`
        INSERT INTO touchdown_views (touchdown_id, view_count) 
        VALUES (?, 1)
      `, [touchdownId])
    }

    // Get updated view count
    const [viewData] = await query(`
      SELECT view_count 
      FROM touchdown_views 
      WHERE touchdown_id = ?
    `, [touchdownId])

    return res.status(200).json({ views: viewData.view_count })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error tracking touchdown view' })
  }
} 