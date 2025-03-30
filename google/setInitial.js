import { readSheet } from './index.js'
import { getInitialDataForSheet } from '../assets/filteredData.js'
import { updateMultipleSpecificCells } from './index.js'
import { getSheetData } from '../local/index.js'

export const setInitialDataSheet = async () => {
  await readSheet()
  const sheetData = getSheetData()
  const dataRequest = getInitialDataForSheet(sheetData)
  return await updateMultipleSpecificCells(dataRequest)
}
