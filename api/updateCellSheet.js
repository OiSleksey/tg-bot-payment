import { google } from 'googleapis'
import { readFileSync } from 'fs'
import { spreadsheetId, range } from '../access/index.js'

const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

async function updateSingleCell() {
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth: client })

  const rangeSingle = range + '!L5' // 👈 тут указываем нужную ячейку

  const newValue = '✅ Оплачено'

  const res = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: rangeSingle,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newValue]],
    },
  })

  console.log('✅ Ячейка обновлена:', res.data.updatedRange)
}

// export async function updateMultipleSpecificCells(requests) {
//   const client = await auth.getClient()
//   const sheets = google.sheets({ version: 'v4', auth: client })
//
//   for (const req of requests) {
//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: req.range,
//       valueInputOption: 'USER_ENTERED',
//       requestBody: {
//         values: req.values,
//       },
//     })
//
//     console.log(`✅ Обновлено: ${req.range}`)
//   }
// }

export async function updateMultipleSpecificCells(requests) {
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth: client })

  const data = requests.map(({ range, values }) => ({ range, values }))

  // console.log(data)
  // return null
  const res = await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: requests,
    },
  })

  console.log('✅ Обновлены диапазоны:', res?.data?.totalUpdatedRanges)
}

// updateSingleCell().catch(console.error)
