import { getInitialDataForSheet } from './assets/filteredData.js'
// import { updateMultipleSpecificCells } from './api/updateCellSheet.js'
import { sheetData } from './mock/sheet-data.js'

const setInitialDataSheet = () => {
  console.log('asdasd')
  // return null
  const dataRequest = getInitialDataForSheet(sheetData)
  // console.log('setInitialDataSheet', dataRequest)
  return null
  // updateMultipleSpecificCells(dataRequest)
  //   .then((res) => console.log(res))
  //   .catch((err) => console.error(err))
}

setInitialDataSheet()
