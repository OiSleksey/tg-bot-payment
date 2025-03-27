import { google } from 'googleapis';
import { readFileSync } from 'fs';

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(readFileSync('./google-credentials.json', 'utf8')),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function getSheetData() {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1Nk-25N8GlCTynjx9Vy4te1wVcD1TB3KcHGd3JJROtN4';
    const range = 'Лист1!A1:E10'; // Настрой под нужный диапазон

    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    console.log('1 ', res);
    console.log('2', res.data.values);
    return res.data.values;
}