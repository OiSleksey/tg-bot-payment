// === 📦 Google Sheets Trigger Endpoint ===

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const chatId =  '6602497931';

const sendMessageTelegram = async (res) => {

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: `📬 Получен запрос с Google Apps Script в ${new Date().toLocaleString('ru-RU')}`
        })
    });

    return res.status(200).send('✅ Вызов с Google Apps Script получен');
}


export default async function googleHandler(req, res) {
    console.log('📥 Запрос от Google Apps Script:', new Date().toLocaleString('ru-RU'));

    try {
        // Здесь можно вызывать свою логику: проверку таблицы, отправку в Telegram и т.д.

        // Пример: просто отправим ответ OK
        await sendMessageTelegram(res)
        res.status(200).json({ message: '✅ Google trigger received!' });
    } catch (err) {
        console.error('❌ Ошибка обработки Google запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}