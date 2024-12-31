import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const touchdowns = await query(`
      SELECT 
        t.*,
        MAX(COALESCE(tv.view_count, 0)) as view_count,
        COALESCE(
          JSON_ARRAYAGG(
            IF(tm.id IS NOT NULL,
              JSON_OBJECT(
                'id', tm.id,
                'url', tm.media_url,
                'type', tm.media_type,
                'display_order', tm.display_order
              ),
              NULL
            )
          ),
          '[]'
        ) as media
      FROM touchdowns t
      LEFT JOIN touchdown_media tm ON t.id = tm.touchdown_id
      LEFT JOIN touchdown_views tv ON t.id = tv.touchdown_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `)

    const formattedTouchdowns = touchdowns.map(touchdown => ({
      ...touchdown,
      media: JSON.parse(touchdown.media.replace('null,', '').replace(',null', ''))
    }))

    res.status(200).json(formattedTouchdowns)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Error fetching touchdowns' })
  }
} 