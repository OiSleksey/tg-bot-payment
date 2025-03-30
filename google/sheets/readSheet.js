import { google } from 'googleapis'
import { ID_KEY } from '../../constants/index.js'
import { readFileSync } from 'fs'
import {
  getValidateNumber,
  getValidateString,
  getValidateObject,
  getValidateArray,
  getValidateBoolean,
} from '../../assets/validateData.js'
import { spreadsheetId, range } from '../../globals/index.js'

let GOOGLE_CREDENTIALS

if (process.env.VERCEL) {
  GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS)
} else {
  const dotenv = await import('dotenv')
  dotenv.config()
  GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS)
}
// console.log(JSON.parse(readFileSync('./google-credentials.json', 'utf8')))
const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

const columnToLetter = (col) => {
  let letter = ''
  while (col > 0) {
    let temp = (col - 1) % 26
    letter = String.fromCharCode(temp + 65) + letter
    col = (col - temp - 1) / 26
  }
  return letter
}

const getSheetDataArray = (rows) => {
  const rowsArray = getValidateArray(rows)

  if (rowsArray.length < 2) {
    console.log('❌ Нет данных "rows"')
    return []
  }

  const headers = rowsArray[0]
  return rowsArray.slice(1).map((row, rowIndex) => {
    const obj = {}
    headers.forEach((key, i) => {
      obj[key] = row[i] ?? null
    })
    obj[ID_KEY] = rowIndex + 2
    obj._sheetMeta = {
      row: rowIndex + 2, // с учётом заголовка
      cols: headers.reduce((acc, key, i) => {
        acc[key] = columnToLetter(i + 1)
        return acc
      }, {}),
    }

    return obj
  })
}

export const readSheet = async () => {
  const client = await auth.getClient()

  const sheets = google.sheets({ version: 'v4', auth: client })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  const rows = res.data.values
  return getSheetDataArray(rows)
}

// readSheet()
//   .then((res) => console.log(res))
//   .catch(console.error)
