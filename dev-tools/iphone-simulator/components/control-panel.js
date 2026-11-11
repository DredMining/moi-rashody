// Панель настроек: связывает элементы управления с настройками и действиями симулятора.
import { localUrl } from './app-frame.js';

const byId = id => document.getElementById(id);
const CELL_LABELS = ['нет сети', '1 из 4', '2 из 4', '3 из 4', '4 из 4'];
const two = n => String(n).padStart(2, '0');

export function createControlPanel({ settings, actions }) {
  const sim = byId('sim'), panelToggle = byId('panelToggle');
  const urlInput = byId('appUrl'), urlNote = byId('urlNote');
  const scale = byId('scale'), scaleOut = byId('scaleOut'), scaleAuto = byId('scaleAuto');
  const timeInput = byId('timeInput'), timeNow = byId('timeNow');
  const narrow = matchMedia('(max-width: 860px)');
  let drawerOpen = false; // в узком окне панель открывается поверх сцены и по умолчанию убрана

  // группы кнопок «один из нескольких»: data-setting на группе, data-value на кнопке
  for (const group of document.querySelectorAll('[role="group"][data-setting]')) {
    group.addEventListener('click', event => {
      const button = event.target.closest('button[data-value]');
      if (!button) return;
      settings.set({ [group.dataset.setting]: button.dataset.value });
      // оформление применяется и при нажатии на уже выбранное: так возвращают вид после кнопки темы в самом приложении
      if (group.dataset.setting === 'theme') actions.forceTheme();
    });
  }
  for (const box of document.querySelectorAll('input[type="checkbox"][data-setting]')) {
    box.addEventListener('change', () => settings.set({ [box.dataset.setting]: box.checked }));
  }
  for (const range of document.querySelectorAll('input[type="range"][data-setting]')) {
    range.addEventListener('input', () => settings.set({ [range.dataset.setting]: Number(range.value) }));
  }

  scale.addEventListener('input', () => settings.set({ scale: Number(scale.value) }));
  scaleAuto.addEventListener('click', () => settings.set({ scale: 'auto' }));

  timeInput.addEventListener('change', () => actions.setTime(timeInput.value));
  timeNow.addEventListener('click', () => settings.set({ timeOffset: null }));

  // адрес приложения: пустое поле — искать автоматически
  function openUrl(text) {
    const url = text.trim() ? localUrl(text) : '';
    urlNote.hidden = !text.trim() || !!url;
    if (text.trim() && !url) return;
    if (settings.get('appUrl') === url) actions.connect(); else settings.set({ appUrl: url });
  }
  byId('urlForm').addEventListener('submit', event => { event.preventDefault(); openUrl(urlInput.value); });
  byId('urlAuto').addEventListener('click', () => { urlInput.value = ''; openUrl(''); });

  byId('reloadBtn').addEventListener('click', actions.reload);
  byId('quickReload').addEventListener('click', actions.reload);
  byId('islandDemo').addEventListener('click', () => actions.toggleIsland());
  byId('coverRetry').addEventListener('click', actions.connect);
  byId('resetBtn').addEventListener('click', () => { actions.toggleIsland(false); urlInput.value = ''; urlNote.hidden = true; settings.reset(); });

  function showPanel() {
    const open = narrow.matches ? drawerOpen : settings.get('panel');
    sim.dataset.panel = open ? 'open' : 'closed';
    panelToggle.setAttribute('aria-expanded', String(open));
  }
  panelToggle.addEventListener('click', () => {
    if (narrow.matches) { drawerOpen = !drawerOpen; showPanel(); } else settings.set({ panel: !settings.get('panel') });
  });
  narrow.addEventListener('change', () => { drawerOpen = false; showPanel(); });

  function render() {
    const state = settings.all();
    for (const group of document.querySelectorAll('[role="group"][data-setting]')) {
      for (const button of group.querySelectorAll('button[data-value]')) {
        button.setAttribute('aria-pressed', String(button.dataset.value === state[group.dataset.setting]));
      }
    }
    for (const box of document.querySelectorAll('input[type="checkbox"][data-setting]')) box.checked = state[box.dataset.setting];
    for (const range of document.querySelectorAll('input[type="range"][data-setting]')) range.value = state[range.dataset.setting];
    byId('batteryOut').textContent = `${state.battery}%`;
    byId('cellOut').textContent = CELL_LABELS[state.cell];
    scaleAuto.setAttribute('aria-pressed', String(state.scale === 'auto'));
    timeNow.setAttribute('aria-pressed', String(state.timeOffset === null));
    byId('islandDemo').disabled = !state.island;
    if (document.activeElement !== urlInput) urlInput.value = state.appUrl;
    showPanel();
  }

  return {
    render,
    // телефон пересчитал масштаб
    showScale(value) {
      const percent = Math.round(value * 100);
      scaleOut.textContent = settings.get('scale') === 'auto' ? `${percent}% · авто` : `${percent}%`;
      if (document.activeElement !== scale) scale.value = String(Math.max(25, Math.min(150, percent)));
    },
    // часы в строке состояния сменили минуту
    showTime(date) {
      if (document.activeElement !== timeInput) timeInput.value = `${two(date.getHours())}:${two(date.getMinutes())}`;
    },
    showIsland(expanded) { byId('islandDemo').textContent = expanded ? 'Свернуть' : 'Развернуть'; },
    showFacts(rows) {
      byId('facts').replaceChildren(...rows.flatMap(([name, text, mark]) => {
        const term = document.createElement('dt'), value = document.createElement('dd');
        term.textContent = name;
        value.textContent = text;
        if (mark) value.dataset.mark = mark;
        return [term, value];
      }));
    },
  };
}
