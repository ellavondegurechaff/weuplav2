import { transaction } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Missing touchdown ID' })
  }

  try {
    await transaction(async (connection) => {
      // Delete touchdown (media will be deleted automatically due to CASCADE)
      await connection.execute(
        'DELETE FROM touchdowns WHERE id = ?',
        [id]
      )
    })

    return res.status(200).json({ message: 'Touchdown deleted successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error deleting touchdown' })
  }
} 