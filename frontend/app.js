const API_URL          = '/api/occ';
const REFRESH_INTERVAL = 60_000;

const DAYS   = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
                'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

/* ─── CLOCK ──────────────────────────────────────────────────────── */

function updateClock() {
  const now = new Date();

  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock-time').textContent = `${h}:${m}`;

  const day   = DAYS[now.getDay()];
  const d     = String(now.getDate()).padStart(2, '0');
  const month = MONTHS[now.getMonth()];
  const year  = now.getFullYear();
  document.getElementById('clock-date').textContent = `${day}, ${d} ${month} ${year}`;
}

/* ─── TIMESTAMP ──────────────────────────────────────────────────── */

function setTimestamp(value) {
  const el = document.getElementById('timestamp');
  if (value) {
    el.textContent = value;
    el.className   = 'update-value';
  } else {
    el.textContent = 'Aguardando publicação';
    el.className   = 'update-value pending';
  }
}

/* ─── SECURITY ───────────────────────────────────────────────────── */

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

/* ─── RENDER ─────────────────────────────────────────────────────── */

function renderCards(cards) {
  const grid = document.getElementById('cards-grid');

  if (!cards || cards.length === 0) {
    grid.innerHTML = `
      <div class="state-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
        <p>Nenhum dado disponível</p>
        <span>Pressione "Publicar" na planilha para exibir as informações.</span>
      </div>
    `;
    return;
  }

  grid.innerHTML = cards.map(card => {
    const items = card.items.length > 0
      ? card.items.map(i => `<div class="card-item">${escapeHtml(i)}</div>`).join('')
      : '<div class="card-empty">Sem informações</div>';

    return `
      <div class="card">
        <div class="card-header">
          <div class="card-indicator"></div>
          <div class="card-location">${escapeHtml(card.title)}</div>
        </div>
        <div class="card-body">${items}</div>
      </div>
    `;
  }).join('');
}

/* ─── FETCH ──────────────────────────────────────────────────────── */

async function fetchData() {
  try {
    const res  = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setTimestamp(data.updatedAt);
    renderCards(data.cards || []);
  } catch (err) {
    console.error('[OCC Board] fetch error:', err.message);
  }
}

/* ─── INIT ───────────────────────────────────────────────────────── */

updateClock();
fetchData();

setInterval(updateClock, 1000);
setInterval(fetchData, REFRESH_INTERVAL);
