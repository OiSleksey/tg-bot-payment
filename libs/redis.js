import { Redis } from '@upstash/redis'
import { REDIS_PAYMENT_PART_KEY, TYPE_BUTTONS_KEY } from '../constants/index.js'
import { getValidateArray } from '../assets/validateData.js'

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

export const setRedisData = async (redisData) => {
  for (const [key, values] of Object.entries(redisData)) {
    await redis.del(key)
    await redis.rpush(key, ...values)
  }
}

export const getRedisData = async (id) => {
  const raw = await redis.lrange(`${REDIS_PAYMENT_PART_KEY}_${id}`, 0, -1)
  return getValidateArray(raw)
}

export const delRedisData = async (id) => {
  await redis.del(`${REDIS_PAYMENT_PART_KEY}_${id}`)
}

export const setRedisDataByEdit = async (redisData, id, type) => {
  if (type && id) {
    const key = `${REDIS_PAYMENT_PART_KEY}_${id}`
    for (const values of redisData) {
      await redis.del(key)
      const newValues = values.map((item) => ({
        ...item,
        [TYPE_BUTTONS_KEY]: type,
      }))
      await redis.rpush(key, ...newValues)
    }
  } else {
    console.error(`Not found id:${id} or type:${type} in "setRedisDataByEdit"`)
  }
}
