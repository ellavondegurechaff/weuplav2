import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const announcements = await query(`
      SELECT 
        a.*,
        COALESCE(av.view_count, 0) as view_count,
        COALESCE(
          JSON_ARRAYAGG(
            IF(am.id IS NOT NULL,
              JSON_OBJECT(
                'id', am.id,
                'url', am.media_url,
                'type', am.media_type,
                'display_order', am.display_order
              ),
              NULL
            )
          ),
          '[]'
        ) as media
      FROM announcements a
      LEFT JOIN announcement_media am ON a.id = am.announcement_id
      LEFT JOIN announcement_views av ON a.id = av.announcement_id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `)

    const formattedAnnouncements = announcements.map(announcement => ({
      ...announcement,
      media: JSON.parse(announcement.media.replace('null,', '').replace(',null', ''))
    }))

    res.status(200).json(formattedAnnouncements)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ message: 'Error fetching announcements' })
  }
} 