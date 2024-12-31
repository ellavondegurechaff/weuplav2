import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { announcementId } = req.body

  if (!announcementId) {
    return res.status(400).json({ message: 'Announcement ID is required' })
  }

  try {
    await query(`
      INSERT INTO announcement_views (announcement_id, view_count) 
      VALUES (?, 1)
      ON DUPLICATE KEY UPDATE view_count = view_count + 1
    `, [announcementId])

    const [viewData] = await query(`
      SELECT view_count 
      FROM announcement_views 
      WHERE announcement_id = ?
    `, [announcementId])

    return res.status(200).json({ views: viewData.view_count })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error tracking announcement view' })
  }
} 