// Системные элементы поверх экрана: строка состояния, Dynamic Island, полоска «Домой».
// Они только рисуются: время, заряд и сеть внутри приложения остаются настоящими.

const byId = id => document.getElementById(id);
const clockFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

export function createSystemUi({ settings, getDocument, onClock }) {
  const statusBar = byId('statusBar'), time = byId('sbTime'), cell = byId('sbCell'), net = byId('sbNet'), wifi = byId('sbWifi');
  const battery = byId('sbBattery'), batteryNum = byId('sbBatteryNum'), home = byId('homeIndicator'), island = byId('island');
  let clockTimer = 0;

  // ---- время: настоящее или сдвинутое на заданное число минут; дальше идёт само ----
  const shownTime = () => new Date(Date.now() + (settings.get('timeOffset') || 0) * 60000);
  function tick() {
    clearTimeout(clockTimer);
    const now = shownTime();
    time.textContent = clockFormat.format(now);
    time.dateTime = now.toISOString();
    onClock?.(now);
    clockTimer = setTimeout(tick, 60000 - (Date.now() % 60000) + 20); // ровно в начале следующей минуты
  }
  // «14:30» → сдвиг от настоящего времени в минутах
  function setTime(text) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(text || '');
    if (!match) return;
    const real = new Date(), wanted = Number(match[1]) * 60 + Number(match[2]);
    let offset = wanted - (real.getHours() * 60 + real.getMinutes());
    if (offset > 720) offset -= 1440; else if (offset <= -720) offset += 1440;
    settings.set({ timeOffset: offset });
  }

  function render() {
    const level = settings.get('battery'), bars = settings.get('cell'), wifiOn = settings.get('wifi');
    battery.style.setProperty('--level', String(level / 100));
    battery.toggleAttribute('data-low', level <= 20);
    batteryNum.textContent = String(level);
    [...cell.children].forEach((bar, i) => bar.classList.toggle('off', i >= bars));
    wifi.toggleAttribute('hidden', !wifiOn);
    net.hidden = wifiOn || bars === 0; // без Wi‑Fi рядом с делениями пишется тип сотовой сети
    tick();
  }

  // ---- Dynamic Island: компактный ↔ развёрнутый ----
  const islandExpanded = () => island.getAttribute('aria-expanded') === 'true';
  function toggleIsland(force) {
    const expanded = force ?? !islandExpanded();
    island.setAttribute('aria-expanded', String(expanded));
    island.setAttribute('aria-label', expanded ? 'Dynamic Island: свернуть' : 'Dynamic Island: развернуть');
    island.dispatchEvent(new CustomEvent('islandchange', { bubbles: true, detail: { expanded } }));
  }
  island.addEventListener('click', () => toggleIsland());

  // ---- цвет значков под фон приложения ----
  // белые значки на тёмном фоне, чёрные на светлом — по цвету того, что сейчас под ними
  function toneAt(doc, x, y) {
    for (let el = doc.elementFromPoint(x, y); el; el = el.parentElement) {
      const color = doc.defaultView.getComputedStyle(el).backgroundColor;
      const rgb = color.startsWith('rgb') ? color.match(/[\d.]+/g) : null;
      if (!rgb || (rgb.length > 3 && Number(rgb[3]) < 0.5)) continue;
      return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255 > 0.6 ? 'dark' : 'light';
    }
    return 'light';
  }
  function updateTones() {
    const doc = getDocument();
    if (!doc || document.hidden) return;
    const view = doc.defaultView;
    try {
      home.dataset.tone = toneAt(doc, view.innerWidth / 2, view.innerHeight - 10);
      // приложение с экрана «Домой» само выбирает вид строки состояния; black-translucent — белые значки поверх страницы
      const style = doc.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.content;
      statusBar.dataset.tone = style === 'black-translucent' || style === 'black' ? 'light' : toneAt(doc, view.innerWidth / 2, 6);
    } catch { /* страница сменилась во время проверки */ }
  }
  setInterval(updateTones, 2000);

  return { render, setTime, shownTime, toggleIsland, islandExpanded, updateTones };
}
