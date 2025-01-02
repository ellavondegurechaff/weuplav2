import redis from './redis'

const CACHE_TTL = 300 // 5 minutes

export const CACHE_KEYS = {
  ALL_PRODUCTS: 'all_products',
  HIGH_PRODUCTS: 'high_products',
  MID_PRODUCTS: 'mid_products',
  LOW_PRODUCTS: 'low_products',
  EXOTIC_PRODUCTS: 'exotic_products',
  EDIBLE_PRODUCTS: 'edible_products'
}

export async function getFromCache(key) {
  try {
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('Cache retrieval error:', error)
    return null
  }
}

export async function setCache(key, data) {
  try {
    await redis.setex(key, CACHE_TTL, JSON.stringify(data))
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function invalidateProductCache() {
  try {
    const keys = Object.values(CACHE_KEYS)
    if (keys.length > 0) {
      await redis.del(keys)
    }
  } catch (error) {
    console.error('Cache invalidation error:', error)
  }
}

export { CACHE_TTL } 