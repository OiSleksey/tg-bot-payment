// === 📦 Google Sheets Trigger Endpoint ===

export default async function googleHandler(req, res) {
    console.log('📥 Запрос от Google Apps Script:', new Date().toLocaleString('ru-RU'));

    try {
        // Здесь можно вызывать свою логику: проверку таблицы, отправку в Telegram и т.д.

        // Пример: просто отправим ответ OK
        res.status(200).json({ message: '✅ Google trigger received!' });
    } catch (err) {
        console.error('❌ Ошибка обработки Google запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}