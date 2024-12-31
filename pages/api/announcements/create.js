import { transaction } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, content, priority, media } = req.body

    const result = await transaction(async (connection) => {
      // Insert announcement
      const [announcementResult] = await connection.execute(
        `INSERT INTO announcements (title, content, priority) VALUES (?, ?, ?)`,
        [title, content, priority]
      )

      // Insert media
      for (let i = 0; i < media.length; i++) {
        await connection.execute(
          `INSERT INTO announcement_media (announcement_id, media_url, media_type, display_order) 
           VALUES (?, ?, ?, ?)`,
          [announcementResult.insertId, media[i].url, media[i].type, i]
        )
      }

      return announcementResult
    })

    return res.status(200).json({ id: result.insertId })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error creating announcement' })
  }
} 