export function generateKey(id) {
  const generateSegment = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return Array.from({ length: 4 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')
  }

  const newKey = `AMARI-${generateSegment()}-${generateSegment()}`
  
  return {
    id,
    key: newKey,
    machoLicense: `macho-${generateSegment().toLowerCase()}`,
    status: 'active',
    user: 'unassigned',
    created: new Date().toISOString().split('T')[0]
  }
} 