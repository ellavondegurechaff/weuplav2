import { query } from '@/lib/db'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), 'uploads'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024 // 5MB
  })

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const amariKey = fields.amariKey[0]
    const machoKey = fields.machoKey[0]
    const file = files.file[0]

    // Verify license keys
    const license = await query(
      `SELECT * FROM license_keys 
       WHERE amari_key = ? 
       AND macho_key = ?
       AND status = 'active' 
       AND expires_at > NOW()`,
      [amariKey, machoKey]
    )

    console.log('Upload attempt:', {
      amariKey,
      machoKey,
      licenseFound: license.length > 0
    })

    if (license.length === 0) {
      if (file && file.filepath) {
        fs.unlinkSync(file.filepath)
      }
      return res.status(401).json({ message: 'Invalid or inactive license keys' })
    }

    // Save script to database
    const result = await query(
      `INSERT INTO scripts (name, file_path, license_id, uploaded_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [file.originalFilename, file.filepath, license[0].id]
    )

    return res.status(200).json({
      id: result.insertId,
      name: file.originalFilename,
      license: amariKey,
      uploaded: new Date().toISOString().split('T')[0]
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ message: 'Error uploading script' })
  }
} 