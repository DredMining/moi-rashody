// Проход по ширинам (этап 2 аудита) без окна браузера: на каждой ширине открывает приложение с тестовым набором,
// проходит основные экраны, окна и формы и печатает только отклонения (выход за экран, обрезанный текст, поля мельче 16 px,
// шрифт мельче 11 px, окно за экраном, низкий контраст текста). Реальные данные не затрагиваются: временный профиль Chrome.
// Запуск (сервер на localhost:8791 уже работает):  node audit/tools/scan.js      SCHEME=light — светлое оформление телефона
const { spawn } = require('child_process'); const fs = require('fs'), path = require('path'), os = require('os');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9379, BASE = 'http://localhost:8791', SCHEME = process.env.SCHEME === 'light' ? 'light' : 'dark';
const PROFILE = path.join(os.tmpdir(), 'moi-rashody-style-scan-profile');
const SIZES = [[320, 568], [360, 780], [375, 667], [390, 844], [414, 896], [430, 932], [440, 956], [568, 320], [780, 360], [667, 375], [844, 390], [896, 414], [932, 430], [956, 440]];
fs.rmSync(PROFILE, { recursive: true, force: true });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let ws;
  for (let i = 0; i < 60 && !ws; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find(x => x.type === 'page'); if (p) ws = new WebSocket(p.webSocketDebuggerUrl); } catch { } if (!ws) await sleep(250); }
  if (!ws) throw new Error('Chrome не ответил');
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
  let id = 0; const pend = new Map(); const errors = [];
  ws.onmessage = e => { const m = JSON.parse(e.data);
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text + ' ' + ((m.params.exceptionDetails.exception || {}).description || '').slice(0, 160));
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console.error: ' + m.params.args.map(a => a.value || a.description || '').join(' ').slice(0, 160));
    if (m.id && pend.has(m.id)) { const { ok, no } = pend.get(m.id); pend.delete(m.id); m.error ? no(new Error(m.error.message)) : ok(m.result); } };
  const send = (method, params = {}) => new Promise((ok, no) => { const i = ++id; pend.set(i, { ok, no }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text); return r.result.value; };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: SCHEME }] });
  const load = async () => { await send('Page.navigate', { url: BASE + '/index.html' }); await sleep(2200);
    await ev("await new Promise((ok,no)=>{const s=document.createElement('script');s.src='/audit/tools/probe.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)}); __probe.noanim(); return 1"); };
  // тестовый набор — один раз, в пустой временный профиль
  await send('Emulation.setDeviceMetricsOverride', { width: 440, height: 956, deviceScaleFactor: 2, mobile: true });
  await load();
  await ev("const cur=JSON.parse(localStorage.getItem('expenses-v1')); if(cur.items.length||cur.debts.length) throw new Error('хранилище не пустое'); const t=await (await fetch('/audit/tools/seed-test.json')).text(); JSON.parse(t); localStorage.setItem('expenses-v1',t); return 1");
  const DATA = [['uchet', '#tabLedger', 0], ['dengi', '#tabMoney', 0], ['zapisi', '#tabHistory', 0], ['dolgi', '#tabDebts', 0], ['okno-cheloveka', '#debtList .dgroup', 0], ['', '[data-dpclose].dp-x', 0, 'quiet'], ['itogi', '#tabStats', 0], ['kategoriya', '#breakdown .bar', 0], ['', '#sheet [data-close].iconbtn', 0, 'quiet'],
    ['dohody', '#statSeg button', 1], ['broker', '#statSeg button', 2], ['komandirovka', '#statSeg button', 3], ['sravnenie', '#statSeg button', 4], ['', '#statSeg button', 0, 'quiet'], ['zapis-deystviya', '', 0, 'quiet']];
  const strip = "const strip=o=>{for(const k in o){const v=o[k]; if(v&&typeof v==='object'){delete v.under44; delete v.tabbar; delete v.covered; delete v.tileCols; if(!v.minFont) delete v.fontSizes; if(v.win&&!/ЗА ЭКРАНОМ/.test(v.win)) delete v.win; if(v.win&&/прокрутка/.test(v.win)) delete v.win; if(v.clipped) v.clipped=v.clipped.filter(x=>!/span\\.dd|Очень длин|командировка закончилась/.test(x)); if(v.clipped&&!v.clipped.length) delete v.clipped; if(v.wrapped) v.wrapped=v.wrapped.filter(x=>!/moneyTotal|«[0-9 ]+,[0-9]+ ₽»|sheetSub|#tT|#aT|#dpT|#opT|#sheetTitle/.test(x)); if(v.wrapped&&!v.wrapped.length) delete v.wrapped; if(!Object.keys(v).length) delete o[k];}} return o};";
  let total = 0;
  for (const [w, h] of SIZES) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
    await load();
    const r = await ev(strip + `const out={}; Object.assign(out, strip(await __probe.run(${JSON.stringify(DATA)},450))); const c=[]; for(const t of ['#tabLedger','#tabMoney','#tabHistory','#tabDebts','#tabStats']){ await __probe.run([['x',t,0,'quiet']],450); __probe.contrast().filter(x=>!/opacity/.test(x)).forEach(x=>c.push(x)); } if(c.length) out.kontrast=[...new Set(c)].slice(0,8);
      for(const k of ['a','b','c']) Object.assign(out, strip(await __probe.run(__probe.sets[k],450))); out.docW=document.documentElement.scrollWidth; return out`);
    const over = r.docW > w; delete r.docW; const keys = Object.keys(r);
    total += keys.length + (over ? 1 : 0);
    console.log(`${w}×${h}: ` + (keys.length || over ? (over ? 'ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА; ' : '') + JSON.stringify(r) : 'без отклонений'));
  }
  console.log(`оформление: ${SCHEME}; отклонений всего: ${total}; ошибок в консоли: ${errors.length}` + (errors.length ? '\n' + [...new Set(errors)].slice(0, 5).join('\n') : ''));
  ws.close();
})().catch(e => { console.error('ОШИБКА: ' + e.message); process.exitCode = 1; }).finally(() => { try { chrome.kill(); } catch { } try { fs.rmSync(PROFILE, { recursive: true, force: true }); } catch { } });
