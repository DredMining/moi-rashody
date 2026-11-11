// Экран с приложением: поиск адреса, подключение, перезагрузка, слежение за файлами и сервером,
// плотность пикселей, оформление и отступы безопасной зоны.
// Файлы приложения не меняются: всё происходит только в открытой копии страницы.
import { DEVICE } from './device.js';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
// где обычно работает локальный сервер, если симулятор открыт не через свой server.js (Live Server)
const GUESSES = ['http://127.0.0.1:5500/index.html', 'http://localhost:5500/index.html'];
const SAFE_ENV = /env\(\s*safe-area-inset-(top|right|bottom|left)\s*(?:,[^()]*)?\)/g;
const SIDES = ['top', 'right', 'bottom', 'left'];
// «Мои расходы» запоминают тему, выбранную своей кнопкой, под этим ключом. Симулятор его только читает.
const APP_THEME_CHOICE = 'rashody-theme';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Адрес из поля ввода → полный локальный адрес, либо '' (чужие сайты и файлы с диска в экран не грузятся).
export function localUrl(text) {
  const raw = String(text || '').trim();
  if (!raw) return '';
  let url;
  try { url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `http://${raw}`); } catch { return ''; }
  const ok = LOCAL_HOSTS.has(url.hostname) && (url.protocol === 'http:' || url.protocol === 'https:') && !url.username && !url.password;
  return ok ? url.href : '';
}

// по этим заголовкам видно, что файл на сервере стал другим
const signature = headers => {
  const parts = ['etag', 'last-modified', 'content-length'].map(name => headers.get(name) || '');
  return parts.some(Boolean) ? parts.join('|') : '';
};

export function createAppFrame({ frame, settings, onChange }) {
  const info = {
    state: 'connecting', // connecting | ready | offline (сервер молчит, приложение открыто) | error
    reason: '',          // для error: not-found | bad-url | no-answer
    url: '',
    sameOrigin: false,   // приложение на том же адресе, что и симулятор: доступна полная имитация
    live: 'off',         // автообновление: on (свой сервер) | poll (проверка заголовков) | lost | off
    pending: false,      // файлы изменились, пока в приложении набирали текст
    safeArea: null,
    theme: '',           // как применено оформление: system | app (через data-theme) | own (тема выбрана в приложении) | none
  };
  let server = null, serverUp = true, boot = '';
  let attempt = 0, retryTimer = 0, reloadTimer = 0, events = null, pollTimer = 0, lastSignature = '';

  const emit = patch => { Object.assign(info, patch); onChange({ ...info }); };
  const pageDocument = () => {
    try {
      const doc = frame.contentDocument;
      return doc && doc.documentElement && doc.URL !== 'about:blank' ? doc : null;
    } catch { return null; }
  };

  async function reachable(url) {
    const control = new AbortController(), timer = setTimeout(() => control.abort(), 2500);
    try {
      // HEAD service worker приложения не перехватывает: отвечает именно сервер
      if (new URL(url).origin === location.origin) return (await fetch(url, { method: 'HEAD', cache: 'no-store', signal: control.signal })).ok;
      await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: control.signal });
      return true;
    } catch { return false; } finally { clearTimeout(timer); }
  }

  async function findApp() {
    if (!server) {
      try {
        const response = await fetch('/__sim/info', { cache: 'no-store' });
        const data = response.ok ? await response.json() : null;
        if (data?.name === 'iphone-simulator') server = data;
      } catch { /* страница открыта не через server.js */ }
    }
    if (server) return new URL(server.app, location.origin).href;
    const beside = new URL('../../index.html', location.href).href; // симулятор открыт прямо из папки проекта
    if (await reachable(beside)) return beside;
    for (const url of GUESSES) if (await reachable(url)) return url;
    return '';
  }

  // у приложения есть сохранённая копия (service worker): оно откроется и при остановленном сервере
  const savedCopy = async url => {
    try { return !!(await navigator.serviceWorker.getRegistration(url))?.active; } catch { return false; }
  };

  async function connect({ quiet = false } = {}) {
    const mine = ++attempt;
    clearTimeout(retryTimer);
    if (!quiet) emit({ state: 'connecting', reason: '' });
    const manual = settings.get('appUrl');
    const url = manual ? localUrl(manual) : await findApp();
    if (mine !== attempt) return;
    if (!url) return fail(manual ? 'bad-url' : 'not-found', '');
    const sameOrigin = new URL(url).origin === location.origin;
    const up = await reachable(url);
    if (mine !== attempt) return;
    if (!up && !(sameOrigin && await savedCopy(url))) return fail('no-answer', url);
    serverUp = up;
    emit({ state: 'connecting', reason: '', url, sameOrigin });
    frame.src = url;
    watch();
  }

  function fail(reason, url) {
    const mine = attempt;
    emit({ state: 'error', reason, url });
    // сервер запустят — подключение восстановится без нажатий
    if (reason !== 'bad-url') retryTimer = setTimeout(() => { if (mine === attempt) connect({ quiet: true }); }, 2500);
  }

  frame.addEventListener('load', () => {
    if (!info.url) return;
    const doc = pageDocument();
    // вместо приложения — страница ошибки браузера (сервер не ответил, сохранённой копии нет)
    if (info.sameOrigin && !doc) return fail('no-answer', info.url);
    if (doc) {
      emulateSafeArea(doc);
      // приложение перезагружает само себя (новая версия): экран прикрывается, пока отступы не встанут на место
      doc.defaultView.addEventListener('pagehide', () => emit({ state: 'connecting' }), { once: true });
    }
    emit({ state: serverUp ? 'ready' : 'offline', reason: '', pending: false, safeArea: doc ? insets() : null, theme: applyTheme() });
  });

  // ---- безопасная зона ----
  // В браузере на компьютере env(safe-area-inset-*) всегда 0. В открытой копии страницы каждое такое
  // выражение получает значение телефона: env(…) → var(--iphone-simulator-safe-…, env(…)). Сами правила
  // приложения остаются его собственными — отступы считаются по ним, а не по копии стилей в симуляторе.
  const insets = () => DEVICE.safeArea[settings.get('orientation')];
  function emulateSafeArea(doc) {
    for (const sheet of doc.querySelectorAll('style:not([data-iphone-simulator])')) {
      const css = sheet.textContent;
      if (!css.includes('safe-area-inset-')) continue;
      sheet.textContent = css.replace(SAFE_ENV, (found, side) => `var(--iphone-simulator-safe-${side},${found})`);
      sheet.dataset.iphoneSimulator = 'env';
    }
    let values = doc.getElementById('iphone-simulator-safe-area');
    if (!values) {
      values = doc.createElement('style');
      values.id = 'iphone-simulator-safe-area';
      values.dataset.iphoneSimulator = 'insets';
      doc.head.append(values);
    }
    const now = insets();
    values.textContent = `:root{${SIDES.map(side => `--iphone-simulator-safe-${side}:${now[side]}px`).join(';')}}`;
  }

  // ---- плотность пикселей и оформление ----
  // zoom увеличивает страницу в рамке до 3 физических пикселей на точку, обратный scale возвращает её
  // в размер экрана: внутри devicePixelRatio = 3 и ширина 440, как на телефоне.
  // По умолчанию выключено. При CSS zoom отладочный протокол Chrome (DOM.getBoxModel, getContentQuads) сообщает
  // место элемента внутри рамки делённым на zoom — ровно в 3 раза меньше и ближе к углу. Элемент находится
  // верно, но подсветка стрелки «Выбрать элемент» в панели Claude ложится на другое место (измерено 11.11.2026).
  function applyDensity() {
    const zoom = settings.get('density3x') ? DEVICE.screen.dpr / (window.devicePixelRatio || 1) : 1;
    frame.style.zoom = String(zoom);
    frame.style.transform = zoom === 1 ? '' : `scale(${1 / zoom})`;
  }
  // масштаб страницы браузера (Ctrl +/−) или другой монитор меняют плотность окна — пересчитываем
  function watchHostDensity() {
    matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener('change', () => {
      applyDensity();
      watchHostDensity();
      onChange({ ...info });
    }, { once: true });
  }
  // Оформление iPhone. Страница узнаёт его через prefers-color-scheme, но Chrome показывает рамке оформление
  // Windows и сменить его для одной рамки не даёт (проверено в Chrome 156). Поэтому, если приложение держит
  // выбранный вид в <html data-theme="dark|light"> (так делают «Мои расходы»), симулятор ставит этот признак
  // сам — так же, как приложение ставит его при смене оформления телефона. В хранилище ничего не пишется.
  // Тему, выбранную кнопкой в самом приложении, загрузка страницы не перебивает (на телефоне такой выбор
  // тоже главнее оформления); её меняет только явное нажатие в панели симулятора (force).
  function applyTheme(force = false) {
    const want = settings.get('theme'), doc = pageDocument();
    frame.style.colorScheme = want; // для браузеров, которые передают оформление в рамку
    if (!doc) return '';
    const root = doc.documentElement, own = root.getAttribute('data-theme');
    const system = doc.defaultView.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (own !== 'dark' && own !== 'light') return system === want ? 'system' : 'none';
    if (own === want) return system === want ? 'system' : 'app';
    let chosen = false;
    try { chosen = !!doc.defaultView.localStorage.getItem(APP_THEME_CHOICE); } catch { /* хранилище недоступно */ }
    if (chosen && !force) return 'own';
    root.setAttribute('data-theme', want);
    return 'app';
  }

  // ---- перезагрузка ----
  const typing = () => {
    const field = pageDocument()?.activeElement;
    return !!field && /^(INPUT|TEXTAREA)$/.test(field.tagName) && !/^(button|submit|checkbox|radio|range|file)$/.test(field.type) && field.value.trim() !== '';
  };

  // Service worker приложения сначала отдаёт сохранённую копию страницы и только потом обновляет её.
  // Чтобы после правки сразу показать новый файл, ждём, пока он обновит копию, и лишь затем перезагружаем.
  async function refreshSavedCopy(win) {
    if (!win.navigator.serviceWorker?.controller) return;
    const page = win.location.origin + win.location.pathname;
    const head = await fetch(page, { method: 'HEAD', cache: 'no-store' });
    const fresh = head.ok ? signature(head.headers) : '';
    if (!fresh) return;
    const saved = async () => {
      const hit = await caches.match(page, { ignoreSearch: true });
      return hit ? signature(hit.headers) : '';
    };
    if (await saved() === fresh) return;
    await win.fetch(page, { cache: 'no-store' }).then(response => response.text()).catch(() => {});
    for (const until = performance.now() + 4000; performance.now() < until; await sleep(100)) {
      if (await saved() === fresh) return;
    }
  }

  async function reload() {
    clearTimeout(reloadTimer);
    if (!info.url || info.state === 'error') return connect();
    emit({ state: 'connecting', pending: false });
    if (info.sameOrigin && pageDocument()) {
      const win = frame.contentWindow;
      await refreshSavedCopy(win).catch(() => {});
      try { win.location.reload(); return; } catch { /* страница успела смениться — открываем заново */ }
    }
    frame.src = info.url;
  }

  function filesChanged() {
    // набранное в форме не пропадёт: обновление ждёт кнопки
    if (typing()) return emit({ pending: true });
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(reload, 150);
  }

  // ---- слежение: свой сервер сообщает об изменениях сам, чужой опрашивается ----
  function serverBack() {
    serverUp = true;
    if (info.state === 'error') connect({ quiet: true }); else reload();
  }
  function serverLost() {
    serverUp = false;
    if (info.state === 'ready') emit({ state: 'offline' });
  }

  function listen() {
    events = new EventSource('/__sim/events');
    events.addEventListener('hello', event => {
      const next = JSON.parse(event.data).boot, restarted = !!boot && next !== boot;
      boot = next;
      emit({ live: 'on' });
      if (!serverUp || restarted || info.state === 'error') serverBack();
    });
    events.addEventListener('change', event => {
      if (JSON.parse(event.data).kind === 'simulator') location.reload(); else filesChanged();
    });
    events.onerror = () => {
      emit({ live: 'lost' });
      if (serverUp) serverLost();
      // браузер переподключается сам; если отказался — пробуем заново
      if (events.readyState === EventSource.CLOSED) { events = null; setTimeout(() => { if (!events) listen(); }, 3000); }
    };
  }

  async function poll() {
    if (!info.url || info.state === 'connecting' || info.state === 'error') return;
    const up = await reachable(info.url);
    if (up && !serverUp) return serverBack();
    if (!up && serverUp) return serverLost();
    if (!up || !info.sameOrigin) return;
    const head = await fetch(info.url, { method: 'HEAD', cache: 'no-store' }).catch(() => null);
    const now = head?.ok ? signature(head.headers) : '';
    if (lastSignature && now && now !== lastSignature) filesChanged();
    if (now) lastSignature = now;
  }

  function watch() {
    if (server) { if (!events) listen(); return; }
    if (!pollTimer) pollTimer = setInterval(poll, 2500);
    emit({ live: info.sameOrigin ? 'poll' : 'off' });
  }

  settings.subscribe((_state, changed) => {
    if (changed.includes('theme')) emit({ theme: applyTheme(true) });
    if (changed.includes('density3x')) applyDensity();
    if (changed.includes('orientation')) {
      const doc = pageDocument();
      if (doc) { emulateSafeArea(doc); emit({ safeArea: insets() }); }
    }
    if (changed.includes('appUrl')) connect();
  });

  applyTheme();
  applyDensity();
  watchHostDensity();

  return {
    connect, reload,
    forceTheme: () => emit({ theme: applyTheme(true) }), // повторное нажатие на уже выбранное оформление в панели
    info: () => ({ ...info }),
    document: pageDocument,
    window: () => (pageDocument() ? frame.contentWindow : null),
  };
}
