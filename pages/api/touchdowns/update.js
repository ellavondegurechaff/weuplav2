import { transaction } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id, title, description, media } = req.body

    await transaction(async (connection) => {
      // Update touchdown
      await connection.execute(
        `UPDATE touchdowns SET title = ?, description = ? WHERE id = ?`,
        [title, description, id]
      )

      // Delete existing media
      await connection.execute(
        'DELETE FROM touchdown_media WHERE touchdown_id = ?',
        [id]
      )

      // Insert new media
      for (let i = 0; i < media.length; i++) {
        await connection.execute(
          `INSERT INTO touchdown_media (touchdown_id, media_url, media_type, display_order) 
           VALUES (?, ?, ?, ?)`,
          [id, media[i].url, media[i].type, i]
        )
      }
    })

    res.status(200).json({ message: 'Touchdown updated successfully' })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Error updating touchdown' })
  }
} 