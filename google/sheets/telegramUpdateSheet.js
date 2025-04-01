import {
  getRangeCell,
  getSheetDataByCancelPaidClick,
  getSheetDataByCancelPayClick,
  getSheetDataByPaidClick,
  getSheetDataByPayClick,
  readSheet,
  updateMultipleSpecificCells,
} from '../index.js'
import { setSheetData } from '../../local/index.js'
import {
  COMMENTS_KEY,
  DAYS_UNTIL_PAYMENT_KEY,
  DAYS_UNTIL_REQUEST_KEY,
  ID_KEY,
  IS_PENDING_KEY,
  LAST_DATE_PAYMENT_KEY,
  NEXT_DATE_PAYMENT_KEY,
  NEXT_DATE_REQUEST_KEY,
  RANGE_KEY,
  TRUE_TYPE_KEY,
  VALUES_KEY,
} from '../../constants/index.js'
import {
  getValidateNumber,
  getValidateObject,
  getValidateString,
} from '../../assets/validateData.js'
import {
  getDisplayDate,
  getDisplayDateWithDay,
  getNextPayment,
} from '../../assets/dateFormat.js'

export const googleSheetUpdateByPay = async (id, comment) => {
  const sheetData = await readSheet()

  const dataSheetRequest = getSheetDataByPayClick(sheetData, id, comment)
  console.log(dataSheetRequest)
  if (!dataSheetRequest) {
    throw new Error(`❌ Не найден ID ${id} в googleSheetUpdateByPay`)
  } else {
    return await updateMultipleSpecificCells(dataSheetRequest)
  }
}

export const googleSheetUpdateByCancelPay = async (id, comment) => {
  const sheetData = await readSheet()

  const dataSheetRequest = getSheetDataByCancelPayClick(sheetData, id, comment)
  if (!dataSheetRequest) {
    throw new Error(`❌ Не найден ID ${id} в googleSheetUpdateByCancelPay`)
  } else {
    return await updateMultipleSpecificCells(dataSheetRequest)
  }
}

export const googleSheetUpdateByPaid = async (id, comment) => {
  const sheetData = await readSheet()
  const dataSheetRequest = getSheetDataByPaidClick(sheetData, id, comment)
  if (!dataSheetRequest) {
    throw new Error(`❌ Не найден ID ${id} в googleSheetUpdateByCancelPay`)
  } else {
    return await updateMultipleSpecificCells(dataSheetRequest)
  }
}

export const googleSheetUpdateByCancelPaid = async (id, comment) => {
  const sheetData = await readSheet()

  const dataSheetRequest = getSheetDataByCancelPaidClick(sheetData, id, comment)
  if (!dataSheetRequest) {
    throw new Error(`❌ Не найден ID ${id} в googleSheetUpdateByCancelPay`)
  } else {
    return await updateMultipleSpecificCells(dataSheetRequest)
  }
}
