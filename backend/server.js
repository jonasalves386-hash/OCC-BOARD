require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const { readOCCData } = require('./services/googleSheetsService');
const { getCache, setCache } = require('./cache/cache');

const app = express();
const PORT = process.env.PORT || 3000;
const TIMEZONE = process.env.TIMEZONE || 'America/New_York';

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

function formatTimestamp() {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date()).replace(',', '');
}

app.get('/api/occ', (req, res) => {
  res.json(getCache());
});

app.post('/api/reload', async (req, res) => {
  try {
    const cards = await readOCCData();
    const updatedAt = formatTimestamp();

    setCache({ updatedAt, cards });

    console.log(`[${updatedAt}] Cache updated — ${cards.length} card(s) loaded`);

    res.json({ success: true, updatedAt });
  } catch (error) {
    console.error('Reload error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`OCC Board running on port ${PORT}`);
});
