import { google } from 'googleapis'
import { readFileSync, writeFileSync } from 'fs'
import { ID_KEY } from '../constants/index.js'
import {
  getValidateNumber,
  getValidateString,
  getValidateObject,
  getValidateArray,
  getValidateBoolean,
} from '../assets/valaidateData.js'
import { spreadsheetId, range } from '../access/index.js'
import XLSX from 'xlsx'
const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS

// console.log(JSON.parse(readFileSync('./google-credentials.json', 'utf8')))
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(GOOGLE_CREDENTIALS),
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

  const data = getSheetDataArray(rows)

  // const output = `export const sheetData = ${JSON.stringify(data, null, 2)}\n`
  // writeFileSync('./mock/sheet-data.js', output)
  //
  // console.log('✅ Данные сохранены в mock/sheet-data.js')
  return data
}

// readSheet()
//   .then((res) => console.log(res))
//   .catch(console.error)
