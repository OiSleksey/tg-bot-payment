import { readSheet } from '../index.js'
import { setSheetData } from '../../local/index.js'
import { getDataByAlertRequest } from '../utils/payData.js'
import { getDataSheetPending } from '../utils/rangeCell.js'
import { updateMultipleSpecificCells } from './updateSheet.js'
import {
  getDataMessagesPending,
  sendTelegramMessage,
} from '../../telegram/index.js'
import { allowedUsers } from '../../globals/index.js'
import { delaySeconds } from '../../assets/dateFormat.js'
import {
  CHAT_ID_KEY,
  ID_KEY,
  INLINE_KEYBOARD_KEY,
  MESSAGE_ID_KEY,
  REDIS_PAYMENT_PART_KEY,
  TEXT_KEY,
} from '../../constants/index.js'
import { redis } from '../../libs/redis.js'
import { getValidateArray } from '../../assets/validateData.js'

const setRedisData = async (redisData) => {
  for (const [key, values] of Object.entries(redisData)) {
    await redis.del(key)
    await redis.rpush(key, ...values)
  }
}

export async function repeatSheet() {
  const sheetData = await readSheet()

  const dataByAlert = getDataByAlertRequest(sheetData)
  if (!dataByAlert.length) {
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(chatId, `Ближайшие 3 дня нет проплат`)
    }
    return Promise.resolve()
  } else {
    const dataByAlertSheet = getDataSheetPending(dataByAlert)
    const telegramMessages = getDataMessagesPending(dataByAlert)
    const redisData = {}
    for (const message of telegramMessages) {
      for (const chatId of allowedUsers) {
        const messageId = await sendTelegramMessage(chatId, message[TEXT_KEY], {
          [INLINE_KEYBOARD_KEY]: message[INLINE_KEYBOARD_KEY],
        })
        if (messageId) {
          const redisKey = `${REDIS_PAYMENT_PART_KEY}_${message[ID_KEY]}`

          if (!redisData[redisKey]) {
            redisData[redisKey] = []
          }

          redisData[redisKey].push(
            JSON.stringify({
              [CHAT_ID_KEY]: chatId,
              [MESSAGE_ID_KEY]: messageId,
            }),
          )
          await delaySeconds(0.1)
        }
      }
    }

    await setRedisData(redisData)
    await updateMultipleSpecificCells(dataByAlertSheet)
    return Promise.resolve()
  }
}

// console.log('📥 Запрос от Google Apps Script:', getTimeInUkraine())
// try {
//     for (const chatId of allowedUsers) {
//         await sendTelegramMessage(
//             chatId,
//             `📬 Получен запрос с Google Apps Script в ${getTimeInUkraine()}`,
//         )
//         await delaySeconds(1)
//     }
//     res.status(200).json({ message: '✅ Google trigger received!' })
// } catch (err) {
//     console.error('❌ Ошибка обработки Google запроса:', err)
//     res.status(500).json({ error: 'Ошибка сервера' })
// }
