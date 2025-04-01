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

const getNextPaymentByMonth = ({ lastDatePayment, payRepeat, isRepeat }) => {
  const start = moment(lastDatePayment)
  let nextDate = start.clone()

  // const now = moment().subtract(reminderForDay, 'days')
  const now = moment()
  const offsetPaymentDay = getOffsetPaymentDayByMonth(payRepeat)

  const maxIterations = 240

  let i = 0

  if (payRepeat === EVERY_30_DAYS_TYPE_KEY) {
    while (nextDate.isBefore(now) && i < maxIterations) {
      nextDate = nextDate.clone().add(30, 'days').subtract(0, 'days')
      i++
    }
    if (isRepeat)
      nextDate = nextDate.clone().add(30, 'days').subtract(0, 'days')
  } else {
    while (nextDate.isBefore(now) && i < maxIterations) {
      nextDate = nextDate
        .clone()
        .add(1, 'month')
        .subtract(offsetPaymentDay, 'days')
      i++
    }
    if (isRepeat)
      nextDate = nextDate
        .clone()
        .add(1, 'month')
        .subtract(offsetPaymentDay, 'days')
  }

  const nextDatePayment = nextDate.format()
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
}

const getNextPaymentByYear = ({ lastDatePayment, payRepeat, isRepeat }) => {
  const start = moment(lastDatePayment)
  let nextDate = start.clone()

  const now = moment()
  // const now = moment().subtract(reminderForDay, 'days')
  const offsetPaymentDay = getOffsetPaymentDayByYear(payRepeat)
  const maxIterations = 240

  let i = 0
  while (nextDate.isBefore(now) && i < maxIterations) {
    nextDate = nextDate
      .clone()
      .add(1, 'year')
      .subtract(offsetPaymentDay, 'days')
    i++
  }

  if (isRepeat)
    nextDate = nextDate
      .clone()
      .add(1, 'year')
      .subtract(offsetPaymentDay, 'days')

  const nextDatePayment = nextDate.format()
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

export const getNextPayment = (data, isRepeat = false) => {
  const payRepeat = getValidateString(data?.[PAY_REPEAT_KEY])
    .toLowerCase()
    .trim()

  const everyYear = getIsEveryYear(data, payRepeat)
  const everyMonth = getIsEveryMonth(data, payRepeat)

  const lastDatePayment = getDateByUnknownFormat(data?.[LAST_DATE_PAYMENT_KEY])
  if (!everyYear && !everyMonth) return 'Ничего не выбрано'

  if (!lastDatePayment) return 'Не указана дата начала оплаты'
  if (everyMonth) {
    return getNextPaymentByMonth({
      lastDatePayment,
      payRepeat,
      isRepeat,
    })
  } else {
    return getNextPaymentByYear({
      lastDatePayment,
      payRepeat,
      isRepeat,
    })
  }
}
