import axios from 'axios'
import { allowedUsers } from '../access/index.js'
import { delaySeconds, getTimeInUkraine } from '../assets/dateFormat.js'
import { setInitialDataSheet } from './googleHandler.js'

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS

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

async function handleStartCommand(chatId, user) {
  try {
    await sendTelegramMessage(chatId, `👋 Привет, **${user}**! Ты в списке разрешённых!`)

    await sendTelegramMessage(chatId, `💳 Проплата: Wild Hosting\nСумма: €15\nID: 203`, {
      inline_keyboard: [
        [
          { text: '✅ Оплатил', callback_data: 'pay_203' },
          { text: '❌ Отменить', callback_data: 'cancel_203' },
        ],
      ],
    })
  } catch (error) {
    console.error('❌ Ошибка в команде /start:', error.message)
  }
}

async function handleInitialCommand(user) {
  try {
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(
        chatId,
        `**${user}** Использовал команду "/initial" что бы устоновить изначальные данные по датам проплаты!`,
      )
      await delaySeconds(1)
    }
    await setInitialDataSheet()
    await delaySeconds(1)
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(chatId, `Изначальная установка таблицы прошла успешно`)
      await delaySeconds(1)
    }
    //
    // await sendTelegramMessage(chatId, `💳 Проплата: Wild Hosting\nСумма: €15\nID: 203`, {
    //   inline_keyboard: [
    //     [
    //       { text: '✅ Оплатил', callback_data: 'pay_203' },
    //       { text: '❌ Отменить', callback_data: 'cancel_203' },
    //     ],
    //   ],
    // })
  } catch (error) {
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(chatId, `❌ Ошибка в изначальной установки таблицы`)
    }
    console.error('❌ Ошибка в команде /initial:', error.message)
  }
}

async function isAuthorizedUser(userId, chatId, userName) {
  const authorized = userId && allowedUsers.includes(userId)
  if (!authorized && chatId) {
    await sendTelegramMessage(
      chatId,
      `🚫 ${userName || 'Пользователь'} не имеет доступа к этому боту.`,
    )
    console.log('🚫 Неавторизованный пользователь:', userId, userName)
  }
  return authorized
}

export default async function telegramHandler(req, res) {
  console.log('🔥 Webhook вызван в', getTimeInUkraine())
  try {
    const body = req.body
    const userId = body?.message?.from?.id || body?.callback_query?.from?.id
    const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id
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

    if (body.callback_query) {
      await handleCallbackQuery(body.callback_query, chatId)
    }

    res.status(200).send('ok')
  } catch (error) {
    console.error('❌ Ошибка основного webhook:', error.message)
    res.status(500).send('Ошибка сервера')
  }
}

const setInitialCommand = () => {}

const setNoAuthorizedUser = (chartId) => {}
