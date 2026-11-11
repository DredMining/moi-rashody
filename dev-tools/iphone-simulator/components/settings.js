// Настройки симулятора: значения по умолчанию, сохранение между запусками, оповещение об изменениях.
// Хранятся отдельным ключом; записи приложения (expenses-v1) симулятор не читает и не меняет.
const STORAGE_KEY = 'iphone-simulator:settings:v1';

export const COLORS = ['black', 'silver', 'glacier', 'burgundy'];

export const DEFAULTS = Object.freeze({
  view: 'device',          // device — телефон с корпусом, screen — только экран
  orientation: 'portrait', // portrait | landscape
  scale: 'auto',           // auto — вписать в окно, либо проценты 25…150
  color: 'black',
  island: true,
  theme: 'dark',           // оформление iPhone: dark | light
  timeOffset: null,        // null — настоящее время, либо сдвиг в минутах
  battery: 100,
  cell: 4,                 // деления сотовой сети, 0…4
  wifi: true,
  density3x: false,        // плотность пикселей 3x внутри экрана; выключена: с ней промахивается стрелка «Выбрать элемент»
  appUrl: '',              // пусто — адрес приложения ищется автоматически
  panel: true,
});

const VALID = {
  view: v => v === 'device' || v === 'screen',
  orientation: v => v === 'portrait' || v === 'landscape',
  scale: v => v === 'auto' || (Number.isFinite(v) && v >= 25 && v <= 150),
  color: v => COLORS.includes(v),
  island: v => typeof v === 'boolean',
  theme: v => v === 'dark' || v === 'light',
  timeOffset: v => v === null || (Number.isInteger(v) && Math.abs(v) < 1440),
  battery: v => Number.isInteger(v) && v >= 0 && v <= 100,
  cell: v => Number.isInteger(v) && v >= 0 && v <= 4,
  wifi: v => typeof v === 'boolean',
  density3x: v => typeof v === 'boolean',
  appUrl: v => typeof v === 'string' && v.length <= 300,
  panel: v => typeof v === 'boolean',
};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return Object.fromEntries(Object.entries(saved).filter(([key, value]) => VALID[key]?.(value)));
  } catch {
    return {};
  }
}

export function createSettings() {
  let state = { ...DEFAULTS, ...load() };
  const listeners = new Set();

  function set(patch) {
    const changed = Object.keys(patch).filter(key => VALID[key]?.(patch[key]) && state[key] !== patch[key]);
    if (!changed.length) return;
    state = { ...state, ...Object.fromEntries(changed.map(key => [key, patch[key]])) };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* без сохранения настройки живут до закрытия окна */ }
    listeners.forEach(listener => listener(state, changed));
  }

  return {
    get: key => state[key],
    all: () => ({ ...state }),
    set,
    reset: () => set({ ...DEFAULTS }),
    subscribe: listener => { listeners.add(listener); },
  };
}
