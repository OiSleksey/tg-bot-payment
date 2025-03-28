// === 🤖 Telegram Webhook Handler ===

import telegramHandler from './telegramHandler.js';
import googleHandler from './googleHandler.js';

export default async function handler(req, res) {
    const path = req.url;
console.log(req);
console.log(res);
    if (path === '/api/webhook') {
        return telegramHandler(req, res);
    }

    if (path === '/api/check') {
        return googleHandler(req, res);
    }

    return res.status(404).send('🔍 Not Found');
}
