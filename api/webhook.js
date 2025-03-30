// === 🤖 Telegram Webhook Handler ===

import telegramHandler from './telegramHandler.js'
import googleHandler from './googleHandler.js'

export default async function handler(req, res) {
  const path = req.url

  if (path === '/webhook') {
    return telegramHandler(req, res)
  }

  if (path === '/check') {
    return googleHandler(req, res)
  }

  return res.status(404).send('🔍 Not Found')
}
