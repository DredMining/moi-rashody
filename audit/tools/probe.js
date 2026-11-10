// Аудит стиля: измерения на открытой странице. Ничего не меняет и не сохраняет — только читает вёрстку.
// Подключение из консоли:  await import('/audit/tools/probe.js')  →  __probe.metrics(), __probe.contrast()
(() => {
  const txt = el => (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 28);
  const lab = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '') + (txt(el) ? ' «' + txt(el) + '»' : '');
  const shown = el => {
    if (el.closest('[inert],[hidden]')) return false;
    if (el.checkVisibility && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // только то, что реально на экране по вертикали текущей прокрутки не требуем: берём всё видимое в документе
  const all = sel => [...document.querySelectorAll(sel)].filter(shown);
  const hasText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim());
  const top = el => { // элемент не перекрыт чужим окном: его центр принадлежит ему или его потомку/предку
    const r = el.getBoundingClientRect(), x = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), y = r.top + r.height / 2;
    if (y < 0 || y > innerHeight) return true; // за пределами экрана по вертикали — не судим
    const h = document.elementFromPoint(x, y);
    return !h || h === el || el.contains(h) || h.contains(el);
  };
  const parse = c => {
    let m = c.match(/^rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; }
    m = c.match(/^color\(srgb ([^)]+)\)/);
    if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number); return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p[3] === undefined ? 1 : p[3] }; }
    return { r: 0, g: 0, b: 0, a: 0 };
  };
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  const bgOf = el => { // фон под элементом: слои снизу вверх; градиент помечаем
    const layers = []; let grad = false;
    for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') grad = true; const c = parse(cs.backgroundColor); if (c.a > 0) { layers.push(c); if (c.a >= 1) break; } }
    let b = { r: 13, g: 19, b: 32, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) b = over(layers[i], b);
    return { b, grad };
  };
  const P = {
    metrics() {
      const vw = innerWidth, vh = innerHeight, sc = document.getElementById('scroller');
      const offX = [], small = [], fonts = {}, weights = {}, fams = {}, under16 = [], clipped = [], covered = [];
      all('body *').forEach(el => {
        const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
        if (el.closest('.sr')) return;
        if ((r.right > vw + .5 || r.left < -.5) && !el.closest('#accFilter') && cs.position !== 'fixed' && (hasText(el) || /^(BUTTON|INPUT|SELECT)$/.test(el.tagName))) offX.push(lab(el) + ' [' + Math.round(r.left) + '…' + Math.round(r.right) + ']');
        if (hasText(el)) {
          const fs = Math.round(parseFloat(cs.fontSize) * 100) / 100; fonts[fs] = (fonts[fs] || 0) + 1; weights[cs.fontWeight] = (weights[cs.fontWeight] || 0) + 1;
          const f = cs.fontFamily.split(',')[0].replace(/"/g, ''); fams[f] = (fams[f] || 0) + 1;
          if ((el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== 'visible') || (el.scrollHeight > el.clientHeight + 1 && cs.overflowY === 'hidden')) clipped.push(lab(el) + ' ' + el.scrollWidth + '>' + el.clientWidth);
        }
      });
      all('button,a[href],input:not([type=hidden]):not([type=file]),select,summary,[role=button]').forEach(el => {
        const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
        let h = r.height, w = r.width; const af = getComputedStyle(el, '::after');
        if (af.content !== 'none' && af.position === 'absolute') { const t = parseFloat(af.top) || 0, b = parseFloat(af.bottom) || 0, l = parseFloat(af.left) || 0, rr = parseFloat(af.right) || 0; if (t < 0 || b < 0) h += -Math.min(0, t) - Math.min(0, b); if (l < 0 || rr < 0) w += -Math.min(0, l) - Math.min(0, rr); }
        if (h < 43.5 || w < 43.5) small.push(lab(el) + ' ' + Math.round(w) + '×' + Math.round(h));
        if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && parseFloat(cs.fontSize) < 16 && cs.opacity !== '0') under16.push(lab(el) + ' ' + cs.fontSize);
        if (!top(el)) covered.push(lab(el));
      });
      return { vw, vh, docW: document.documentElement.scrollWidth, scrollerW: sc ? sc.scrollWidth + '/' + sc.clientWidth : '', scrollerH: sc ? sc.scrollHeight + '/' + sc.clientHeight : '', offX: offX.slice(0, 20), small, fonts, weights, fams, under16, clipped: clipped.slice(0, 20), covered: covered.slice(0, 20) };
    },
    contrast(min) {
      const bad = [];
      all('body *').forEach(el => {
        if (!hasText(el) || el.closest('.sr')) return;
        const cs = getComputedStyle(el), { b, grad } = bgOf(el); let f = parse(cs.color); if (f.a < 1) f = over(f, b);
        const o = parseFloat(cs.opacity); const fs = parseFloat(cs.fontSize), big = fs >= 24 || (fs >= 18.66 && +cs.fontWeight >= 700);
        const k = ratio(f, b), need = min || (big ? 3 : 4.5);
        if (k < need || o < 1) bad.push(lab(el) + ' ' + hex(f) + ' на ' + hex(b) + (grad ? ' (градиент)' : '') + ' = ' + k.toFixed(2) + (o < 1 ? ' opacity ' + o : '') + ' · ' + fs + 'px/' + cs.fontWeight);
      });
      all('input').forEach(el => { if (!el.placeholder || el.value) return; const ps = getComputedStyle(el, '::placeholder'), { b } = bgOf(el); const f = parse(ps.color), k = ratio(f.a < 1 ? over(f, b) : f, b); if (k < (min || 4.5)) bad.push('placeholder ' + lab(el) + ' ' + k.toFixed(2)); });
      return bad;
    },
    // размеры и положение набора элементов: для проверки симметрии и равных размеров
    box(sel) { return all(sel).map(el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return { el: lab(el), x: +r.left.toFixed(1), y: +r.top.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), fs: cs.fontSize, fw: cs.fontWeight, lh: cs.lineHeight, rad: cs.borderRadius, pad: cs.padding }; }); },
    style(sel, props) { return all(sel).map(el => { const cs = getComputedStyle(el), o = { el: lab(el) }; props.forEach(p => o[p] = cs[p]); return o; }); },
    // число строк текста: куски разного кегля на одной строке (крупный месяц и мелкий год) считаются одной строкой —
    // кусок относится к строке, если его середина по высоте лежит внутри неё (или середина строки — внутри него)
    lines(el) { const r = document.createRange(); r.selectNodeContents(el); const rows = [];
      [...r.getClientRects()].filter(q => q.width > 1).sort((a, b) => a.top - b.top).forEach(q => { const mid = (q.top + q.bottom) / 2;
        const row = rows.find(w => (mid > w[0] && mid < w[1]) || ((w[0] + w[1]) / 2 > q.top && (w[0] + w[1]) / 2 < q.bottom));
        if (row) { row[0] = Math.min(row[0], q.top); row[1] = Math.max(row[1], q.bottom); } else rows.push([q.top, q.bottom]); });
      return rows.length; },
    // короткая сводка отклонений текущего состояния (для обхода по ширинам)
    scan() {
      const m = this.metrics(), o = {}, vh = innerHeight, vw = innerWidth;
      if (m.docW > m.vw) o.docW = m.docW;
      ['offX', 'clipped', 'covered', 'under16'].forEach(k => { if (m[k].length) o[k] = m[k].slice(0, 8); });
      const fs = Object.keys(m.fonts).map(Number); const mn = Math.min(...fs); if (mn < 11) o.minFont = mn; o.fontSizes = fs.sort((a, b) => a - b).join('/');
      const tiny = m.small.filter(s => { const q = s.match(/(\d+)×(\d+)$/); return q && (+q[1] < 32 || +q[2] < 32); }); if (tiny.length) o.under32 = tiny;
      o.under44 = m.small.length;
      all('.sheet-panel,.zsheet-panel,.wmodal>*:not(.sheet-bg)').forEach(p => { const r = p.getBoundingClientRect(), c = p.closest('.wmodal') || p; const scroll = p.scrollHeight > p.clientHeight + 1 || (c.scrollHeight > c.clientHeight + 1);
        o.win = [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)].join(',') + (scroll ? ' прокрутка' : '') + ((r.top < 0 || r.bottom > vh + .5 || r.left < 0 || r.right > vw + .5) ? ' ЗА ЭКРАНОМ' : ''); });
      const th = [...new Set(all('.sheet .tile').map(t => Math.round(t.getBoundingClientRect().height)))]; if (th.length > 1) o.tileH = th.join('/');
      const cols = new Set(all('.sheet .tiles:not(.accs) .tile').map(t => Math.round(t.getBoundingClientRect().left))).size; if (cols) o.tileCols = cols;
      const wr = []; all('#statSeg button,.mcol b,.mcol>span,.big,h2,h3,.submit,.primary,.ghost,.chip,.chipbtn,.seg button,.debt-add-trigger,.dp-t b,.sheet-t b,.sheet-t span,.zsheet-head b,.lparts b,.whead b,.wrow .wn,.linkbtn,.thead b,.lof>*').forEach(el => { const n = this.lines(el); if (n > 1) wr.push(lab(el).slice(0, 46) + ' ×' + n); }); if (wr.length) o.wrapped = wr.slice(0, 12);
      const tb = document.querySelector('.tabs').getBoundingClientRect(); o.tabbar = Math.round(tb.top) + '…' + Math.round(tb.bottom);
      return o;
    },
    async run(steps, ms) {
      const sleep = t => new Promise(r => setTimeout(r, t)), out = {};
      // на время замера анимации выключены (только на открытой странице): панель браузера в фоне не рисует кадры, и окно «застывает» на первом кадре появления
      let st = document.getElementById('__probe_noanim'); if (!st) { st = document.createElement('style'); st.id = '__probe_noanim'; st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}'; document.head.appendChild(st); }
      for (const [name, sel, idx, how] of steps) {
        if (how === 'fill') { const el = document.querySelector(sel); el.value = idx; el.dispatchEvent(new Event('input', { bubbles: true })); await sleep(150); continue; }
        const r = sel ? this.click(sel, idx) : ''; await sleep(ms || 850);
        if (how === 'quiet') continue;
        out[name] = r.startsWith('нет:') ? r : this.scan();
      }
      return out;
    },
    click(sel, i) { const el = all(sel)[i || 0]; if (!el) return 'нет: ' + sel; el.click(); return lab(el); },
    open() { return all('[role=dialog],.wmodal,.sheet,.zsheet').map(lab); }
  };
  // наборы шагов обхода (пустое приложение; ничего не сохраняют: формы только открываются)
  P.sets = {
    a: [['uchet', '#tabLedger', 0], ['', '#amount', '1234567,89', 'fill'], ['na-chto', '#submitBtn', 0], ['drugoe', '#sheet .tile', 12], ['', '#sheetBack', 0, 'quiet'], ['otkuda', '#sheet .tile', 2], ['otkuda-vybran', '#sheet .tile', 1],
      ['', '#sheet [data-close].iconbtn', 0, 'quiet'], ['limit', '#limitOf', 0], ['limit-izm', '#limSet', 0], ['', '#sheet [data-close].iconbtn', 0, 'quiet']],
    b: [['dengi', '#tabMoney', 0], ['schet', '#wallets .wrow', 0], ['', '[data-wclose].dp-x', 0, 'quiet'], ['zakyat', '#zakatLine', 0], ['zakyat-nastr', '#zSet', 0], ['', '#zakatForm [data-zclose].dp-x', 0, 'quiet'],
      ['', '#zakatSheet [data-zx].iconbtn', 0, 'quiet'], ['kopiya', '#bkOpen', 0], ['', '#bkModal [data-bkclose].dp-x', 0, 'quiet'], ['perevod', '#xOpen', 0], ['', '#xForm [data-xclose].dp-x', 0, 'quiet']],
    c: [['zapisi', '#tabHistory', 0], ['dolgi', '#tabDebts', 0], ['dal-v-dolg', '#debtAddOpen', 0], ['', '#debtAddModal .dp-x', 0, 'quiet'], ['itogi', '#tabStats', 0], ['itogi-dohody', '#statSeg button', 1], ['itogi-broker', '#statSeg button', 2],
      ['broker-procent', '#pSet', 0], ['', '#pCancel', 0, 'quiet'], ['itogi-komandirovka', '#statSeg button', 3], ['ostatok', '#tEdit', 0], ['', '#tripWinHost .dp-x', 0, 'quiet'], ['itogi-sravnenie', '#statSeg button', 4], ['', '#statSeg button', 0, 'quiet']]
  };
  // имитация safe-area iPhone на открытой странице (встроенный браузер env() не эмулирует): отступ сверху и переменная рамки снизу
  P.safe = (top, bottom) => { let st = document.getElementById('__probe_safe'); if (!st) { st = document.createElement('style'); st.id = '__probe_safe'; document.head.appendChild(st); }
    st.textContent = '.app{padding-top:' + top + 'px!important;background-size:100% ' + top + 'px!important}'; document.documentElement.style.setProperty('--simulator-safe-bottom', bottom + 'px'); document.documentElement.style.setProperty('--simulator-safe-top', top + 'px'); return [top, bottom]; };
  // без анимаций и без мигающего курсора: снимки одного и того же состояния получаются одинаковыми
  P.noanim = () => { let st = document.getElementById('__probe_noanim'); if (!st) { st = document.createElement('style'); st.id = '__probe_noanim'; st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'; document.head.appendChild(st); } return 1; };
  window.__probe = P;
})();
