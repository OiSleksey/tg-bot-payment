import { readSheet } from '../index.js'
import { updateMultipleSpecificCells } from '../index.js'
import { setSheetData } from '../../local/index.js'
import { getInitialDataByAllDate, getInitialDataForSheet } from '../index.js'

export const setInitialDataSheet = async () => {
  const sheetData = await readSheet()
  setSheetData(sheetData)
  const initialDataByPay = getInitialDataByAllDate(sheetData)
  const dataRequest = getInitialDataForSheet(initialDataByPay)
  return await updateMultipleSpecificCells(dataRequest)
}
