import { google } from 'googleapis'
import { readFileSync } from 'fs'

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(readFileSync('./google-credentials.json', 'utf8')),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

async function updateSingleCell() {
    const client = await auth.getClient()
    const sheets = google.sheets({ version: 'v4', auth: client })

    const spreadsheetId = '1Nk-25N8GlCTynjx9Vy4te1wVcD1TB3KcHGd3JJROtN4'
    const range = 'Аркуш1!L5' // 👈 тут указываем нужную ячейку

    const newValue = '✅ Оплачено'

    const res = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[newValue]],
        },
    })

    console.log('✅ Ячейка обновлена:', res.data.updatedRange)
}

updateSingleCell().catch(console.error)