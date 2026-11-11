#!/usr/bin/env node
'use strict';
/*
 * Локальный сервер симулятора iPhone. Зависимостей нет — нужен только Node.js.
 *
 *   node dev-tools/iphone-simulator/server.js     запустить и открыть симулятор в окне Chrome
 *     --browser       открыть во вкладке браузера по умолчанию
 *     --no-open       ничего не открывать (адрес печатается в консоль)
 *     --port 8800     другой порт
 *     --root <папка>  показать приложение из другой папки (по умолчанию — корень проекта)
 *
 *   /app/…        файлы приложения, только чтение
 *   /simulator/…  страница симулятора (эта папка)
 *   /__sim/…      служебное: сведения о сервере и поток «файл изменился»
 *
 * Приложение лежит в своей подпапке /app/, поэтому его service worker не касается страницы симулятора.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const argv = process.argv.slice(2);
const has = name => argv.includes(name);
const value = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback;
};

const SIM_DIR = __dirname;
const APP_DIR = path.resolve(value('--root', path.join(SIM_DIR, '..', '..')));
const PORT = Number(value('--port', process.env.SIM_PORT)) || 8800;
const HOST = '127.0.0.1'; // только этот компьютер: из сети сервер не виден
const BOOT = Date.now().toString(36); // по нему страница узнаёт, что сервер перезапускали
const MOUNTS = [['/app/', APP_DIR], ['/simulator/', SIM_DIR]];
const HOSTS = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`]);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8',
};
// сохранение этих файлов перезагружает приложение; папки ниже не отслеживаются (снимки аудита, чужие пакеты)
const WATCHED = new Set(['.html', '.css', '.js', '.mjs', '.json', '.webmanifest', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.woff2']);
const SKIPPED = new Set(['node_modules', 'audit']);

const sendText = (res, status, text, extra = {}) => {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...extra });
  res.end(text);
};

// Путь из адреса → файл внутри папки. Скрытые папки (.git, .claude) и выход за пределы папки не отдаются.
function locate(base, rel) {
  let decoded;
  try { decoded = decodeURIComponent(rel); } catch { return null; }
  const parts = decoded.split(/[\\/]+/).filter(Boolean);
  if (decoded.includes('\0') || parts.some(part => part.startsWith('.'))) return null;
  const file = path.join(base, ...parts);
  return file === base || file.startsWith(base + path.sep) ? file : null;
}

function sendFile(req, res, file, nested = false) {
  fs.stat(file, (err, stat) => {
    if (!err && stat.isDirectory() && !nested) return sendFile(req, res, path.join(file, 'index.html'), true);
    if (err || !stat.isFile()) return sendText(res, 404, 'Не найдено');
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Last-Modified': stat.mtime.toUTCString(),
      'ETag': `"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
  });
}

// ---- поток «файл изменился» ----
const streams = new Set();
const broadcast = (event, data) => {
  const chunk = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const stream of streams) stream.write(chunk);
};
function openStream(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store' });
  if (req.method === 'HEAD') return res.end();
  res.write(`retry: 1000\nevent: hello\ndata: ${JSON.stringify({ boot: BOOT })}\n\n`);
  streams.add(res);
  req.on('close', () => streams.delete(res));
}
setInterval(() => { for (const stream of streams) stream.write(': ping\n\n'); }, 20000).unref();

const changed = { simulator: new Set(), app: new Set() };
let flushTimer = null;
function noteChange(kind, file) {
  changed[kind].add(file);
  clearTimeout(flushTimer);
  // редактор при сохранении трогает файл несколько раз: собираем всё за 120 мс в одно сообщение
  flushTimer = setTimeout(() => {
    for (const kind of ['simulator', 'app']) {
      if (!changed[kind].size) continue;
      broadcast('change', { kind, files: [...changed[kind]].slice(0, 20) });
      changed[kind].clear();
    }
  }, 120);
}
function watchTree(dir, kindOf) {
  try {
    fs.watch(dir, { recursive: true }, (_event, name) => {
      if (!name) return;
      const rel = String(name).split(path.sep).join('/'), parts = rel.split('/');
      if (parts.some(part => part.startsWith('.')) || SKIPPED.has(parts[0]) || !WATCHED.has(path.extname(rel).toLowerCase())) return;
      const kind = kindOf(rel);
      if (kind) noteChange(kind, rel);
    }).on('error', () => {});
  } catch (err) {
    console.warn('Слежение за файлами недоступно, обновляй приложение кнопкой: ' + err.message);
  }
}
const simRel = path.relative(APP_DIR, SIM_DIR).split(path.sep).join('/');
const simInsideApp = !!simRel && !simRel.startsWith('..') && !path.isAbsolute(simRel);
watchTree(APP_DIR, rel => (simInsideApp && (rel + '/').startsWith(simRel + '/')) ? 'simulator' : rel.startsWith('dev-tools/') ? null : 'app');
if (!simInsideApp) watchTree(SIM_DIR, () => 'simulator');

// ---- запросы ----
const server = http.createServer((req, res) => {
  // страница чужого сайта не сможет обратиться к серверу под подставным именем
  if (!HOSTS.has(String(req.headers.host || '').toLowerCase())) return sendText(res, 403, 'Запрещено');
  if (req.method !== 'GET' && req.method !== 'HEAD') return sendText(res, 405, 'Только чтение', { Allow: 'GET, HEAD' });
  const pathname = req.url.split(/[?#]/)[0];
  if (pathname === '/' || pathname === '/simulator') return res.writeHead(302, { Location: '/simulator/' }).end();
  if (pathname === '/app') return res.writeHead(302, { Location: '/app/' }).end();
  if (pathname === '/__sim/info') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({ name: 'iphone-simulator', boot: BOOT, app: '/app/' }));
  }
  if (pathname === '/__sim/events') return openStream(req, res);
  for (const [prefix, base] of MOUNTS) {
    if (!pathname.startsWith(prefix)) continue;
    const file = locate(base, pathname.slice(prefix.length));
    return file ? sendFile(req, res, file) : sendText(res, 404, 'Не найдено');
  }
  sendText(res, 404, 'Не найдено');
});

// ---- окно с симулятором ----
function findChrome() {
  const env = process.env;
  const places = [env.CHROME, ...[env.ProgramFiles, env['ProgramFiles(x86)'], env.LOCALAPPDATA]
    .filter(Boolean).map(dir => path.join(dir, 'Google', 'Chrome', 'Application', 'chrome.exe'))];
  return places.find(file => file && fs.existsSync(file)) || null;
}
function openWindow(url) {
  if (has('--no-open')) return;
  const run = (command, args) => {
    try { spawn(command, args, { detached: true, stdio: 'ignore' }).on('error', () => {}).unref(); } catch { /* адрес уже напечатан в консоли */ }
  };
  if (process.platform === 'win32') {
    const chrome = has('--browser') ? null : findChrome();
    // --app: отдельное окно без вкладок и адресной строки — удобно поставить рядом с VS Code
    return chrome ? run(chrome, [`--app=${url}`, '--window-size=1000,1080']) : run('cmd', ['/c', 'start', '', url]);
  }
  run(process.platform === 'darwin' ? 'open' : 'xdg-open', [url]);
}

const address = `http://localhost:${PORT}/simulator/`;
server.on('error', async err => {
  if (err.code !== 'EADDRINUSE') throw err;
  const ours = await fetch(`http://${HOST}:${PORT}/__sim/info`).then(r => r.json()).then(d => d.name === 'iphone-simulator', () => false);
  if (ours) {
    console.log(`Симулятор уже запущен: ${address}`);
    openWindow(address);
    process.exit(0);
  }
  console.error(`Порт ${PORT} занят другой программой. Запусти с другим портом:\n  node dev-tools/iphone-simulator/server.js --port ${PORT + 1}`);
  process.exit(1);
});
server.listen(PORT, HOST, () => {
  console.log([
    '',
    '  iPhone 18 Pro Max — симулятор',
    `  Симулятор:   ${address}`,
    `  Приложение:  http://localhost:${PORT}/app/   (папка ${APP_DIR})`,
    '  Сохрани файл приложения — оно перезагрузится в телефоне само.',
    '  Остановить: Ctrl+C',
    '',
  ].join('\n'));
  openWindow(address);
});
