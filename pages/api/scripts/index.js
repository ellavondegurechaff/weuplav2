import { query } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const scripts = await query(`
      SELECT 
        s.id,
        s.name,
        s.file_path,
        s.uploaded_at,
        lk.amari_key as license
      FROM scripts s
      JOIN license_keys lk ON s.license_id = lk.id
      ORDER BY s.uploaded_at DESC
    `)

    const formattedScripts = scripts.map(script => ({
      id: script.id,
      name: script.name,
      license: script.license,
      uploaded: new Date(script.uploaded_at).toISOString().split('T')[0]
    }))

    return res.status(200).json(formattedScripts)
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ message: 'Error fetching scripts' })
  }
} 