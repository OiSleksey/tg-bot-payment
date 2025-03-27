import { google } from 'googleapis'
import { readFileSync, writeFileSync } from 'fs'
import XLSX from 'xlsx'

// console.log(JSON.parse(readFileSync('./google-credentials.json', 'utf8')))
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(readFileSync('./google-credentials.json', 'utf8')),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

function columnToLetter(col) {
    let letter = ''
    while (col > 0) {
        let temp = (col - 1) % 26
        letter = String.fromCharCode(temp + 65) + letter
        col = (col - temp - 1) / 26
    }
    return letter
}

async function readSheet() {
    const client = await auth.getClient()
    // console.log(client)
    // return null
    const sheets = google.sheets({ version: 'v4', auth: client })

    const spreadsheetId = '1Nk-25N8GlCTynjx9Vy4te1wVcD1TB3KcHGd3JJROtN4' // без https://
    const range = 'Аркуш1' // можно изменить

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    })

    const rows = res.data.values
    if (!rows || rows.length < 2) {
        console.log('❌ Нет данных')
        return
    }

    const headers = rows[0]
    const data = rows.slice(1).map((row, rowIndex) => {
        const obj = {}
        headers.forEach((key, i) => {
            obj[key] = row[i] ?? null
        })

        obj._sheetMeta = {
            row: rowIndex + 2, // с учётом заголовка
            cols: headers.reduce((acc, key, i) => {
                acc[key] = columnToLetter(i + 1)
                return acc
            }, {})
        }

        return obj
    })


    const output = `export const sheetData = ${JSON.stringify(data, null, 2)}\n`
    writeFileSync('./mock/sheet-data.js', output)

    console.log('✅ Данные сохранены в mock/sheet-data.js')
}

readSheet().catch(console.error)