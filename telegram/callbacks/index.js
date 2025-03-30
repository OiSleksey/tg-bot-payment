import axios from 'axios'
import { sendTelegramMessage } from '../index.js'
import { getTimeInUkraine } from '../../assets/dateFormat.js'

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN

export async function handleCallbackQuery(callbackQuery, chatId) {
  try {
    const data = callbackQuery.data
    const [action, id] = data.split('_')
    const user = callbackQuery.from.username || callbackQuery.from.first_name
    const messageId = callbackQuery.message.message_id

    console.log(`📌 Действие: ${action}, ID: ${id}, Пользователь: ${user}`)

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] },
    })

    await sendTelegramMessage(
      chatId,
      `✔️ Действие "${action}" выполнено для ID: ${id} пользователем ${user} в ${getTimeInUkraine()}`,
    )
  } catch (error) {
    console.error('❌ Ошибка обработки callbackQuery:', error.message)
  }
}
