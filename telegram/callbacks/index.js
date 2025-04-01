import axios from 'axios'
import { sendTelegramMessage } from '../index.js'
import { getTimeInUkraine } from '../../assets/dateFormat.js'
import { allowedUsers } from '../../globals/index.js'
import {
  CALLBACK_DATA_KEY,
  CANCEL_PAID_PART_KEY,
  CANCEL_PAY_PART_KEY,
  CHAT_ID_KEY,
  INLINE_KEYBOARD_KEY,
  MESSAGE_ID_KEY,
  PAID_PART_KEY,
  PAY_PART_KEY,
  REDIS_PAYMENT_PART_KEY,
  TEXT_KEY,
} from '../../constants/index.js'
import {
  getValidateArray,
  getValidateNumber,
} from '../../assets/validateData.js'
import {
  googleSheetUpdateByCancelPaid,
  googleSheetUpdateByCancelPay,
  googleSheetUpdateByPaid,
  googleSheetUpdateByPay,
} from '../../google/sheets/telegramUpdateSheet.js'
import { getSheetData } from '../../local/index.js'
import { redis } from '../../libs/redis.js'

let TELEGRAM_TOKEN

if (process.env.VERCEL) {
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
} else {
  const dotenv = await import('dotenv')
  dotenv.config()
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
}

const sendErrorMassage = async (message) => {
  for (const chatId of allowedUsers) {
    const messageTelegram = `Ошибка ${message}"`
    await sendTelegramMessage(chatId, messageTelegram)
  }
}

const getRedisData = async (id) => {
  const raw = await redis.lrange(`${REDIS_PAYMENT_PART_KEY}_${id}`, 0, -1)
  return getValidateArray(raw)
}

const delRedisData = async (id) => {
  await redis.del(`${REDIS_PAYMENT_PART_KEY}_${id}`)
}

const handlePayClick = async (callbackQuery, id, messageId, user) => {
  try {
    const message = `➡️ Сделать запрос | нажал "${user}" в ${getTimeInUkraine()}`
    const idPaid = PAID_PART_KEY + '_' + getValidateNumber(id)
    const idCancelPaid = CANCEL_PAID_PART_KEY + '_' + getValidateNumber(id)
    const redisData = await getRedisData(id)
    for (const item of redisData) {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
        {
          chat_id: item[CHAT_ID_KEY],
          message_id: item[MESSAGE_ID_KEY],
          reply_markup: {
            [INLINE_KEYBOARD_KEY]: [
              [
                { [TEXT_KEY]: '✅ Оплачено', [CALLBACK_DATA_KEY]: idPaid },
                {
                  [TEXT_KEY]: '❌ Отменить',
                  [CALLBACK_DATA_KEY]: idCancelPaid,
                },
              ],
            ],
          },
        },
      )
      await sendTelegramMessage(
        item[CHAT_ID_KEY],
        message,
        null,
        item[MESSAGE_ID_KEY],
      )
    }
    await googleSheetUpdateByPay(id, message)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

const handleCancelPayClick = async (callbackQuery, id, messageId, user) => {
  const message = `❌ Отменить | (Вместо Оплатить) нажал "${user}" в ${getTimeInUkraine()}`
  const redisData = await getRedisData(id)
  try {
    for (const item of redisData) {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
        {
          chat_id: item[CHAT_ID_KEY],
          message_id: item[MESSAGE_ID_KEY],
          reply_markup: {
            [INLINE_KEYBOARD_KEY]: [],
          },
        },
      )
      await sendTelegramMessage(
        item[CHAT_ID_KEY],
        message,
        null,
        item[MESSAGE_ID_KEY],
      )
    }
    await delRedisData(id)
    await googleSheetUpdateByCancelPay(id, message)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

const handlePaidClick = async (callbackQuery, id, messageId, user) => {
  const message = `✅ Оплачено | нажал "${user}" в ${getTimeInUkraine()}`
  const redisData = await getRedisData(id)
  try {
    for (const item of redisData) {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
        {
          chat_id: item[CHAT_ID_KEY],
          message_id: item[MESSAGE_ID_KEY],
          reply_markup: {
            [INLINE_KEYBOARD_KEY]: [],
          },
        },
      )
      await sendTelegramMessage(
        item[CHAT_ID_KEY],
        message,
        null,
        item[MESSAGE_ID_KEY],
      )
    }
    await delRedisData(id)
    await googleSheetUpdateByPaid(id, message)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

const handleCancelPaidClick = async (callbackQuery, id, messageId, user) => {
  const message = `❌ Отменить | (Вместо Оплачено) нажал "${user}" в ${getTimeInUkraine()}`
  const redisData = await getRedisData(id)
  try {
    for (const item of redisData) {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
        {
          chat_id: item[CHAT_ID_KEY],
          message_id: item[MESSAGE_ID_KEY],
          reply_markup: {
            [INLINE_KEYBOARD_KEY]: [],
          },
        },
      )
      await sendTelegramMessage(
        item[CHAT_ID_KEY],
        message,
        null,
        item[MESSAGE_ID_KEY],
      )
    }
    await delRedisData(id)
    await googleSheetUpdateByCancelPaid(id, message)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

export async function handleCallbackQuery(callbackQuery) {
  try {
    const data = callbackQuery.data
    console.log('callbackQuery ', callbackQuery)
    const [action, id] = data.split('_')
    const user = callbackQuery.from.username || callbackQuery.from.first_name
    const messageId = callbackQuery.message.message_id
    // const chatId = callbackQuery.message.chat.id

    if (action === PAY_PART_KEY) {
      await handlePayClick(callbackQuery, id, messageId, user)
    } else if (action === CANCEL_PAY_PART_KEY) {
      await handleCancelPayClick(callbackQuery, id, messageId, user)
    } else if (action === PAID_PART_KEY) {
      await handlePaidClick(callbackQuery, id, messageId, user)
    } else if (action === CANCEL_PAID_PART_KEY) {
      await handleCancelPaidClick(callbackQuery, id, messageId, user)
    }
  } catch (error) {
    console.error('❌ Ошибка обработки callbackQuery:', error.message)
  }
}
