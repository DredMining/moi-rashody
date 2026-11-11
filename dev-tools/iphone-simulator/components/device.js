// Профиль устройства и размещение телефона на сцене: вид, ориентация, цвет корпуса, масштаб.

// Экран (440 × 956 pt, 3x = 1320 × 2868 px) и корпус 163,4 × 78,0 мм — iPhone 18 Pro Max.
// Отступы безопасной зоны, размер Dynamic Island и радиус углов для этой модели не опубликованы:
// взяты от iPhone 17 Pro Max с тем же экраном. Если на телефоне окажется иначе — поправить здесь.
export const DEVICE = Object.freeze({
  name: 'iPhone 18 Pro Max',
  screen: Object.freeze({ width: 440, height: 956, dpr: 3 }),
  border: 15, // от края корпуса до экрана, CSS px (совпадает с --border в simulator.css)
  safeArea: Object.freeze({
    portrait: Object.freeze({ top: 62, right: 0, bottom: 34, left: 0 }),
    landscape: Object.freeze({ top: 20, right: 62, bottom: 20, left: 62 }),
  }),
});

export function createDevice({ stage, scaler, device, settings, onScale }) {
  let scale = 1, queued = 0;

  // размер телефона (или одного экрана) при масштабе 1
  function boxSize() {
    const edge = settings.get('view') === 'device' ? DEVICE.border * 2 : 0;
    const { width, height } = DEVICE.screen;
    return settings.get('orientation') === 'landscape'
      ? { width: height + edge, height: width + edge }
      : { width: width + edge, height: height + edge };
  }

  function layout() {
    queued = 0;
    const box = boxSize(), pad = getComputedStyle(stage);
    const keys = settings.get('view') === 'device' ? 8 : 0; // кнопки выступают за корпус
    const freeW = stage.clientWidth - parseFloat(pad.paddingLeft) - parseFloat(pad.paddingRight) - keys;
    const freeH = stage.clientHeight - parseFloat(pad.paddingTop) - parseFloat(pad.paddingBottom) - keys;
    const fit = Math.min(freeW / box.width, freeH / box.height);
    const wanted = settings.get('scale');
    // «авто» вписывает телефон в окно, но не растягивает больше настоящего размера
    scale = Math.round((wanted === 'auto' ? Math.max(0.2, Math.min(1, fit)) : wanted / 100) * 1000) / 1000;
    scaler.style.width = `${box.width * scale}px`;
    scaler.style.height = `${box.height * scale}px`;
    device.style.setProperty('--scale', String(scale));
    onScale?.(scale);
  }

  function apply() {
    device.dataset.view = settings.get('view');
    device.dataset.orientation = settings.get('orientation');
    device.dataset.color = settings.get('color');
    device.dataset.island = settings.get('island') ? 'on' : 'off';
    layout();
  }

  // окно меняет размер — пересчёт один раз за кадр
  new ResizeObserver(() => { queued ||= requestAnimationFrame(layout); }).observe(stage);

  return { apply, scale: () => scale };
}
