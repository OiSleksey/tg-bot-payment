export default async function handler(req, res) {
    console.log('🔥 Webhook вызван');

    const body = req.body;
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const allowedUsers = [6602497931]; // ← Твой Telegram ID (числом)

    const userId = body?.message?.from?.id || body?.callback_query?.from?.id;
    const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id;

    if (!userId || !allowedUsers.includes(userId)) {
        console.log('🚫 Неавторизованный пользователь: ', userId);

        if (chatId) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: '🚫 У вас нет доступа к этому боту.',
                }),
            });
        }

        return res.status(200).send('🚫 Доступ запрещён');
    }

    // 🟢 Приветствие при /start
    if (body.message?.text === '/start') {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: '👋 Привет! Ты в списке разрешённых!',
            }),
        });
    }

    // 🟡 Обработка кнопок (callback_query)
    if (body.callback_query) {
        const data = body.callback_query.data; // напр: "pay_203"
        const [action, id] = data.split('_');
        const user = body.callback_query.from.username || body.callback_query.from.first_name;
        const messageId = body.callback_query.message.message_id;

        console.log(`📌 Действие: ${action}, ID: ${id}, Пользователь: ${user}`);

        // 1. Удалим кнопки (очистим reply_markup)
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                reply_markup: { inline_keyboard: [] },
            }),
        });

        // 2. Отправим сообщение о действии
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: `✔️ Действие "${action}" выполнено для ID: ${id} в ${new Date().toLocaleString('ru-RU')}`,
            }),
        });
    }

    res.status(200).send('ok');
}
