// === 🤖 Telegram Webhook Handler ===

import telegramHandler from '@/utils/telegramHandler';
import googleHandler from '@/utils/googleHandler';

export default async function handler(req, res) {
    const path = req.url;

    if (path === '/api/webhook') {
        return telegramHandler(req, res);
    }

    if (path === '/api/check') {
        return googleHandler(req, res);
    }

    return res.status(404).send('🔍 Not Found');
}
