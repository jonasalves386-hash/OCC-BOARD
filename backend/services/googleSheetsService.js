const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME     = process.env.SHEET_NAME;
const START_COLUMN   = 'C';
const END_COLUMN     = 'Z';

async function readOCCData() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${START_COLUMN}:${END_COLUMN}`,
  });

  const rows = response.data.values || [];

  if (rows.length === 0) return [];

  const headers = rows[0];
  const cards = [];

  headers.forEach((header, colIndex) => {
    if (!header || header.trim() === '') return;

    const items = [];

    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const cell = row ? row[colIndex] : undefined;
      if (cell && cell.trim() !== '') {
        items.push(cell.trim());
      }
    }

    cards.push({
      title: header.trim(),
      items,
    });
  });

  return cards;
}

module.exports = { readOCCData };
