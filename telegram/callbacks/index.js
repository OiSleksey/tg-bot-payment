import axios from 'axios'
import { sendTelegramMessage } from '../index.js'
import { getTimeInUkraine } from '../../assets/dateFormat.js'
import { allowedUsers } from '../../globals/index.js'
import {
  CALLBACK_DATA_KEY,
  CANCEL_PAID_PART_KEY,
  CANCEL_PAY_PART_KEY,
  INLINE_KEYBOARD_KEY,
  PAID_PART_KEY,
  PAY_PART_KEY,
  TEXT_KEY,
} from '../../constants/index.js'
import { getValidateNumber } from '../../assets/validateData.js'
import {
  googleSheetUpdateByCancelPaid,
  googleSheetUpdateByCancelPay,
  googleSheetUpdateByPaid,
  googleSheetUpdateByPay,
} from '../../google/sheets/telegramUpdateSheet.js'
import { getSheetData } from '../../local/index.js'

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

const handlePayClick = async (callbackQuery, id, messageId, user, chatId) => {
  try {
    console.log('id 1', id)
    console.log('messageId 1', messageId)
    console.log('user 1', user)
    console.log('chatId 1', chatId)
    const message = `🟢 Оплатить | нажал "${user}" в ${getTimeInUkraine()}`
    const idPaid = PAID_PART_KEY + '_' + getValidateNumber(id)
    const idCancelPaid = CANCEL_PAID_PART_KEY + '_' + getValidateNumber(id)
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
      {
        chat_id: chatId,
        message_id: messageId,
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
    // for (const chatId of allowedUsers) {
    //   const idPaid = PAID_PART_KEY + '_' + getValidateNumber(id)
    //   const idCancelPaid = CANCEL_PAID_PART_KEY + '_' + getValidateNumber(id)
    //   await axios.post(
    //     `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
    //     {
    //       chat_id: chatId,
    //       message_id: messageId,
    //       reply_markup: {
    //         [INLINE_KEYBOARD_KEY]: [
    //           [
    //             { [TEXT_KEY]: '✅ Оплачено', [CALLBACK_DATA_KEY]: idPaid },
    //             {
    //               [TEXT_KEY]: '❌ Отменить',
    //               [CALLBACK_DATA_KEY]: idCancelPaid,
    //             },
    //           ],
    //         ],
    //       },
    //     },
    //   )
    //   await sendTelegramMessage(chatId, message)
    // }
    await googleSheetUpdateByPay(id, message)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

const handleCancelPayClick = async (callbackQuery, id, messageId, user) => {
  console.log('sheetData ', getSheetData())
  const message = `❌ Отменить | (Вместо Оплатить) нажал "${user}" в ${getTimeInUkraine()}`
  try {
    for (const chatId of allowedUsers) {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            [INLINE_KEYBOARD_KEY]: [],
          },
        },
      )
      await sendTelegramMessage(chatId, message)
    }
    await googleSheetUpdateByCancelPay(id, message)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

const handlePaidClick = async (callbackQuery, id, messageId, user) => {
  try {
    const message = `✅ Оплачено | нажал "${user}" в ${getTimeInUkraine()}`
    for (const chatId of allowedUsers) {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            [INLINE_KEYBOARD_KEY]: [],
          },
        },
      )
      await sendTelegramMessage(chatId, message)
    }
    await googleSheetUpdateByPaid(id, message)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

const handleCancelPaidClick = async (callbackQuery, id, messageId, user) => {
  try {
    const message = `❌ Отменить | (Вместо Оплачено) нажал "${user}" в ${getTimeInUkraine()}`
    for (const chatId of allowedUsers) {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            [INLINE_KEYBOARD_KEY]: [],
          },
        },
      )

      await sendTelegramMessage(chatId, message)
    }
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
    const chatId = callbackQuery.message.chat.id

    if (action === PAY_PART_KEY) {
      await handlePayClick(callbackQuery, id, messageId, user, chatId)
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
