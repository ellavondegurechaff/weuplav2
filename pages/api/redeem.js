import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { amariKey, userId, discordTag } = req.body

  try {
    // First check if the key exists and is not redeemed
    const checkKey = await query(
      'SELECT * FROM license_keys WHERE amari_key = ? AND status = ?',
      [amariKey, 'inactive']
    )

    if (checkKey.length === 0) {
      return res.status(404).json({ message: 'Invalid or already redeemed key' })
    }

    // Update the key status and assign to user
    const result = await query(
      `UPDATE license_keys 
       SET status = ?, 
           discord_id = ?,
           discord_tag = ?,
           redeemed_at = CURRENT_TIMESTAMP,
           expires_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 YEAR)
       WHERE amari_key = ?`,
      ['active', userId, discordTag, amariKey]
    )

    const updatedKey = await query(
      'SELECT * FROM license_keys WHERE amari_key = ?',
      [amariKey]
    )

    return res.status(200).json(updatedKey[0])
  } catch (error) {
    console.error('Error redeeming key:', error)
    return res.status(500).json({ message: 'Error redeeming key' })
  }
} 