import {
  CALLBACK_DATA_KEY,
  CANCEL_PART_KEY,
  COST_KEY,
  DAYS_UNTIL_PAYMENT_KEY,
  DAYS_UNTIL_REQUEST_KEY,
  ID_KEY,
  INLINE_KEYBOARD_KEY,
  LOGIN_KEY,
  NAME_KEY,
  PAY_PART_KEY,
  TEXT_KEY,
} from '../../constants/index.js'
import { getValidateNumber } from '../../assets/validateData.js'

// `💳 Проплата: Wild Hosting\nСумма: €15\nID: 203`, {
//   inline_keyboard: [
//     [
//       { text: '✅ Оплатил', callback_data: 'pay_203' },
//       { text: '❌ Отменить', callback_data: 'cancel_203' },
//     ],
//   ],

export const getDataMessagesPending = (data) => {
  return data.map((item) => {
    const text = `💳 Проплата: ${item?.[NAME_KEY]}\nСумма: ${item?.[COST_KEY]}\nЛогин: ${item?.[LOGIN_KEY]}\nОсталось дней до запроса: ${item?.[DAYS_UNTIL_REQUEST_KEY]}\nОсталось дней до проплаты: ${item?.[DAYS_UNTIL_PAYMENT_KEY]}`
    const idSuccess = PAY_PART_KEY + getValidateNumber(item?.[ID_KEY])
    const idCancel = CANCEL_PART_KEY + getValidateNumber(item?.[ID_KEY])
    return {
      [TEXT_KEY]: text,
      [INLINE_KEYBOARD_KEY]: [
        [
          { [TEXT_KEY]: '✅ Оплатить', [CALLBACK_DATA_KEY]: idSuccess },
          { [TEXT_KEY]: '❌ Отменить', [CALLBACK_DATA_KEY]: idCancel },
        ],
      ],
    }
  })
}
