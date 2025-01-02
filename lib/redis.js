import { Redis } from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  username: 'default',
  tls: {},
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) {
      return null
    }
    return Math.min(times * 200, 1000)
  },
  reconnectOnError: (err) => {
    console.error('Redis reconnect error:', err)
    return true
  }
})

redis.on('error', (error) => {
  console.error('Redis connection error:', error)
})

redis.on('connect', () => {
  console.log('Successfully connected to Redis')
})

export default redis 