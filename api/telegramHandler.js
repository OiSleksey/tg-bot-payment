import { getTimeInUkraine } from '../assets/dateFormat.js'
import {
  handleInitialCommand,
  handleCallbackQuery,
  handleStartCommand,
  isAuthorizedUser,
} from '../telegram/index.js'
import { handleCheckCommand } from '../telegram/index.js'

export default async function telegramHandler(req, res) {
  console.log('🔥 Webhook вызван в', getTimeInUkraine())
  try {
    const body = req.body
    const userId = body?.message?.from?.id || body?.callback_query?.from?.id
    const chatId =
      body?.message?.chat?.id || body?.callback_query?.message?.chat?.id
    const userName =
      body?.message?.from?.username ||
      body?.message?.from?.first_name ||
      body?.callback_query?.from?.username ||
      body?.callback_query?.from?.first_name

    if (!(await isAuthorizedUser(userId, chatId, userName))) {
      return res.status(200).send('🚫 Доступ запрещён')
    }

    if (body.message?.text === '/start') {
      await handleStartCommand(chatId, userName)
    }

    if (body.message?.text === '/initial') {
      await handleInitialCommand(userName)
    }

    if (body.message?.text === '/check') {
      await handleCheckCommand(userName)
    }

    if (body.callback_query) {
      await handleCallbackQuery(body.callback_query, chatId)
    }

    res.status(200).send('ok')
  } catch (error) {
    console.error('❌ Ошибка основного webhook:', error.message)
    res.status(500).send('Ошибка сервера')
  }
}
