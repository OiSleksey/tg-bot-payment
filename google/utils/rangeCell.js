import {
  getValidateNumber,
  getValidateString,
} from '../../assets/validateData.js'
import {
  COLS_KEY,
  DAYS_UNTIL_PAYMENT_KEY,
  DAYS_UNTIL_REQUEST_KEY,
  IS_PENDING_KEY,
  NEXT_DATE_PAYMENT_KEY,
  NEXT_DATE_REQUEST_KEY,
  RANGE_KEY,
  ROW_KEY,
  SHEET_META_KEY,
  TRUE_TYPE_KEY,
  VALUES_KEY,
} from '../../constants/index.js'
import { getDisplayDateWithDay } from '../../assets/dateFormat.js'

export const getRangeCell = (item, key) => {
  const row = getValidateNumber(item?.[SHEET_META_KEY]?.[ROW_KEY])
  const col = getValidateString(item?.[SHEET_META_KEY]?.[COLS_KEY]?.[key])
  if (!row || !col) return null
  return col + row
}

export const getFilterDataByRange = (data) => {
  return data.filter((item) => item?.[RANGE_KEY])
}

export const getInitialDataForSheet = (data) => {
  const nextDatePaymentArray = data.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, NEXT_DATE_PAYMENT_KEY),
    [VALUES_KEY]: [[getDisplayDateWithDay(item?.[NEXT_DATE_PAYMENT_KEY])]],
  }))
  const nextDateRequestArray = data.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, NEXT_DATE_REQUEST_KEY),
    [VALUES_KEY]: [[getDisplayDateWithDay(item?.[NEXT_DATE_REQUEST_KEY])]],
  }))
  const daysUntilPaymentArray = data.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, DAYS_UNTIL_PAYMENT_KEY),
    [VALUES_KEY]: [[getValidateNumber(item?.[DAYS_UNTIL_PAYMENT_KEY])]],
  }))
  const daysUntilRequestArray = data.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, DAYS_UNTIL_REQUEST_KEY),
    [VALUES_KEY]: [[getValidateNumber(item?.[DAYS_UNTIL_REQUEST_KEY])]],
  }))
  const isPendingArray = data.map((item) => ({
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

export const getDataSheetPending = (data) => {
  return data.map((item) => ({
    [RANGE_KEY]: getRangeCell(item, IS_PENDING_KEY),
    [VALUES_KEY]: [[TRUE_TYPE_KEY.toUpperCase()]],
  }))
}

// export const get
