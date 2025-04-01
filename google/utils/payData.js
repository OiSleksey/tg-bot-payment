import {
  getValidateArray,
  getValidateNumber,
  getValidateString,
} from '../../assets/validateData.js'
import {
  CANCEL_PAID_TYPE_KEY,
  CANCEL_PAY_TYPE_KEY,
  COMMENTS_KEY,
  DAYS_UNTIL_PAYMENT_KEY,
  DAYS_UNTIL_REQUEST_KEY,
  ID_KEY,
  IS_PENDING_KEY,
  LAST_DATE_PAYMENT_KEY,
  NEXT_DATE_PAYMENT_KEY,
  NEXT_DATE_REQUEST_KEY,
  PAY_KEY,
  RANGE_KEY,
  TRUE_TYPE_KEY,
  VALUES_KEY,
} from '../../constants/index.js'
import {
  getDisplayDate,
  getDisplayDateWithDay,
  getNextDateFormatToLastDate,
  getNextPayment,
} from '../../assets/dateFormat.js'
import { getRangeCell } from './rangeCell.js'
import { updateMultipleSpecificCells } from '../sheets/updateSheet.js'

const getFilteredDataByPay = (data) => {
  const dataArray = getValidateArray(data)
  return dataArray.filter(
    (item) =>
      getValidateString(item?.[PAY_KEY]).trim().toLowerCase() ===
        TRUE_TYPE_KEY &&
      getValidateString(item?.[LAST_DATE_PAYMENT_KEY]).trim(),
  )
}

export const getInitialDataByAllDate = (data) => {
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

export const getDataByAllDate = (data) => {
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
      [NEXT_DATE_PAYMENT_KEY]: nextDatePayment,
      [NEXT_DATE_REQUEST_KEY]: nextDateRequest,
      [DAYS_UNTIL_PAYMENT_KEY]: daysUntilPayment,
      [DAYS_UNTIL_REQUEST_KEY]: daysUntilRequest,
      [LAST_DATE_PAYMENT_KEY]: lastDatePayment,
    }
  })
}

const getLowerCase = (value) => {
  return getValidateString(value).trim().toLowerCase()
}

const getIsPending = (pendingStr) => {
  const pendingLower = getLowerCase(pendingStr)
  if (pendingLower === getLowerCase(TRUE_TYPE_KEY)) return true
  if (pendingLower === getLowerCase(CANCEL_PAY_TYPE_KEY)) return true
  if (pendingLower === getLowerCase(CANCEL_PAID_TYPE_KEY)) return true
  return false
}

export const getDataByAlertRequest = (data) => {
  const dataByAllDate = getDataByAllDate(data)
  return dataByAllDate.filter(
    (item) =>
      item?.[DAYS_UNTIL_PAYMENT_KEY] <= 3 &&
      !getIsPending(item?.[IS_PENDING_KEY]),
  )
}

const getFindIndexClick = (data, id) => {
  return getValidateArray(data).findIndex(
    (item) => getValidateNumber(item?.[ID_KEY]) === getValidateNumber(id),
  )
}

export const getSheetDataByPayClick = (sheetData, id, comment) => {
  const findIndex = getFindIndexClick(sheetData, id)
  if (findIndex !== -1) {
    const currentData = sheetData[findIndex]
    return [
      {
        [RANGE_KEY]: getRangeCell(currentData, COMMENTS_KEY),
        [VALUES_KEY]: [[getValidateString(comment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, IS_PENDING_KEY),
        [VALUES_KEY]: [[TRUE_TYPE_KEY.toUpperCase()]],
      },
    ]
  } else {
    return null
  }
}

export const getSheetDataByCancelPayClick = (sheetData, id, comment) => {
  const findIndex = getFindIndexClick(sheetData, id)
  if (findIndex !== -1) {
    const currentData = sheetData[findIndex]
    return [
      {
        [RANGE_KEY]: getRangeCell(currentData, COMMENTS_KEY),
        [VALUES_KEY]: [[getValidateString(comment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, IS_PENDING_KEY),
        [VALUES_KEY]: [[CANCEL_PAY_TYPE_KEY.toUpperCase()]],
      },
    ]
  } else {
    return null
  }
}

export const getSheetDataByPaidClick = (sheetData, id, comment) => {
  const findIndex = getFindIndexClick(sheetData, id)
  if (findIndex !== -1) {
    const currentData = sheetData[findIndex]
    console.log('BEFORE ', currentData[LAST_DATE_PAYMENT_KEY])
    currentData[LAST_DATE_PAYMENT_KEY] = getNextDateFormatToLastDate(
      currentData[NEXT_DATE_PAYMENT_KEY],
    )
    console.log('AFTER ', currentData[LAST_DATE_PAYMENT_KEY])
    const {
      nextDatePayment,
      daysUntilPayment,
      daysUntilRequest,
      nextDateRequest,
      lastDatePayment,
    } = getNextPayment(currentData, true)
    console.log(
      nextDatePayment,
      daysUntilPayment,
      daysUntilRequest,
      nextDateRequest,
      lastDatePayment,
    )
    return [
      {
        [RANGE_KEY]: getRangeCell(currentData, COMMENTS_KEY),
        [VALUES_KEY]: [[getValidateString(comment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, IS_PENDING_KEY),
        [VALUES_KEY]: [['']],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, LAST_DATE_PAYMENT_KEY),
        [VALUES_KEY]: [[getDisplayDate(lastDatePayment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, NEXT_DATE_PAYMENT_KEY),
        [VALUES_KEY]: [[getDisplayDateWithDay(nextDatePayment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, NEXT_DATE_REQUEST_KEY),
        [VALUES_KEY]: [[getDisplayDateWithDay(nextDateRequest)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, DAYS_UNTIL_PAYMENT_KEY),
        [VALUES_KEY]: [[getValidateNumber(daysUntilPayment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, DAYS_UNTIL_REQUEST_KEY),
        [VALUES_KEY]: [[getValidateNumber(daysUntilRequest)]],
      },
    ]
  } else {
    return null
  }
}

export const getSheetDataByCancelPaidClick = (sheetData, id, comment) => {
  const findIndex = getFindIndexClick(sheetData, id)
  if (findIndex !== -1) {
    const currentData = sheetData[findIndex]
    return [
      {
        [RANGE_KEY]: getRangeCell(currentData, COMMENTS_KEY),
        [VALUES_KEY]: [[getValidateString(comment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, IS_PENDING_KEY),
        [VALUES_KEY]: [[CANCEL_PAID_TYPE_KEY.toUpperCase()]],
      },
    ]
  } else {
    return null
  }
}
