import axios from 'axios'

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN

export async function sendTelegramMessage(chatId, text, replyMarkup) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text,
      ...(replyMarkup && { reply_markup: replyMarkup }),
    })
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения:', error.message)
  }
}
