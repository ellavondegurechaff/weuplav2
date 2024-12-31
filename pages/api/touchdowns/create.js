import { transaction } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, description, media } = req.body

    const result = await transaction(async (connection) => {
      // Insert touchdown
      const [touchdownResult] = await connection.execute(
        `INSERT INTO touchdowns (title, description) VALUES (?, ?)`,
        [title, description]
      )

      // Insert media
      for (let i = 0; i < media.length; i++) {
        await connection.execute(
          `INSERT INTO touchdown_media (touchdown_id, media_url, media_type, display_order) 
           VALUES (?, ?, ?, ?)`,
          [touchdownResult.insertId, media[i].url, media[i].type, i]
        )
      }

      return touchdownResult
    })

    return res.status(200).json({ id: result.insertId })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error creating touchdown' })
  }
} 