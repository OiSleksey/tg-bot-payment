import { getInitialDataForSheet } from './assets/filteredData.js'
import { updateMultipleSpecificCells } from './api/updateCellSheet.js'

const setInitialDataSheet = () => {
  const dataRequest = getInitialDataForSheet()
  // console.log('setInitialDataSheet', dataRequest)
  // return null
  updateMultipleSpecificCells(dataRequest)
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
}
