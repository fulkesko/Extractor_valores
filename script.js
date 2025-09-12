// ===== Utilidades =====
const stripAccents = (s = '') => s.normalize('NFD').replace(/\p{Diacritic}+/gu, '');
const norm = (s = '') => stripAccents(s).replace(/\s+/g, ' ').trim().toLowerCase();
const RESULT_RE = /resultado\s*final[\s\S]*?(\d{1,3}(?:[.,]\d+)?)\s*%/i;
const TIME_RE = /\btiempo\b[^\d]*([0-9]{1,2}:[0-9]{2}(?::[0-9]{2})?)/i;
const extractTime = (text='') => {
  const m = text.match(TIME_RE);
  return m ? m[1] : null; 
};

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}

// ===== Columnas por perfil =====
const COLUMNS = {
    manip: [
        "SORTEO DE OBSTACULOS DIFICULTAD BAJA",
        "SORTEO DE OBSTACULOS DIFICULTAD MEDIA",
        "SORTEO DE OBSTACULOS DIFICULTAD ALTA",
        "DETECCION PUNTOS CIEGOS TALLER",
        "DETECCION PUNTOS CIEGOS MINA",
        "MOVIMIENTO DE BRAZO CON JAULA DIFICULTAD BAJA",
        "MOVIMIENTO DE BRAZO CON JAULA DIFICULTAD MEDIA",
        "MOVIMIENTO DE BRAZO CON JAULA DIFICULTAD ALTA",
        "MOVIMIENTO DE BRAZO SIN CONDUCCION  SIN JAULA DIFICULTAD BAJA",
        "MOVIMIENTO DE BRAZO SIN CONDUCCION  SIN JAULA DIFICULTAD MEDIA",
        "MOVIMIENTO DE BRAZO CON CONDUCCION  SIN JAULA DIFICULTAD BAJA",
        "MOVIMIENTO DE BRAZO CON CONDUCCION  SIN JAULA DIFICULTAD MEDIA",
        "INSTALACION JAULA DIFICULTAD BAJA",
        "INSTALACION JAULA DIFICULTAD MEDIA",
        "1. CONDUCCION DIFICULTAD BAJA",
        "2. CONDUCCION. VEHICULOS DIFICULTAD MEDIA",
        "3. CONDUCCION. PEATON DIFICULTAD MEDIA",
        "4. CONDUCCION. CENEFA DIFUCLTAD MEDIA",
        "5. CONDUCCION. RAMPA DIFICULTAD MEDIA",
        "POSICIONAMIENTO PARA TRABAJO EN ALTURA DIFICULTAD BAJA",
        "POSICIONAMIENTO PARA TRABAJO EN ALTURA DIFICULTAD MEDIA",
        "POSICIONAMIENTO PARA TRABAJO EN ALTURA DIFICULTAD ALTA",
        "1. MOVIMIENTO CARGA TALLER DIFICULTAD BAJA",
        "2. MOVIMIENTO CARGA TALLER DIFICULTAD MEDIA",
        "3. MOVIMIENTO CARGA TALLER DIFICULTAD MEDIA",
        "4. MOVIMIENTO CARGA TALLER DIFICULTAD ALTA",
        "5. MOVIMIENTO CARGA TALLER DIFICULTAD ALTA",
        "6. MOVIMIENTO CARGA TALLER DIFICULTAD ALTA",
        "1. MOVIMIENTO CARGA MINA DIFICULTAD BAJA",
        "2. MOVIMIENTO CARGA MINA DIFICULTAD MEDIA",
        "CHEQUEO PRE-OPERACIONAL",
        "PROCEDIMIENTO ENCENDIDO",
    ],
    lhd: [
        "SORTEO OBSTACULOS DIFICULTAD BAJA",
        "SORTEO OBSTACULOS DIFICULTAD MEDIA",
        "SORTEO OBSTACULOS DIFICULTAD ALTA",
        "DETECCION PUNTOS CIEGOS TALLER",
        "MOV. BRAZO CON CONDUCCION DIFICULTAD BAJA",
        "MOV. BRAZO CON CONDUCCION DIFICULTAD MEDIA",
        "MOV. BRAZO CON CONDUCCION DIFICULTAD ALTA",
        "MOV. BRAZO SIN CONDUCCION DIFICULTAD BAJA",
        "MOV. BRAZO SIN CONDUCCION DIFICULTAD MEDIA",
        "TRASLADO DE MATERIAL PIQUE",
        "TRASLADO MATERIAL CAMION",
        "CONDUCCION MINA ESCOLTA",
        "CONDUCCION MINA RAMPA",
        "CONDUCCION MINA MINERO",
        "CHEQUEO PRE-OPERACIONAL",
        "PROCEDIMIENTO ENCENDIDO",
    ],
    jumbo: [
        "SORTEO OBSTACULOS DIFICULTAD BAJA",
        "SORTEO OBSTACULOS DIFICULTAD MEDIA",
        "SORTEO OBSTACULOS DIFICULTAD ALTA",
        "DETECCION PUNTOS CIEGOS TALLER",
        "DETECCION PUNTOS CIEGOS MINA",
        "POS.BRAZO TALLER (DISPARO) DIFICULTAD BAJA",
        "POS.BRAZO TALLER (DISPARO) DIFICULTAD MEDIA",
        "POS.BRAZO TALLER (DISPARO) DIFICULTAD ALTA",
        "POS.BRAZO TALLER (FORTIFICACION) DIFICULTAD BAJA",
        "POS.BRAZO TALLER (FORTIFICACION) DIFICULTAD MEDIA",
        "POS.BRAZO TALLER (FORTIFICACION) DIFICULTAD ALTA",
        "POS.BRAZO MINA (DISPARO) DIFICULTAD BAJA",
        "POS.BRAZO MINA (DISPARO) DIFICULTAD MEDIA",
        "POS.BRAZO MINA (DISPARO) DIFICULTAD ALTA",
        "POS.BRAZO MINA (FORTIFICACION) DIFICULTAD BAJA",
        "POS.BRAZO MINA (FORTIFICACION) DIFICULTAD MEDIA",
        "POS.BRAZO MINA (FORTIFICACION) DIFICULTAD ALTA",
        "PERFORACION DE DISPARO DIFICULTAD BAJA",
        "PERFORACION DE DISPARO DIFICULTAD MEDIA",
        "PERFORACION DE DISPARO DIFICULTAD ALTA",
        "PERFORACION DE FORTIFICACION DIFICULTAD BAJA",
        "PERFORACION DE FORTIFICACION DIFICULTAD MEDIA",
        "PERFORACION DE FORTIFICACION DIFICULTAD ALTA",
        "CONDUCCION EN MINA DIFICULTAD BAJA",
        "CONDUCCION EN MINA DIFICULTAD MEDIA (RAMPA)",
        "CONDUCCION EN MINA DIFICULTAD ALTA (RAMPA)",
        "CHEQUEO PRE-OPERACIONAL",
        "PROCEDIMIENTO ENCENDIDO",
    ]
};

const detectDiff = (s = '') => {
    const t = norm(s);
    if (t.includes('dificultad alta')) return 'ALTA';
    if (t.includes('dificultad media')) return 'MEDIA';
    if (t.includes('dificultad baja')) return 'BAJA';
    if (t.includes('dificil')) return 'ALTA';
    if (t.includes('medio') || t.includes('media')) return 'MEDIA';
    if (t.includes('facil')) return 'BAJA';
    return null;
};

// ===== Mappers =====
function mapManip(text, counters) {
    const t = norm(text);
    const diff = detectDiff(text);
    if (t.includes('sorteo') && t.includes('obstaculos') && diff) return `SORTEO DE OBSTACULOS DIFICULTAD ${diff}`;
    if (t.includes('deteccion') && t.includes('puntos ciegos')) {
        if (t.includes('mina')) return 'DETECCION PUNTOS CIEGOS MINA';
        if (t.includes('taller')) return 'DETECCION PUNTOS CIEGOS TALLER';
    }
    if (t.includes('brazo') && t.includes('mov')) {
        const conJaula = t.includes('con jaula'),
            sinJaula = t.includes('sin jaula');
        const conCond = t.includes('con conduccion'),
            sinCond = t.includes('sin conduccion');
        const d = diff;
        if (conJaula && d) return `MOVIMIENTO DE BRAZO CON JAULA DIFICULTAD ${d}`;
        if (sinJaula && d) {
            if (conCond && (d === 'BAJA' || d === 'MEDIA')) return `MOVIMIENTO DE BRAZO CON CONDUCCION  SIN JAULA DIFICULTAD ${d}`;
            if (sinCond && (d === 'BAJA' || d === 'MEDIA')) return `MOVIMIENTO DE BRAZO SIN CONDUCCION  SIN JAULA DIFICULTAD ${d}`;
        }
    }
    if (t.includes('instalacion') && t.includes('jaula') && (diff === 'BAJA' || diff === 'MEDIA')) return `INSTALACION JAULA DIFICULTAD ${diff}`;
    if (t.includes('conduccion') && (t.includes('evaluacion') || t.includes('evaluación'))) {
        if (t.includes('vehiculo') || t.includes('vehiculos')) return '2. CONDUCCION. VEHICULOS DIFICULTAD MEDIA';
        if (t.includes('peaton')) return '3. CONDUCCION. PEATON DIFICULTAD MEDIA';
        if (t.includes('cenefa')) return '4. CONDUCCION. CENEFA DIFUCLTAD MEDIA';
        if (t.includes('rampa')) return '5. CONDUCCION. RAMPA DIFICULTAD MEDIA';
        if (diff === 'BAJA') return '1. CONDUCCION DIFICULTAD BAJA';
    }
    if (t.includes('posicionamiento') && t.includes('trabajo en altura') && diff) return `POSICIONAMIENTO PARA TRABAJO EN ALTURA DIFICULTAD ${diff}`;
    if (t.includes('movimiento de carga') && diff) {
        if (t.includes('taller')) {
            const order = [
                ['BAJA', ["1. MOVIMIENTO CARGA TALLER DIFICULTAD BAJA"]],
                ['MEDIA', ["2. MOVIMIENTO CARGA TALLER DIFICULTAD MEDIA", "3. MOVIMIENTO CARGA TALLER DIFICULTAD MEDIA"]],
                ['ALTA', ["4. MOVIMIENTO CARGA TALLER DIFICULTAD ALTA", "5. MOVIMIENTO CARGA TALLER DIFICULTAD ALTA", "6. MOVIMIENTO CARGA TALLER DIFICULTAD ALTA"]]
            ];
            for (const [d, cols] of order) {
                if (d === diff) {
                    for (const c of cols) {
                        if (!counters[c]) {
                            counters[c] = true;
                            return c;
                        }
                    }
                }
            }
        }
        if (t.includes('mina')) {
            if (diff === 'BAJA') {
                const c = "1. MOVIMIENTO CARGA MINA DIFICULTAD BAJA";
                if (!counters[c]) {
                    counters[c] = true;
                    return c;
                }
            }
            if (diff === 'MEDIA') {
                const c = "2. MOVIMIENTO CARGA MINA DIFICULTAD MEDIA";
                if (!counters[c]) {
                    counters[c] = true;
                    return c;
                }
            }
        }
    }
    if (t.includes('chequeo') && (t.includes('pre-operacional') || t.includes('pre operacional') || t.includes('preoperacional'))) return 'CHEQUEO PRE-OPERACIONAL';
    if (t.includes('encendido')) return 'PROCEDIMIENTO ENCENDIDO';
    return null;
}

function mapLHD(text) {
    const tAll = norm(text);
    const t = tAll;
    const diff = detectDiff(text);
    if (t.includes('sorteo') && t.includes('obstaculos') && diff) return `SORTEO OBSTACULOS DIFICULTAD ${diff}`;
    if (t.includes('deteccion') && t.includes('puntos ciegos') && tAll.includes('taller')) return 'DETECCION PUNTOS CIEGOS TALLER';
    if (tAll.includes('mov') && tAll.includes('brazo')) {
        if (tAll.includes('con conduccion') && diff) return `MOV. BRAZO CON CONDUCCION DIFICULTAD ${diff}`;
        if (tAll.includes('sin conduccion') && (diff === 'BAJA' || diff === 'MEDIA')) return `MOV. BRAZO SIN CONDUCCION DIFICULTAD ${diff}`;
    }
    if (tAll.includes('traslado') && tAll.includes('pique')) return 'TRASLADO DE MATERIAL PIQUE';
    if (tAll.includes('traslado') && tAll.includes('camion')) return 'TRASLADO MATERIAL CAMION';
    if (tAll.includes('conduccion') && tAll.includes('mina')) {
        if (tAll.includes('escolta')) return 'CONDUCCION MINA ESCOLTA';
        if (tAll.includes('rampa')) return 'CONDUCCION MINA RAMPA';
        if (tAll.includes('peaton') || tAll.includes('peatón') || tAll.includes('minero')) return 'CONDUCCION MINA MINERO';
    }
    if (tAll.includes('chequeo') && (tAll.includes('pre-operacional') || tAll.includes('pre operacional') || tAll.includes('preoperacional'))) return 'CHEQUEO PRE-OPERACIONAL';
    if (tAll.includes('encendido')) return 'PROCEDIMIENTO ENCENDIDO';
    return null;
}

function mapJumbo(text) {
    const tAll = norm(text);
    const t = tAll;
    const diff = detectDiff(text);
    const lugar = tAll.includes('mina') ? 'MINA' : (tAll.includes('taller') ? 'TALLER' : null);
    if (t.includes('encendido')) return 'PROCEDIMIENTO ENCENDIDO';
    if (t.includes('chequeo') && (t.includes('pre-operacional') || t.includes('pre operacional') || t.includes('preoperacional'))) return 'CHEQUEO PRE-OPERACIONAL';
    if (t.includes('deteccion') && t.includes('puntos ciegos')) {
        if (t.includes('mina') || tAll.includes('mina')) return 'DETECCION PUNTOS CIEGOS MINA';
        if (t.includes('taller') || tAll.includes('taller')) return 'DETECCION PUNTOS CIEGOS TALLER';
    }
    if (t.includes('sorteo') && t.includes('obstaculos') && diff) return `SORTEO OBSTACULOS DIFICULTAD ${diff}`;
    if (t.includes('fortificacion') && !t.includes('perforacion')) {
        const d = diff || 'MEDIA';
        const zona = lugar || 'MINA';
        return `POS.BRAZO ${zona} (FORTIFICACION) DIFICULTAD ${d}`;
    }
    if ((t.includes('pos.brazo') || (t.includes('pos') && t.includes('brazo')) || (t.includes('posicionamiento') && t.includes('brazo'))) && (t.includes('disparo') || t.includes('fortificacion')) && diff) {
        const zona = lugar || 'MINA';
        if (t.includes('disparo')) return `POS.BRAZO ${zona} (DISPARO) DIFICULTAD ${diff}`;
        if (t.includes('fortificacion')) return `POS.BRAZO ${zona} (FORTIFICACION) DIFICULTAD ${diff}`;
    }
    if ((t.includes('perforacion') || t.includes('disparo')) && diff) {
        if (t.includes('disparo')) return `PERFORACION DE DISPARO DIFICULTAD ${diff}`;
        if (t.includes('fortificacion')) return `PERFORACION DE FORTIFICACION DIFICULTAD ${diff}`;
    }
    if (t.includes('conduccion en mina') || (tAll.includes('conduccion') && tAll.includes('mina'))) {
        if (t.includes('alta') || t.includes('dificil') || tAll.includes('alta')) return 'CONDUCCION EN MINA DIFICULTAD ALTA (RAMPA)';
        if (t.includes('media') || t.includes('medio') || t.includes('rampa') || tAll.includes('media') || tAll.includes('medio') || tAll.includes('rampa')) return 'CONDUCCION EN MINA DIFICULTAD MEDIA (RAMPA)';
        return 'CONDUCCION EN MINA DIFICULTAD BAJA';
    }
    return null;
}

// ===== Guess profile (opcional: warning de mezcla) =====
function guessProfile(text) {
    const t = norm(text);
    if (t.includes('perforadora') || t.includes('jumbo')) return 'jumbo';
    if (t.includes('lhd')) return 'lhd';
    if (t.includes('manipulador')) return 'manip';
    return null;
}

// ===== PDF =====
async function pdfToText(arrayBuffer) {
    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(it => ('str' in it ? it.str : (it?.unicode || '')));
        text += strings.join('\n') + '\n';
    }
    return text;
}

// ===== Estado =====
const state = {
    current: 'manip',
    rows: {
        manip: new Map(),
        lhd: new Map(),
        jumbo: new Map()
    },
    debug: false
};

function getCols(){
  const base = COLUMNS[state.current];
  return [...base, ...base.map(c => `TIEMPO - ${c}`)];
}

function getMapper() {
    return state.current === 'manip' ? mapManip : state.current === 'lhd' ? mapLHD : mapJumbo;
}

function getRows() {
    return state.rows[state.current];
}

function log(msg) {
    if (!state.debug) return;
    const el = document.getElementById('debug');
    el.style.display = 'block';
    el.textContent += msg + '\n';
    el.scrollTop = el.scrollHeight;
}

async function processZips(files) {
  const mapFn = getMapper();

  for (const file of files) {
    log(`ZIP: ${file.name}`);
    const zip = await JSZip.loadAsync(file);

    const rootCandidates = new Set();
    zip.forEach((relPath, entry) => {
      const seg = relPath.split('/')[0];
      if (seg) rootCandidates.add(seg);
    });
    const zipUserDefault = [...rootCandidates][0] || file.name.replace(/\.zip$/i, '');

    const pdfEntries = Object.values(zip.files).filter(e => !e.dir && /\.pdf$/i.test(e.name));
    for (const entry of pdfEntries) {
      const user = (entry.name.split('/')[0] || zipUserDefault) || zipUserDefault;
      const arrayBuffer = await entry.async('arraybuffer');
      const text = await pdfToText(arrayBuffer);

      // % Resultado Final
      const pctMatch = text.match(RESULT_RE);
      if (!pctMatch) { log(`[${entry.name}] sin 'Resultado Final'`); continue; }
      const pct = pctMatch[1].replace(',', '.');

      // Aviso si parece otro perfil
      const guess = guessProfile(text);
      if (guess && guess !== state.current) {
        log(`[${entry.name}] ⚠ posible tipo ${guess.toUpperCase()} pero el perfil seleccionado es ${state.current.toUpperCase()}`);
      }

      const rows = getRows();
      const existing = rows.get(user) || Object.fromEntries(getCols().map(c => [c, '']));
      existing.__counters = existing.__counters || {}; // para Manipulador

      // Mapeo a columna base
      const col = mapFn(text, existing.__counters);
      if (!col) { log(`[${entry.name}] sin mapeo`); continue; }
      if (!getCols().includes(col)) { log(`[${entry.name}] columna desconocida: ${col}`); continue; }

      // Tiempo (si existe en el PDF)
      const timeVal = extractTime(text);
      const timeCol = `TIEMPO - ${col}`;

      if (!existing[col]) {
        // Primera aparición de esta columna: guarda % y (si hay) el tiempo
        existing[col] = pct + '%';
        if (timeVal) existing[timeCol] = timeVal;
        rows.set(user, existing);
        log(`[${entry.name}] -> ${user} | ${col} = ${pct}%` + (timeVal ? ` | tiempo ${timeVal}` : ''));
      } else {
        // Duplicado: si ya teníamos el %, pero faltaba el tiempo y ahora lo encontramos, complétalo
        if (timeVal && !existing[timeCol]) {
          existing[timeCol] = timeVal;
          rows.set(user, existing);
          log(`[${entry.name}] tiempo agregado para ${user} | ${col} = ${timeVal}`);
        } else {
          log(`[${entry.name}] duplicado ignorado para ${user} | ${col}`);
        }
      }
    }
  }
  renderTable();
}


function renderTable() {
    const wrap = document.getElementById('tableWrap');
    document.getElementById('profileLabel').textContent = state.current === 'manip' ? 'Manipulador' : state.current === 'lhd' ? 'LHD' : 'Jumbo';
    const users = [...getRows().keys()].sort();
    if (users.length === 0) {
        wrap.innerHTML = `<p class="muted">Sin datos aún para <strong>${document.getElementById('profileLabel').textContent}</strong>. Procesa ZIPs en la pestaña “Cargar & Procesar”.</p>`;
        return;
    }
    let html = '<div style="overflow:auto"><table><thead><tr><th>Usuario</th>' + getCols().map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
    for (const user of users) {
        const row = getRows().get(user) || {};
        html += `<tr><td><strong>${user}</strong></td>` + getCols().map(c => `<td>${row[c] || ''}</td>`).join('') + '</tr>';
    }
    html += '</tbody></table></div>';
    wrap.innerHTML = html;
}

function clearCurrent() {
    getRows().clear();
    renderTable();
    const logEl = document.getElementById('debug');
    logEl.textContent = '';
}

function toCSV() {
    const users = [...getRows().keys()].sort();
    if (users.length === 0) return '';
    const sep = ';';
    const header = ['Usuario', ...getCols()].join(sep);
    const lines = [header];
    for (const user of users) {
        const row = getRows().get(user) || {};
        lines.push([user, ...getCols().map(c => row[c] || '')].join(sep));
    }
    return lines.join('\n');
}

// ===== UI wiring =====
const tabs = [...document.querySelectorAll('.tab')];
for (const t of tabs) {
    t.addEventListener('click', () => {
        tabs.forEach(x => x.setAttribute('aria-selected', 'false'));
        t.setAttribute('aria-selected', 'true');
        const id = t.getAttribute('aria-controls');
        document.querySelectorAll('section.view').forEach(v => v.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    });
}

const segBtns = [...document.querySelectorAll('.segbtn')];
segBtns.forEach(btn => btn.addEventListener('click', () => {
    segBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    state.current = btn.dataset.prof;
    renderTable();
}));

document.getElementById('btnProcess').addEventListener('click', async () => {
    state.debug = document.getElementById('debugChk').checked;
    if (state.debug) document.getElementById('debug').style.display = 'block';
    const files = document.getElementById('zipInput').files;
    if (!files || files.length === 0) {
        alert('Selecciona al menos un ZIP');
        return;
    }
    await processZips(files);
    tabs[0].setAttribute('aria-selected', 'false');
    tabs[1].setAttribute('aria-selected', 'true');
    document.getElementById('view-upload').classList.remove('active');
    document.getElementById('view-results').classList.add('active');
});

document.getElementById('btnClear').addEventListener('click', clearCurrent);

document.getElementById('btnCSV').addEventListener('click', () => {
    const csv = toCSV();
    if (!csv) {
        alert('No hay datos para exportar');
        return;
    }
    const blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumen_${state.current}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

renderTable();