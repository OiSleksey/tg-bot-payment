import { Redis } from '@upstash/redis'

let UPSTASH_REDIS_REST_URL
let UPSTASH_REDIS_REST_TOKEN

if (process.env.VERCEL) {
  UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
} else {
  const dotenv = await import('dotenv')
  dotenv.config()
  UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
}

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
})
