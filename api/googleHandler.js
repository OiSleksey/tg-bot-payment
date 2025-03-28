// === 📦 Google Sheets Trigger Endpoint ===
import {allowedUsers} from "../access/index.js";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const sendMessageTelegram = async (res) => {
    try{
        for(const chatId of allowedUsers) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `📬 Получен запрос с Google Apps Script в ${new Date().toLocaleString('ru-RU')}`
                })
            });
        }
    } catch (e){
        console.error(e);
    }

    // return res.status(200).send('✅ Вызов с Google Apps Script получен');
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