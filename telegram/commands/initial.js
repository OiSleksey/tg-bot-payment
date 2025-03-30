import { sendTelegramMessage } from '../index.js'
import { delaySeconds } from '../../assets/dateFormat.js'
import { setInitialDataSheet } from '../../google/index.js'
import { allowedUsers } from '../../globals/index.js'

export async function handleInitialCommand(user) {
  try {
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(
        chatId,
        `**${user}** Использовал команду "/initial" что бы устоновить изначальные данные по датам проплаты!`,
      )
      await delaySeconds(1)
    }
    await setInitialDataSheet()
    await delaySeconds(1)
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(chatId, `Изначальная установка таблицы прошла успешно`)
      await delaySeconds(1)
    }
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
    for (const chatId of allowedUsers) {
      await sendTelegramMessage(chatId, `❌ Ошибка в изначальной установки таблицы`)
    }
    console.error('❌ Ошибка в команде /initial:', error.message)
  }
}
