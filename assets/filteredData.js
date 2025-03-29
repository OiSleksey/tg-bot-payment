// import { sheetData } from '../mock/sheet-data.js'
import { getValidateArray, getValidateNumber, getValidateString } from './valaidateData.js'
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
