import {
  CALLBACK_DATA_KEY,
  CANCEL_PAID_PART_KEY,
  CANCEL_PAY_PART_KEY,
  CHAT_ID_KEY,
  COST_KEY,
  DAYS_UNTIL_PAYMENT_KEY,
  DAYS_UNTIL_REQUEST_KEY,
  ID_KEY,
  INLINE_KEYBOARD_KEY,
  LOGIN_KEY,
  MESSAGE_ID_KEY,
  NAME_KEY,
  NEXT_DATE_PAYMENT_KEY,
  NICKNAME_ANSWERABLE_KEY,
  PAID_PART_KEY,
  PAY_PART_KEY,
  TEXT_KEY,
} from '../../constants/index.js'
import { getValidateNumber } from '../../assets/validateData.js'
import { getDisplayDateWithDay } from '../../assets/dateFormat.js'

export const getDataMessagesPending = (data) => {
  return data.map((item) => {
    const text = `🦆 Утка/Гусь :) ${item?.[NICKNAME_ANSWERABLE_KEY]}\n💳 Проплата: ${item?.[NAME_KEY]}\n🪙 Сумма: ${item?.[COST_KEY]}\nЛогин: ${item?.[LOGIN_KEY]}\nОсталось дней до запроса: ${item?.[DAYS_UNTIL_REQUEST_KEY]}\nОсталось дней до проплаты: ${item?.[DAYS_UNTIL_PAYMENT_KEY]}\n🏂 Следующая проплата: ${getDisplayDateWithDay(item?.[NEXT_DATE_PAYMENT_KEY])}`
    const id = getValidateNumber(item?.[ID_KEY])
    const idPay = PAY_PART_KEY + '_' + id
    const idCancelPay = CANCEL_PAY_PART_KEY + '_' + id
    return {
      [ID_KEY]: id,
      [TEXT_KEY]: text,
      [INLINE_KEYBOARD_KEY]: [
        [
          { [TEXT_KEY]: '➡️ Сделать запрос', [CALLBACK_DATA_KEY]: idPay },
          { [TEXT_KEY]: '❌ Отменить', [CALLBACK_DATA_KEY]: idCancelPay },
        ],
      ],
    }
  })
}

export const getDataMessagePay = (item, id) => {
  const idPaid = PAID_PART_KEY + '_' + id
  const idCancelPaid = CANCEL_PAID_PART_KEY + '_' + id

  return {
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
  }
}

export const getDataMessageEmptyButtons = (item) => {
  return {
    chat_id: item[CHAT_ID_KEY],
    message_id: item[MESSAGE_ID_KEY],
    reply_markup: {
      [INLINE_KEYBOARD_KEY]: [],
    },
  }
}
