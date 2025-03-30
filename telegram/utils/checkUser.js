import { sendTelegramMessage } from '../index.js'
import { allowedUsers } from '../../globals/index.js'

export async function isAuthorizedUser(userId, chatId, userName) {
  const authorized = userId && allowedUsers.includes(userId)
  if (!authorized && chatId) {
    await sendTelegramMessage(
      chatId,
      `🚫 ${userName || 'Пользователь'} не имеет доступа к этому боту.`,
    )
    console.log('🚫 Неавторизованный пользователь:', userId, userName)
  }
  return authorized
}
