import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const result = await query(
      `SELECT * FROM license_keys 
       WHERE discord_id = ? 
       AND status = 'active' 
       AND expires_at > NOW()
       LIMIT 1`,
      [userId]
    )

    return res.status(200).json({
      hasLicense: result.length > 0,
      status: result.length > 0 ? 'active' : 'inactive'
    })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Failed to check license status' })
  }
} 