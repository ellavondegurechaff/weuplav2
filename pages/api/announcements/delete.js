import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Missing announcement ID' })
  }

  try {
    await query('DELETE FROM announcements WHERE id = ?', [id])
    return res.status(200).json({ message: 'Announcement deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error deleting announcement' })
  }
} 