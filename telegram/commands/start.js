import { sendTelegramMessage } from '../index.js'

export async function handleStartCommand(chatId, user) {
  try {
    await sendTelegramMessage(
      chatId,
      `👋 Привет, **${user}**! Ты в списке разрешённых!`,
    )
    //
    // await sendTelegramMessage(chatId, `💳 Проплата: Wild Hosting\nСумма: €15\nID: 203`, {
    //   inline_keyboard: [
    //     [
    //       { text: '✅ Оплатил', callback_data: 'pay_203' },
    //       { text: '❌ Отменить', callback_data: 'cancel_203' },
    //     ],
    //   ],
    // })
  } catch (error) {
    console.error('❌ Ошибка в команде /start:', error.message)
  }
}
