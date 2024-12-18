import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'amaricheats',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  namedPlaceholders: true,
})

const validateParams = (params) => {
  if (!Array.isArray(params)) return false
  return params.every(param => param !== undefined && param !== null)
}

async function query(sql, params = []) {
  try {
    if (params.length && !validateParams(params)) {
      throw new Error('Invalid parameters detected')
    }
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error(`Query failed: ${error.message}`)
  }
}

export { pool, query } 