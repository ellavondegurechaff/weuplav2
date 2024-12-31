import { transaction } from '@/lib/db'

async function execute(connection, { id, title, content, priority, media }) {
  // Delete existing media first
  await connection.execute(
    'DELETE FROM announcement_media WHERE announcement_id = ?',
    [id]
  )

  // Update announcement
  await connection.execute(
    'UPDATE announcements SET title = ?, content = ?, priority = ? WHERE id = ?',
    [title, content, priority, id]
  )

  // Only insert media if it exists and has valid properties
  if (media && Array.isArray(media)) {
    const validMedia = media.filter(item => item && item.url && item.type)
    
    for (let i = 0; i < validMedia.length; i++) {
      await connection.execute(
        `INSERT INTO announcement_media (announcement_id, media_url, media_type, display_order) 
         VALUES (?, ?, ?, ?)`,
        [id, validMedia[i].url, validMedia[i].type, i]
      )
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id, title, content, priority, media } = req.body

    await transaction(async (connection) => {
      await execute(connection, { id, title, content, priority, media })
    })

    res.status(200).json({ message: 'Announcement updated successfully' })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Error updating announcement' })
  }
} 