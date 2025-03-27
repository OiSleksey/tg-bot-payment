export default async function handler(req, res) {
    console.log('🔥 Webhook вызван');

    const body = req.body;
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const allowedUsers = [6602497931]; // ← Твой Telegram ID (числом)

    const userId = body?.message?.from?.id || body?.callback_query?.from?.id;
    const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id;

    if (!userId || !allowedUsers.includes(userId)) {
        console.log('🚫 Неавторизованный пользователь: ', userId);

        // Отправим ответ в Telegram (если есть chatId)
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

    res.status(200).send('ok');
}