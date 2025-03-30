import {
  getValidateArray,
  getValidateString,
} from '../../assets/validateData.js'
import {
  DAYS_UNTIL_PAYMENT_KEY,
  DAYS_UNTIL_REQUEST_KEY,
  IS_PENDING_KEY,
  LAST_DATE_PAYMENT_KEY,
  NEXT_DATE_PAYMENT_KEY,
  NEXT_DATE_REQUEST_KEY,
  PAY_KEY,
  RANGE_KEY,
  TRUE_TYPE_KEY,
  VALUES_KEY,
} from '../../constants/index.js'
import { getNextPayment } from '../../assets/dateFormat.js'

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

export const getDataByAlertRequest = (data) => {
  const dataByAllDate = getDataByAllDate(data)
  return dataByAllDate.filter(
    (item) =>
      item?.[DAYS_UNTIL_PAYMENT_KEY] <= 3 &&
      getValidateString(item?.[IS_PENDING_KEY]).trim().toLowerCase() !==
        getValidateString(TRUE_TYPE_KEY).trim().toLowerCase(),
  )
}
