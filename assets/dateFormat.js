import moment from 'moment-timezone'
import {
  BY_REQUEST_TYPE_KEY,
  EVERY_30_DAYS_TYPE_KEY,
  EVERY_MONTH_D1_TYPE_KEY,
  EVERY_MONTH_D2_TYPE_KEY,
  EVERY_MONTH_I1_TYPE_KEY,
  EVERY_MONTH_I2_TYPE_KEY,
  EVERY_MONTH_TYPE_KEY,
  EVERY_YEAR_D1_TYPE_KEY,
  EVERY_YEAR_D2_TYPE_KEY,
  EVERY_YEAR_I1_TYPE_KEY,
  EVERY_YEAR_I2_TYPE_KEY,
  EVERY_YEAR_TYPE_KEY,
  PAY_REPEAT_KEY,
  LAST_DATE_PAYMENT_KEY,
  EVERY_6_MONTH_TYPE_KEY,
} from '../constants/index.js'
import { daysPayment } from '../globals/index.js'

import {
  getValidateArray,
  getValidateString,
  getValidateBoolean,
  getValidateObject,
  getValidateNumber,
} from './validateData.js'

export const getDisplayDateWithDay = (date) => {
  if (!date) return '-'
  return moment(date).tz('Europe/Kyiv').format('DD-MM-YYYY, dddd')
}

export const getDisplayDate = (date) => {
  if (!date) return '-'
  return moment(date).tz('Europe/Kyiv').format('DD-MM-YYYY')
}

export const getTimeInUkraine = () => {
  return moment().tz('Europe/Kyiv').format('DD.MM.YYYY, HH:mm:ss')
}

export const delaySeconds = (second) => {
  return new Promise((resolve) =>
    setTimeout(resolve, getValidateNumber(second) * 1000),
  )
}

const getClosestValidDate = (dateStr) => {
  let date = moment(dateStr)
  while (!daysPayment.includes(date.day())) {
    date = date.subtract(1, 'day')
  }
  return date.format()
}

const getDaysFromToday = (dateStr) => {
  const target = moment(dateStr)
  const today = moment()
  return target.diff(today, 'days')
}

const getOffsetPaymentDayByMonth = (payRepeat) => {
  switch (payRepeat) {
    case EVERY_30_DAYS_TYPE_KEY:
      return 0
    case EVERY_MONTH_TYPE_KEY:
      return 0
    case EVERY_MONTH_D1_TYPE_KEY:
      return -1
    case EVERY_MONTH_I1_TYPE_KEY:
      return 1
    case EVERY_MONTH_D2_TYPE_KEY:
      return -2
    case EVERY_MONTH_I2_TYPE_KEY:
      return 2
    default:
      return 0
  }
}

const getOffsetPaymentDayByYear = (payRepeat) => {
  switch (payRepeat) {
    case EVERY_YEAR_TYPE_KEY:
      return 0
    case EVERY_YEAR_D1_TYPE_KEY:
      return -1
    case EVERY_YEAR_I1_TYPE_KEY:
      return 1
    case EVERY_YEAR_D2_TYPE_KEY:
      return -2
    case BY_REQUEST_TYPE_KEY:
      return 2
    default:
      return 0
  }
}

const getNextPaymentByMonth = ({ lastDatePayment, payRepeat }) => {
  const start = moment(lastDatePayment)
  let nextDate = start.clone()

  const offsetPaymentDay = getOffsetPaymentDayByMonth(payRepeat)

  if (payRepeat === EVERY_30_DAYS_TYPE_KEY) {
    nextDate = nextDate.clone().add(30, 'days').subtract(0, 'days')
  } else if (payRepeat === EVERY_6_MONTH_TYPE_KEY) {
    nextDate = nextDate
      .clone()
      .add(6, 'month')
      .subtract(offsetPaymentDay, 'days')
  } else {
    nextDate = nextDate
      .clone()
      .add(1, 'month')
      .subtract(offsetPaymentDay, 'days')
  }

  return nextDate.format()
}

const getNextPaymentByYear = ({ lastDatePayment, payRepeat }) => {
  const start = moment(lastDatePayment)
  let nextDate = start.clone()
  const offsetPaymentDay = getOffsetPaymentDayByYear(payRepeat)

  nextDate = nextDate.clone().add(1, 'year').subtract(offsetPaymentDay, 'days')

  return nextDate.format()
}

const getIsEveryYear = (data, payRepeat) => {
  switch (payRepeat) {
    case EVERY_YEAR_TYPE_KEY:
      return true
    case EVERY_YEAR_D1_TYPE_KEY:
      return true
    case EVERY_YEAR_I1_TYPE_KEY:
      return true
    case EVERY_YEAR_D2_TYPE_KEY:
      return true
    case EVERY_YEAR_I2_TYPE_KEY:
      return true
    default:
      return false
  }
}

const getIsEveryMonth = (data, payRepeat) => {
  switch (payRepeat) {
    case EVERY_30_DAYS_TYPE_KEY:
      return true
    case EVERY_MONTH_TYPE_KEY:
      return true
    case EVERY_MONTH_D1_TYPE_KEY:
      return true
    case EVERY_MONTH_I1_TYPE_KEY:
      return true
    case EVERY_MONTH_D2_TYPE_KEY:
      return true
    case EVERY_MONTH_I2_TYPE_KEY:
      return true
    case EVERY_6_MONTH_TYPE_KEY:
      return true
    default:
      return false
  }
}

export const getDateByUnknownFormat = (date) => {
  if (!date) return null

  const formats = [
    'DD-MM-YYYY',
    'DD.MM.YYYY',
    'DD-MM-YY',
    'DD.MM.YY',
    'YYYY-MM-DD',
    'YYYY.MM.DD',
    'D-M-YYYY',
    'D.M.YYYY',
    'D-M-YY',
    'D.M.YY',
    'DD/MM/YYYY',
    'DD/MM/YY',
    'YYYY/MM/DD',
  ]

  const parsed = moment(date, formats, true)

  return parsed.isValid() ? parsed.format() : null
}

export const getNextDateFormatToLastDate = (date) => {
  return moment(date.split(',')[0], 'DD-MM-YYYY').format('DD-MM-YYYY')
}

export const getNextPayment = (data) => {
  const payRepeat = getValidateString(data?.[PAY_REPEAT_KEY])
    .toLowerCase()
    .trim()

  const everyYear = getIsEveryYear(data, payRepeat)
  const everyMonth = getIsEveryMonth(data, payRepeat)

  const lastDatePayment = getDateByUnknownFormat(data?.[LAST_DATE_PAYMENT_KEY])
  if (!everyYear && !everyMonth) return 'Ничего не выбрано'

  if (!lastDatePayment) return 'Не указана дата начала оплаты'
  let nextDatePayment = ''
  if (everyMonth) {
    nextDatePayment = getNextPaymentByMonth({
      lastDatePayment,
      payRepeat,
    })
  } else {
    nextDatePayment = getNextPaymentByYear({
      lastDatePayment,
      payRepeat,
    })
  }

  const daysUntilPayment = getDaysFromToday(nextDatePayment)
  const nextDateRequest = getClosestValidDate(nextDatePayment)
  const daysUntilRequest = getDaysFromToday(nextDateRequest)

  return {
    lastDatePayment,
    nextDatePayment,
    nextDateRequest,
    daysUntilPayment,
    daysUntilRequest,
  }

  //
  // if (everyMonth) {
  //   return getNextPaymentByMonth({
  //     lastDatePayment,
  //     payRepeat,
  //     isNext,
  //   })
  // } else {
  //   return getNextPaymentByYear({
  //     lastDatePayment,
  //     payRepeat,
  //     isNext,
  //   })
  // }
}
