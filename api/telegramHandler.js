// === 🤖 Telegram Handler ===
import axios from 'axios';
import {allowedUsers} from "../access/index.js";
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

async function sendTelegramMessage(chatId, text, replyMarkup) {
    // await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         chat_id: chatId,
    //         text,
    //         ...(replyMarkup && { reply_markup: replyMarkup }),
    //     }),
    // });
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text,
        ...(replyMarkup && { reply_markup: replyMarkup }),
    });
}

async function handleCallbackQuery(callbackQuery, chatId) {
    const data = callbackQuery.data;
    const [action, id] = data.split('_');
    const user = callbackQuery.from.username || callbackQuery.from.first_name;
    const messageId = callbackQuery.message.message_id;

    console.log(`📌 Действие: ${action}, ID: ${id}, Пользователь: ${user}`);

    // await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         chat_id: chatId,
    //         message_id: messageId,
    //         reply_markup: { inline_keyboard: [] },
    //     }),
    // });


    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: [] },
    });

    
    await sendTelegramMessage(chatId, `✔️ Действие "${action}" выполнено для ID: ${id} в ${new Date().toLocaleString('ru-RU')}`);
}

export default async function telegramHandler(req, res) {
    console.log('🔥 Webhook вызван в', new Date().toLocaleString('ru-RU'));

    const body = req.body;
    const userId = body?.message?.from?.id || body?.callback_query?.from?.id;
    const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id;

    if (!userId || !allowedUsers.includes(userId)) {
        console.log('🚫 Неавторизованный пользователь:', userId);
        if (chatId) {
            await sendTelegramMessage(chatId, '🚫 У вас нет доступа к этому боту.');
        }
        return res.status(200).send('🚫 Доступ запрещён');
    }

    if (body.message?.text === '/start') {
        await sendTelegramMessage(chatId, '👋 Привет! Ты в списке разрешённых!');

        await sendTelegramMessage(chatId, `💳 Проплата: Wild Hosting\nСумма: €15\nID: 203`, {
            inline_keyboard: [
                [
                    { text: '✅ Оплатил', callback_data: 'pay_203' },
                    { text: '❌ Отменить', callback_data: 'cancel_203' },
                ],
            ],
        });
    }

    if (body.callback_query) {
        await handleCallbackQuery(body.callback_query, chatId);
    }

    res.status(200).send('ok');
}