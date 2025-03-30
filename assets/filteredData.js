import { getValidateArray, getValidateNumber, getValidateString } from './validateData.js'
import {
  DAYS_UNTIL_PAYMENT_KEY,
  DAYS_UNTIL_REQUEST_KEY,
  IS_PENDING_KEY,
  LAST_DATE_PAYMENT_KEY,
  NEXT_DATE_PAYMENT_KEY,
  NEXT_DATE_REQUEST_KEY,
  PAY_KEY,
  TRUE_TYPE_KEY,
  RANGE_KEY,
  VALUES_KEY,
  ROW_KEY,
  SHEET_META_KEY,
  COLS_KEY,
  NAME_KEY,
  COST_KEY,
  LOGIN_KEY,
  ID_KEY,
  PAY_PART_KEY,
  TEXT_KEY,
  INLINE_KEYBOARD_KEY,
  CALLBACK_DATA_KEY,
  CANCEL_PART_KEY,
} from '../constants/index.js'
import { getNextPayment, getTimeInUkraine, getDisplayDateWithDay } from './dateFormat.js'

const getFilteredDataByPay = (data) => {
  const dataArray = getValidateArray(data)
  return dataArray.filter(
    (item) =>
      getValidateString(item?.[PAY_KEY]).trim().toLowerCase() === TRUE_TYPE_KEY &&
      getValidateString(item?.[LAST_DATE_PAYMENT_KEY]).trim(),
  )
}

const getDataByAllDate = (data) => {
  const filteredDataByPay = getFilteredDataByPay(data)
  return filteredDataByPay.map((item) => {
    const {
      nextDatePayment,
      daysUntilPayment,
      daysUntilRequest,
      nextDateRequest,
      lastDatePayment,
    } = getNextPayment(item)
    // console.log('nextDatePayment ', item[NAME_KEY])
    // console.log('nextDatePayment ', nextDatePayment)
    // console.log('daysUntilPayment ', daysUntilPayment)
    // console.log('nextDateRequest ', nextDateRequest)
    // console.log('lastDatePayment ', lastDatePayment)

    return {
      ...item,
      [IS_PENDING_KEY]: '',
      [NEXT_DATE_PAYMENT_KEY]: nextDatePayment,
      [NEXT_DATE_REQUEST_KEY]: nextDateRequest,
      [DAYS_UNTIL_PAYMENT_KEY]: daysUntilPayment,
      [DAYS_UNTIL_REQUEST_KEY]: daysUntilRequest,
      [LAST_DATE_PAYMENT_KEY]: lastDatePayment,
    }
  })
}

// const dataByAllDate = getDataByAllDate(sheetData)
//
// console.log(dataByAllDate)
// console.log(getTimeInUkraine())
// console.log(dataByAllDate.length)

const getRangeCell = (item, key) => {
  const row = getValidateNumber(item?.[SHEET_META_KEY]?.[ROW_KEY])
  const col = getValidateString(item?.[SHEET_META_KEY]?.[COLS_KEY]?.[key])
  if (!row || !col) return null
  return col + row
}

const getFilterDataByRange = (data) => {
  return data.filter((item) => item?.[RANGE_KEY])
}

export const getInitialDataForSheet = (data) => {
  const dataByAllDate = getDataByAllDate(data)
  const nextDatePaymentArray = dataByAllDate.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, NEXT_DATE_PAYMENT_KEY),
    [VALUES_KEY]: [[getDisplayDateWithDay(item?.[NEXT_DATE_PAYMENT_KEY])]],
  }))
  const nextDateRequestArray = dataByAllDate.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, NEXT_DATE_REQUEST_KEY),
    [VALUES_KEY]: [[getDisplayDateWithDay(item?.[NEXT_DATE_REQUEST_KEY])]],
  }))
  const daysUntilPaymentArray = dataByAllDate.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, DAYS_UNTIL_PAYMENT_KEY),
    [VALUES_KEY]: [[getValidateNumber(item?.[DAYS_UNTIL_PAYMENT_KEY])]],
  }))
  const daysUntilRequestArray = dataByAllDate.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, DAYS_UNTIL_REQUEST_KEY),
    [VALUES_KEY]: [[getValidateNumber(item?.[DAYS_UNTIL_REQUEST_KEY])]],
  }))
  const isPendingArray = dataByAllDate.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, IS_PENDING_KEY),
    [VALUES_KEY]: [['']],
  }))
  // console.log(daysUntilPaymentArray.map((item) => item[VALUES_KEY]))
  const fullData = [
    ...nextDatePaymentArray,
    ...nextDateRequestArray,
    ...daysUntilPaymentArray,
    ...daysUntilRequestArray,
    ...isPendingArray,
  ]
  return getFilterDataByRange(fullData)
}

export const getDataByAlertRequest = (data) => {
  const dataByAllDate = getDataByAllDate(data)
  console.log(dataByAllDate[0])
  const dataForRemainingThreeDays = dataByAllDate.filter(
    (item) => item?.[DAYS_UNTIL_PAYMENT_KEY] <= 3 && item?.[IS_PENDING_KEY] !== TRUE_TYPE_KEY,
  )
  return dataForRemainingThreeDays
  console.log(dataForRemainingThreeDays)
  console.log(dataForRemainingThreeDays.length)
}

export const getDataSheetPending = (data) => {
  return data.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, IS_PENDING_KEY),
    [VALUES_KEY]: [[TRUE_TYPE_KEY.toUpperCase()]],
  }))
}

// `💳 Проплата: Wild Hosting\nСумма: €15\nID: 203`, {
//   inline_keyboard: [
//     [
//       { text: '✅ Оплатил', callback_data: 'pay_203' },
//       { text: '❌ Отменить', callback_data: 'cancel_203' },
//     ],
//   ],

export const getDataMessagesPending = (data) => {
  return data.map((item) => {
    const text = `💳 Проплата: ${item?.[NAME_KEY]}
    \nСумма:${item?.[COST_KEY]}
    \nЛогин:${item?.[LOGIN_KEY]}
    \nОсталось дней до запроса:${item?.[DAYS_UNTIL_REQUEST_KEY]}
    \nОсталось дней до проплаты:${item?.[DAYS_UNTIL_PAYMENT_KEY]}`
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
