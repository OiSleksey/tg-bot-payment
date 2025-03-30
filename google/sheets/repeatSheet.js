import { readSheet } from '../index.js'
import { setSheetData } from '../../local/index.js'
import { getDataByAlertRequest } from '../utils/payData.js'
import { getDataSheetPending } from '../utils/rangeCell.js'
import { updateMultipleSpecificCells } from './updateSheet.js'
import {
  getDataMessagesPending,
  sendTelegramMessage,
} from '../../telegram/index.js'
import { allowedUsers } from '../../globals/index.js'
import { delaySeconds } from '../../assets/dateFormat.js'
import { INLINE_KEYBOARD_KEY, TEXT_KEY } from '../../constants/index.js'

export async function repeatSheet() {
  const sheetData = await readSheet()
  setSheetData(sheetData)
  const dataByAlert = getDataByAlertRequest(sheetData)
  if (!dataByAlert.length) {
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(chatId, `Ближайшие 3 дня нет проплат`)
      await delaySeconds(1)
    }

    return Promise.resolve()
  } else {
    const dataByAlertSheet = getDataSheetPending(dataByAlert)
    const telegramMessages = getDataMessagesPending(dataByAlert)

    // return null
    for (const chatId of allowedUsers) {
      for (const message of telegramMessages) {
        // console.log('chatId', chatId)
        // console.log('message[TEXT_KEY]', message[TEXT_KEY])
        // console.log(
        //   'message[INLINE_KEYBOARD_KEY]',
        //   message[INLINE_KEYBOARD_KEY],
        // )
        await sendTelegramMessage(chatId, message[TEXT_KEY])
        // message[INLINE_KEYBOARD_KEY],
        // await delaySeconds(1)
      }

      // await delaySeconds(1)
    }
    // await updateMultipleSpecificCells(dataByAlertSheet)
    return dataByAlertSheet
  }

  // console.log('📥 Запрос от Google Apps Script:', getTimeInUkraine())
  // try {
  //     for (const chatId of allowedUsers) {
  //         await sendTelegramMessage(
  //             chatId,
  //             `📬 Получен запрос с Google Apps Script в ${getTimeInUkraine()}`,
  //         )
  //         await delaySeconds(1)
  //     }
  //     res.status(200).json({ message: '✅ Google trigger received!' })
  // } catch (err) {
  //     console.error('❌ Ошибка обработки Google запроса:', err)
  //     res.status(500).json({ error: 'Ошибка сервера' })
  // }
}
