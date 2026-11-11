// Симулятор iPhone 18 Pro Max: собирает части вместе.
//   settings       — настройки и их сохранение
//   device         — корпус на сцене: вид, ориентация, цвет, масштаб
//   app-frame      — экран с приложением: подключение, перезагрузка, имитация среды телефона
//   system-ui      — строка состояния и Dynamic Island
//   control-panel  — панель настроек
import { createSettings } from './components/settings.js';
import { DEVICE, createDevice } from './components/device.js';
import { createAppFrame } from './components/app-frame.js';
import { createSystemUi } from './components/system-ui.js';
import { createControlPanel } from './components/control-panel.js';

const byId = id => document.getElementById(id);
byId('bootNote').hidden = true; // подсказка «запусти через сервер» нужна, только если скрипт не стартовал

const settings = createSettings();
let monitorHz = 0;

const app = createAppFrame({ frame: byId('appFrame'), settings, onChange: showConnection });
const system = createSystemUi({ settings, getDocument: app.document, onClock: date => panel?.showTime(date) });
const panel = createControlPanel({
  settings,
  actions: { connect: () => app.connect(), reload: () => app.reload(), forceTheme: () => app.forceTheme(), setTime: system.setTime, toggleIsland: system.toggleIsland },
});
const device = createDevice({
  stage: byId('stage'), scaler: byId('scaler'), device: byId('device'), settings,
  onScale: scale => panel.showScale(scale),
});

// ---- состояние подключения: метка над телефоном и заставка на экране ----
const ERRORS = {
  'not-found': ['Приложение не найдено', 'Запусти симулятор командой node dev-tools/iphone-simulator/server.js или укажи адрес приложения в настройках.'],
  'bad-url': ['Адрес не подходит', 'Можно открыть только локальный адрес: localhost или 127.0.0.1.'],
  'no-answer': ['Сервер не отвечает', 'Запусти локальный сервер — подключусь сам, как только он ответит.'],
};
const errorText = info => (info.reason === 'no-answer' && info.url ? `Нет ответа от ${info.url.replace(/^https?:\/\//, '')}. ` : '') + ERRORS[info.reason][1];
const LIVE_NOTES = {
  on: 'Автообновление включено: сохрани файл — приложение перезагрузится.',
  poll: 'Автообновление: раз в 2,5 секунды проверяю, изменился ли файл приложения.',
  lost: 'Сервер остановлен. Запустится — подключусь сам.',
  off: 'Автообновления нет: приложение открыто с другого адреса. Обновляй кнопкой.',
};

function showConnection(info) {
  const chip = byId('chip'), cover = byId('cover');
  const where = info.url ? info.url.replace(/^https?:\/\//, '') : '';
  const worker = !!app.window()?.navigator.serviceWorker?.controller;
  const label = info.pending ? 'Файлы изменились — нажми «Перезагрузить»'
    : info.state === 'ready' ? `Подключено · ${where}`
    : info.state === 'offline' ? (worker ? 'Сервер остановлен · приложение работает из сохранённой копии' : 'Сервер остановлен · жду запуска')
    : info.state === 'error' ? ERRORS[info.reason][0]
    : 'Подключение…';
  chip.dataset.state = info.pending ? 'pending' : info.state;
  byId('chipText').textContent = label;
  cover.dataset.state = info.state;
  if (info.state === 'error') {
    byId('coverTitle').textContent = ERRORS[info.reason][0];
    byId('coverText').textContent = errorText(info);
  }
  byId('liveNote').textContent = LIVE_NOTES[info.live];
  for (const id of ['reloadBtn', 'quickReload']) byId(id).dataset.pending = String(info.pending);
  if (info.state === 'ready' || info.state === 'offline') system.updateStatusTone();
  showFacts();
}

// ---- что на самом деле получает приложение (измерено в его окне, а не заявлено) ----
function showFacts() {
  const info = app.info(), win = app.window(), rows = [];
  if (win) {
    const landscape = settings.get('orientation') === 'landscape';
    const wantW = landscape ? DEVICE.screen.height : DEVICE.screen.width, wantH = landscape ? DEVICE.screen.width : DEVICE.screen.height;
    const width = win.innerWidth, height = win.innerHeight, dpr = win.devicePixelRatio;
    const themeName = settings.get('theme') === 'dark' ? 'тёмное' : 'светлое';
    rows.push(['Область просмотра', `${width} × ${height}`, width === wantW && height === wantH ? 'ok' : 'warn']);
    rows.push(['Плотность (DPR)', String(Math.round(dpr * 100) / 100) + (settings.get('density3x') ? '' : ' · как у монитора'), '']);
    rows.push(['Пиксели экрана', `${Math.round(width * dpr)} × ${Math.round(height * dpr)}`, '']);
    const safe = info.safeArea;
    rows.push(['Безопасная зона', safe ? `↑${safe.top} →${safe.right} ↓${safe.bottom} ←${safe.left}` : 'нет', safe ? 'ok' : 'warn']);
    rows.push(info.theme === 'none' ? ['Оформление', 'как в Windows: приложение не переключается', 'warn']
      : info.theme === 'own' ? ['Оформление', 'тема выбрана в самом приложении', '']
      : ['Оформление', info.theme === 'app' ? `${themeName} · data-theme` : themeName, 'ok']);
    rows.push(['Service worker', win.navigator.serviceWorker?.controller ? 'работает' : 'не запущен', '']);
    rows.push(['Касания', win.navigator.maxTouchPoints > 0 ? 'сенсорный экран' : 'мышь', '']);
  } else if (info.url && info.state !== 'connecting' && info.state !== 'error') {
    rows.push(['Приложение', 'на другом адресе: измерить нельзя', 'warn']);
    rows.push(['Безопасная зона', 'не имитируется', 'warn']);
  }
  rows.push(['Монитор', monitorHz ? `${monitorHz} Гц` : 'измеряю…', '']);
  panel.showFacts(rows);
}

// Частота обновления монитора: с ней идут анимации в симуляторе. У телефона до 120 Гц — здесь быстрее монитора не будет.
function measureMonitor() {
  const stamps = [];
  const step = now => {
    stamps.push(now);
    if (stamps.length <= 60) return requestAnimationFrame(step);
    const gaps = stamps.slice(1).map((stamp, i) => stamp - stamps[i]).sort((a, b) => a - b);
    const raw = 1000 / gaps[gaps.length >> 1];
    const known = [30, 48, 50, 60, 72, 75, 90, 100, 120, 144, 165, 240].find(hz => Math.abs(hz - raw) / hz < 0.05);
    monitorHz = known || Math.round(raw);
    showFacts();
  };
  if (document.hidden) document.addEventListener('visibilitychange', () => requestAnimationFrame(step), { once: true });
  else requestAnimationFrame(step);
}

// ---- настройки изменились ----
function renderAll() {
  device.apply();
  system.render();
  panel.render();
  showFacts();
}
settings.subscribe((_state, changed) => {
  if (!settings.get('island')) system.toggleIsland(false);
  renderAll();
  // оформление и ориентация меняют страницу приложения не мгновенно — перечитываем чуть позже
  if (changed.some(key => key === 'theme' || key === 'orientation' || key === 'density3x')) setTimeout(() => { system.updateStatusTone(); showFacts(); }, 350);
});
byId('island').addEventListener('islandchange', event => panel.showIsland(event.detail.expanded));

renderAll();
measureMonitor();
app.connect();
