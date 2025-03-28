// === 🤖 Webhook: Telegram + Google Apps Script запросы ===

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const allowedUsers = [6602497931]

async function handleTelegramStart(chatId) {
    await sendTelegramMessage(chatId, '👋 Привет! Ты в списке разрешённых!')

    await sendTelegramMessage(chatId, `💳 Проплата: Wild Hosting\nСумма: €15\nID: 203`, {
        inline_keyboard: [
            [
                { text: '✅ Оплатил', callback_data: 'pay_203' },
                { text: '❌ Отменить', callback_data: 'cancel_203' },
            ],
        ],
    })
}

async function handleTelegramButtonAction(body) {
    const data = body.callback_query.data
    const [action, id] = data.split('_')
    const chatId = body.callback_query.message.chat.id
    const messageId = body.callback_query.message.message_id
    const user = body.callback_query.from.username || body.callback_query.from.first_name

    console.log(`📌 Действие: ${action}, ID: ${id}, Пользователь: ${user}`)

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            reply_markup: { inline_keyboard: [] },
        }),
    })

    await sendTelegramMessage(chatId, `✔️ Действие "${action}" выполнено для ID: ${id} в ${new Date().toLocaleString('ru-RU')}`)
}

async function sendTelegramMessage(chatId, text, reply_markup = null) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            reply_markup,
        }),
    })
}

export default async function handler(req, res) {
    const body = req.body
    const now = new Date().toLocaleString('ru-RU')
    console.log('🔥 Webhook вызван в', now)

    // === Google Apps Script PING ===
    if (!body.message && !body.callback_query) {
        return res.status(200).json({ status: 'ok', message: 'Принято с GAS', time: now })
    }

    // === Telegram ===
    const userId = body?.message?.from?.id || body?.callback_query?.from?.id
    const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id

    if (!userId || !allowedUsers.includes(userId)) {
        console.log('🚫 Неавторизованный пользователь: ', userId)
        if (chatId) {
            await sendTelegramMessage(chatId, '🚫 У вас нет доступа к этому боту.')
        }
        return res.status(200).send('🚫 Доступ запрещён')
    }

    if (body.message?.text === '/start') {
        await handleTelegramStart(chatId)
    }

    if (body.callback_query) {
        await handleTelegramButtonAction(body)
    }

    res.status(200).send('ok')
}
