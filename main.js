import {
  getDataByAlertRequest,
  getDataSheetPending,
  repeatSheet,
} from './google/index.js'
import { INLINE_KEYBOARD_KEY, VALUES_KEY } from './constants/index.js'
import { getSheetData } from './local/index.js'
import { getDataMessagesPending } from './telegram/index.js'

// const setAlertData = () => {
//   const sheetData = getSheetData()
//   const dataByAlert = getDataByAlertRequest(sheetData)
//   if (!dataByAlert.length) return null
//   const dataSheet = getDataSheetPending(dataByAlert)
//   console.log('Set Is_Pending Sheet ', dataSheet[0][VALUES_KEY])
//   const dataMessages = getDataMessagesPending(dataByAlert)
//   console.log(
//     'send messages in telegram ',
//     dataMessages[0][INLINE_KEYBOARD_KEY][0],
//   )
// }

repeatSheet()
