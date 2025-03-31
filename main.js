import {
  getDataByAlertRequest,
  getDataSheetPending,
  repeatSheet,
} from './google/index.js'
import {
  INLINE_KEYBOARD_KEY,
  REDIS_PAYMENT_PART_KEY,
  TEXT_KEY,
  VALUES_KEY,
} from './constants/index.js'
import { getSheetData } from './local/index.js'
import {
  getDataMessagesPending,
  sendTelegramMessage,
} from './telegram/index.js'
import { googleSheetUpdateByPay } from './google/sheets/telegramUpdateSheet.js'
import { redis } from './libs/redis.js'
import { allowedUsers } from './globals/index.js'
import { delaySeconds } from './assets/dateFormat.js'

// const setAlertData = () => {
//   const sheetData = getSheetData()
//   const dataByAlert = getDataByAlertRequest(sheetData)
//   if (!dataByAlert.length) return null
//   const dataSheet = getDataSheetPending(dataByAlert)
//   console.log('Set Is_Pending Sheet ', dataSheet[0][VALUES_KEY])
//   const dataMessages = getDataMessagesPending(dataByAlert)
//   console.log(
//     'send messages in telegram ',
//     dataMessages[0][INLINE_KEYBOARD_KEY][0],
//   )
// }

// googleSheetUpdateByPay(34, 'MESAge')
// repeatSheet()

// await redis.set('sheetData', JSON.stringify(data))
// const sheetData = JSON.parse(await redis.get('sheetData'))
const start = performance.now()
const getRedis = async () => {
  const messages = await redis.lrange(`${REDIS_PAYMENT_PART_KEY}_1`, 0, -1)
  console.log(messages)
}

const telegramMessages = [
  {
    id: 1,
  },
  { id: 2 },
  { id: 3 },
]

const setRedis = async () => {
  const redisData = {}
  for (const message of telegramMessages) {
    const redisKey = `${REDIS_PAYMENT_PART_KEY}_${message.id}`
    for (const chatId of allowedUsers) {
      const messageId = Date.now()
      if (messageId) {
        if (!redisData[redisKey]) {
          redisData[redisKey] = []
        }
        redisData[redisKey].push(
          JSON.stringify({ chatId, message_id: messageId }),
        )
      }
    }
  }

  for (const [key, values] of Object.entries(redisData)) {
    await redis.del(key)
    await redis.rpush(key, ...values)
  }
}

setRedis().then(() => {
  const end = performance.now()
  console.log(`Функция выполнилась за ${(end - start) / 1000} с`)
  getRedis()
})

// redisFunc().finally(() => {
//   const end = performance.now()
//   console.log(`Функция выполнилась за ${(end - start) / 1000} с`)
// })
