import axios from 'axios'

let TELEGRAM_TOKEN

if (process.env.VERCEL) {
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
} else {
  const dotenv = await import('dotenv')
  dotenv.config()
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
}

export async function sendTelegramMessage(chatId, text, replyMarkup) {
  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text,
        ...(replyMarkup && { reply_markup: replyMarkup }),
      },
    )
    return res.data.result?.message_id
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения:', error.message)
  }
}
