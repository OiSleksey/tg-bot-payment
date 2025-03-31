// === 📦 Google Sheets Trigger Endpoint ===
import { allowedUsers } from '../globals/index.js'
import { delaySeconds, getTimeInUkraine } from '../assets/dateFormat.js'
import { sendTelegramMessage } from '../telegram/index.js'
import { repeatSheet } from '../google/index.js'

export default async function googleHandler(req, res) {
  console.log('📥 Запрос от Google Apps Script:', getTimeInUkraine())
  try {
    // for (const chatId of allowedUsers) {
    //   await sendTelegramMessage(
    //     chatId,
    //     `📬 Получен запрос с Google Apps Script в ${getTimeInUkraine()}`,
    //   )
    //   await delaySeconds(1)
    // }
    await repeatSheet()
    res.status(200).json({ message: '✅ Google trigger received!' })

    // res.status(200).json({ message: '✅ Google trigger received!' })
  } catch (err) {
    console.error('❌ Ошибка обработки Google запроса:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}
