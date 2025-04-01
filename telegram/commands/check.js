import { getTimeInUkraine } from '../../assets/dateFormat.js'
import { repeatSheet } from '../../google/index.js'
import { allowedUsers } from '../../globals/index.js'
import { sendTelegramMessage } from '../utils/sendTelegram.js'

export async function handleCheckCommand(userName) {
  console.log('📥 Запрос от Google Apps Script:', getTimeInUkraine())
  try {
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(
        chatId,
        `**${userName}** Использовал команду "/check" для запроса данных с таблицы`,
      )
    }
    await repeatSheet()
  } catch (err) {
    console.error('❌ Ошибка обработки Google запроса:', err)
  }
}
