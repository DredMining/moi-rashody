// Снимки приложения в рамке audit/preview/phone.html (iPhone 18 Pro Max, бордовая): Chrome без окна, свой пустой профиль.
// Реальные данные не затрагиваются: профиль создаётся заново во временной папке, в него загружается тестовый набор seed-test.json.
// Запуск (сервер на localhost:8791 уже работает):  node audit/tools/shots.js [папка для снимков]
const { spawn } = require('child_process'); const fs = require('fs'), path = require('path'), os = require('os');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9377, BASE = 'http://localhost:8791', OUT = path.resolve(process.argv[2] || 'audit/screenshots');
const PROFILE = path.join(os.tmpdir(), 'moi-rashody-style-audit-profile');
fs.rmSync(PROFILE, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const F = "const f=document.querySelector('iframe.app-frame'),w=f.contentWindow,d=f.contentDocument;";
(async () => {
  let ws;
  for (let i = 0; i < 60 && !ws; i++) { try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const p = t.find(x => x.type === 'page'); if (p) ws = new WebSocket(p.webSocketDebuggerUrl); } catch { } if (!ws) await sleep(250); }
  if (!ws) throw new Error('Chrome не ответил');
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
  let id = 0; const pend = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const { ok, no } = pend.get(m.id); pend.delete(m.id); m.error ? no(new Error(m.error.message)) : ok(m.result); } };
  const send = (method, params = {}) => new Promise((ok, no) => { const i = ++id; pend.set(i, { ok, no }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text); return r.result.value; };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 520, height: 1080, deviceScaleFactor: 2, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  const open = async () => { await send('Page.navigate', { url: BASE + '/audit/preview/phone.html' }); await sleep(3000);
    await ev(F + "await new Promise((ok,no)=>{const s=d.createElement('script');s.src='/audit/tools/probe.js';s.onload=ok;s.onerror=no;d.head.appendChild(s)}); w.__probe.noanim(); return 1"); };
  const run = (steps, ms) => ev(F + `await w.__probe.run(${JSON.stringify(steps)}, ${ms || 600}); return 1`);
  const done = [];
  const shot = async (name, bottom) => {
    await sleep(350);
    const r = await ev("const r=document.getElementById('phone').getBoundingClientRect(); return [r.left,r.top,r.width,r.height]");
    const clip = bottom ? { x: r[0] + 8, y: r[1] + r[3] - 150, width: r[2] - 16, height: 142, scale: 2 } : { x: r[0] - 14, y: r[1] - 14, width: r[2] + 28, height: r[3] + 28, scale: 1 };
    const s = await send('Page.captureScreenshot', { format: 'png', clip });
    const file = path.join(OUT, 'ramka_' + name + '.png'); fs.writeFileSync(file, Buffer.from(s.data, 'base64')); done.push(name + ' ' + Math.round(fs.statSync(file).size / 1024) + ' КБ');
  };
  const q = (sel, i) => ['x', sel, i || 0, 'quiet'];
  // ---- пустое приложение ----
  await open();
  await shot('uchet_pusto');
  await run([q('#tabStats')]); await shot('itogi-rashody_pusto');
  await run([q('#statSeg button', 4)]); await shot('itogi-sravnenie_pusto');
  await run([q('#tabDebts')]); await shot('dolgi_pusto');
  // ---- тестовый набор: только в этот временный профиль ----
  await ev(F + "const cur=JSON.parse(w.localStorage.getItem('expenses-v1')); if(cur.items.length||cur.debts.length) throw new Error('хранилище не пустое'); const t=await (await w.fetch('/audit/tools/seed-test.json')).text(); JSON.parse(t); w.localStorage.setItem('expenses-v1',t); return 1");
  await open();
  await shot('uchet_dannye');
  await ev(F + "d.getElementById('scroller').scrollTop=420; return 1"); await shot('uchet_poslednie-zapisi');
  await run([q('#recent .item .amt', 3)]); await shot('uchet_deystviya-s-zapisyu');
  await run([q('#recent .itemacts [data-open]')]); await shot('izmenit-zapis');
  await run([q('.item-editor-panel .dp-x')]); await ev(F + "d.getElementById('scroller').scrollTop=0; return 1");
  await run([q('#limitOf')]); await shot('limit_shtorka');
  await run([q('#limSet')]); await shot('limit_izmenit');
  await run([q('#sheet [data-close].iconbtn'), q('#submitBtn'), q('#dateBtn'), q('#noteBtn')]); await shot('uchet_forma-oshibka');
  await open(); // форма снова в исходном виде: поля даты и комментария закрыты
  await run([['', '#amount', '1234567,89', 'fill'], q('#submitBtn')]); await shot('na-chto');
  await run([q('#sheet .tile', 12), q('#lblForm .submit')]); await shot('drugoe-oshibka');
  await run([q('#sheetBack'), q('#sheet .tile', 2)]); await shot('otkuda');
  await run([q('#sheet .tile', 1)]); await shot('otkuda_vybran-schet');
  await run([q('#sheet [data-close].iconbtn'), q('#tIn'), q('#submitBtn')]); await shot('chto-za-dohod');
  await run([q('#sheet [data-close].iconbtn'), q('#tOut'), ['', '#amount', '', 'fill'], q('#tabMoney')]); await shot('dengi_dannye');
  await run([q('#wallets .wrow')]); await shot('dengi_schet');
  await run([q('[data-wclose].dp-x'), q('#zakatLine')]); await shot('zakyat');
  await run([q('#zSet')]); await shot('zakyat-nastroyki');
  await run([q('#zakatForm [data-zclose].dp-x'), q('#zakatSheet [data-zx].iconbtn'), q('#bkOpen')]); await shot('kopiya');
  await run([q('#bkModal [data-bkclose].dp-x'), q('#xOpen'), q('#xForm [type=submit]')]); await shot('perevod-oshibka');
  await run([q('#xForm [data-xclose].dp-x'), q('#tabHistory')]); await shot('zapisi_vse');
  await run([q('#scopeFilter button', 2)], 1200); await shot('zapisi_komandirovka');
  await run([q('#scopeFilter button', 0)], 1200); await run([q('#tabDebts')]); await shot('dolgi_dannye');
  await run([q('#debtList .dgroup'), q('.dperson .dtap'), q('.dperson [data-gpartbtn]')]); await shot('okno-cheloveka');
  await run([q('[data-dpclose].dp-x'), q('#debtAddOpen'), q('#debtForm .submit')]); await shot('dal-v-dolg-oshibka');
  await run([q('#debtAddModal .dp-x'), q('#tabStats')]); await shot('itogi-rashody_dannye');
  await run([q('#breakdown .bar')]); await shot('itogi-kategoriya');
  await run([q('#sheet [data-close].iconbtn'), q('#statSeg button', 2)]); await shot('itogi-broker');
  await run([q('#pSet')]); await shot('itogi-broker_izmenit-procent');
  await run([q('#pCancel'), q('#statSeg button', 4)]); await shot('itogi-sravnenie_dannye');
  await run([q('#statSeg button', 3)]); await shot('itogi-komandirovka');
  await run([q('#tRep')]); await shot('otchet-komandirovki');
  await run([q('#repClose'), q('#tBegin')], 500); await shot('tost-komandirovka-nachalas');
  await sleep(6500); await run([q('#tabLedger')]); await shot('uchet_komandirovka-idet');
  await run([['', '#amount', '350', 'fill'], q('#submitBtn')]); await shot('na-chto_komandirovka');
  await run([q('#sheet .tile'), q('#ptOn')]); await shot('otkuda_naparnik');
  await run([q('#ptOn'), q('#sheet .tile[data-acc]', 1), q('#accGo')], 500); await shot('tost-otmenit');
  await sleep(6500); await ev(F + "d.getElementById('scroller').scrollTop=0; return 1"); await shot('nizhnyaya-panel-krupno', true);
  const info = await ev(F + "const cs=w.getComputedStyle(d.documentElement); return {inner:[w.innerWidth,w.innerHeight], top:cs.getPropertyValue('--simulator-safe-top').trim(), bottom:cs.getPropertyValue('--simulator-safe-bottom').trim(), items:JSON.parse(w.localStorage.getItem('expenses-v1')).items.length}");
  console.log(JSON.stringify(info)); console.log(done.length + ' снимков:\n' + done.join('\n'));
  ws.close();
})().catch(e => { console.error('ОШИБКА: ' + e.message); process.exitCode = 1; }).finally(() => { try { chrome.kill(); } catch { } });
