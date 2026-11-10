// Снимки макетов этапа 5 в рамке audit/preview/phone.html: три направления, экран «Учёт» и окно «На что?».
// Chrome без окна, временный пустой профиль; приложение и его данные не открываются вовсе.
// Запуск (сервер на localhost:8791 уже работает):  node audit/tools/shots-preview.js [страница макета] [папка для снимков]
const { spawn } = require('child_process'); const fs = require('fs'), path = require('path'), os = require('os');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9378, BASE = 'http://localhost:8791', PAGE = process.argv[2] || 'uchet.html', OUT = path.resolve(process.argv[3] || 'audit/screenshots');
const PROFILE = path.join(os.tmpdir(), 'moi-rashody-style-preview-profile');
fs.rmSync(PROFILE, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
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
  const done = [];
  const shot = async name => {
    await sleep(500);
    const r = await ev("const r=document.getElementById('phone').getBoundingClientRect(); return [r.left,r.top,r.width,r.height]");
    const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: r[0] - 14, y: r[1] - 14, width: r[2] + 28, height: r[3] + 28, scale: 1 } });
    const file = path.join(OUT, name + '.png'); fs.writeFileSync(file, Buffer.from(s.data, 'base64')); done.push(name + ' ' + Math.round(fs.statSync(file).size / 1024) + ' КБ');
  };
  const base = PAGE.replace(/\.html$/, '');
  for (const v of ['a', 'b', 'c']) {
    await send('Page.navigate', { url: `${BASE}/audit/preview/phone.html?page=${PAGE}&v=${v}` }); await sleep(3000);
    const info = await ev("const f=document.querySelector('iframe.app-frame'),w=f.contentWindow,d=f.contentDocument; await d.fonts.ready; const t=d.querySelector('.tabs').getBoundingClientRect(); const lab=[...d.querySelectorAll('.tabs button')].map(b=>{const n=[...b.childNodes].filter(x=>x.nodeType===3).pop(); const r=d.createRange(); r.selectNode(n); return Math.round(r.getBoundingClientRect().bottom)}); return {v:d.documentElement.dataset.v, w:w.innerWidth, sw:d.documentElement.scrollWidth, tabs:[Math.round(t.top),Math.round(t.bottom)], labelsBottom:lab, fonts:[...d.fonts].filter(x=>x.status==='loaded').length}");
    console.log(JSON.stringify(info));
    await shot(`napravlenie-${v}_${base}`);
    await ev("document.querySelector('iframe.app-frame').contentDocument.getElementById('add').click(); return 1"); await sleep(600);
    await shot(`napravlenie-${v}_na-chto`);
  }
  console.log(done.join('\n'));
  ws.close();
})().catch(e => { console.error('ОШИБКА: ' + e.message); process.exitCode = 1; }).finally(() => { try { chrome.kill(); } catch { } try { fs.rmSync(PROFILE, { recursive: true, force: true }); } catch { } });
