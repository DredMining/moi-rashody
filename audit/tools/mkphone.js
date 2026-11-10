// Builds audit/preview/phone.html from iphone.html (read-only source): burgundy frame, paths two levels up.
const fs = require('fs');
let s = fs.readFileSync(process.argv[2], 'utf8');
const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
const rep = (a, b, all) => { if (!s.includes(a)) throw new Error('не найдено: ' + a.slice(0, 60)); s = all ? s.split(a).join(b) : s.replace(a, b); };
rep('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- Копия iphone.html для аудита стиля: рамка iPhone 18 Pro Max в бордовом цвете.\n     Размеры экрана (440×956) и системные отступы (62 px сверху, 34 px снизу) оставлены как в iphone.html (iPhone 17 Pro Max) — это допущение.\n     Внутри работает настоящее приложение ../../index.html; его данные рамка не читает и не меняет. Сам iphone.html не изменён. -->');
rep('<title>iPhone 17 Pro Max — Silver</title>', '<title>iPhone 18 Pro Max — Burgundy · «Мои расходы»</title>');
rep('href="./icon.svg"', 'href="../../icon.svg"');
rep(`      background:
        linear-gradient(118deg, transparent 0 2.6%, rgb(255 255 255 / 82%) 3%, rgb(255 255 255 / 18%) 3.35%, transparent 4.2% 65%, rgb(255 255 255 / 22%) 77%, transparent 89%),
        linear-gradient(90deg,
          #5f6468 0%, #c8ccce 1.6%, #f7f8f7 3.2%, #a2a7aa 5.2%, #f6f7f6 11%,
          #d7dadb 16%, #9da2a5 42%, #e9ebea 68%, #aeb3b6 84%, #f2f3f2 94%, #686d71 100%),
        linear-gradient(180deg, #f6f7f6, #8e9397 48%, #eff0ef);`,
`      background:
        linear-gradient(118deg, transparent 0 2.6%, rgb(255 226 232 / 50%) 3%, rgb(255 226 232 / 12%) 3.35%, transparent 4.2% 65%, rgb(255 226 232 / 13%) 77%, transparent 89%),
        linear-gradient(90deg,
          #2c0a12 0%, #6d1c2e 1.6%, #a23a52 3.2%, #5b1626 5.2%, #8f2c44 11%,
          #74203a 16%, #4a101f 42%, #842840 68%, #561424 84%, #93304a 94%, #2e0b13 100%),
        linear-gradient(180deg, #8c2a42, #43101c 48%, #862840);`);
rep('inset 0 1px 1px rgb(255 255 255 / 98%),\n        inset 0 -2px 6px rgb(33 37 40 / 78%);', 'inset 0 1px 1px rgb(255 214 222 / 45%),\n        inset 0 -2px 6px rgb(25 5 10 / 78%);');
rep(`      border: 1px solid rgb(255 255 255 / 66%);
      border-radius: inherit;
      box-shadow:
        inset 0 0 0 1px rgb(71 76 80 / 48%),
        inset 0 2px 4px rgb(255 255 255 / 72%),
        inset 0 -3px 8px rgb(48 52 56 / 46%);`,
`      border: 1px solid rgb(255 220 228 / 32%);
      border-radius: inherit;
      box-shadow:
        inset 0 0 0 1px rgb(40 10 17 / 55%),
        inset 0 2px 4px rgb(255 220 228 / 28%),
        inset 0 -3px 8px rgb(30 6 12 / 55%);`);
rep('border: 1px solid rgb(68 73 77 / 42%);', 'border: 1px solid rgb(40 10 17 / 50%);');
rep('background: linear-gradient(142deg, rgb(255 255 255 / 23%), transparent 9% 87%, rgb(255 255 255 / 12%));', 'background: linear-gradient(142deg, rgb(255 226 232 / 16%), transparent 9% 87%, rgb(255 226 232 / 8%));');
rep(`      border: 1px solid rgb(75 80 84 / 68%);
      background: linear-gradient(90deg, #666b6f 0%, #d6d9da 22%, #fbfcfb 43%, #a5aaad 74%, #74797d 100%);
      box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 80%),
        inset 0 -1px 1px rgb(35 39 42 / 35%),`,
`      border: 1px solid rgb(40 10 17 / 80%);
      background: linear-gradient(90deg, #3a0d18 0%, #7d2238 22%, #a84560 43%, #5c1727 74%, #3f0f1b 100%);
      box-shadow:
        inset 0 1px 0 rgb(255 220 228 / 40%),
        inset 0 -1px 1px rgb(25 5 10 / 45%),`);
rep('background: rgb(255 255 255 / 68%);\n      content: "";', 'background: rgb(255 220 228 / 35%);\n      content: "";');
rep('background: linear-gradient(270deg, #777c80, #f6f7f6 42%, #9ea3a6 100%);', 'background: linear-gradient(270deg, #45111e, #9c3852 42%, #5a1626 100%);');
rep('background: linear-gradient(270deg, #666b6f 0%, #d6d9da 22%, #fbfcfb 43%, #a5aaad 74%, #74797d 100%);', 'background: linear-gradient(270deg, #3a0d18 0%, #7d2238 22%, #a84560 43%, #5c1727 74%, #3f0f1b 100%);');
rep('line-height: 1.2;\n      white-space: nowrap;', 'line-height: 1.2;\n      min-width: 0;\n      padding-right: 10px;\n      white-space: normal;');
rep('src="./index.html"', 'src="../../index.html"');
rep('iPhone 17 Pro Max Silver', 'iPhone 18 Pro Max Burgundy', true);
rep('new URL("./index.html", location.href)', 'new URL("../../index.html", location.href)');
rep('fetch(`./index.html?simulator-check=', 'fetch(`../../index.html?simulator-check=');
rep(`          : "Для автообновления откройте через localhost";`, `          : "Для автообновления откройте через localhost";
      // what the frame stands for: the screen size and the insets are those of iphone.html (an assumption for the 18 Pro Max)
      refreshMode.textContent += " · 18 Pro Max: экран 440×956, отступы 62 / 34 px (допущение)";`);
// строка состояния и Dynamic Island — по снимку с телефона владельца (1320×2868 px): часы и значки ниже и крупнее, чем в iphone.html
rep(`      top: 1.72%;
      left: 6.6%;
      font-size: 12px;
      font-size: 2.75cqi;`, `      top: 2.45%;
      left: 15.1%;
      font-size: 17px;
      font-size: 3.85cqi;`);
rep(`      top: 1.57%;
      right: 6.1%;
      display: flex;
      align-items: center;
      gap: 1.15cqi;
      height: 12px;
      height: 2.65cqi;`, `      top: 2.66%;
      right: 10.1%;
      display: flex;
      align-items: center;
      gap: 1.5cqi;
      height: 13px;
      height: 2.95cqi;`);
rep(`      top: 1.1%;
      left: 50%;
      width: 26.3%;
      height: 3.55%;`, `      top: 1.45%;
      left: 50%;
      width: 28.2%;
      height: 3.85%;`);
// этап 5: макеты в той же рамке и переключатель вариантов
rep('  </style>', `
    /* аудит, этап 5: переключатель «Сейчас / А / Б / В» (появляется при ?page=…) */
    .variant-switch { display: flex; gap: 4px; margin-right: 6px; }
    .variant-switch .tool-button { width: auto; min-width: 38px; padding: 0 11px; }
    .simulator-toolbar.has-variants .refresh-mode { display: none; }
    .simulator-toolbar.has-variants { justify-content: center; }
  </style>`);
rep('</body>', `  <script>
    // Аудит, этап 5: phone.html?page=uchet.html показывает в рамке макет вместо приложения.
    // Кнопки «Сейчас / А / Б / В»: «Сейчас» — настоящее приложение, остальные — варианты макета. Данные приложения не читаются и не меняются.
    (() => {
      const params = new URLSearchParams(location.search);
      const page = params.get("page") || "";
      if (!/^[a-z0-9-]+\\.html$/.test(page)) return; // только файл из этой же папки
      const frame = document.querySelector(".app-frame");
      const toolbar = document.querySelector(".simulator-toolbar");
      const extra = params.get("sheet") === "1" ? "&sheet=1" : "";
      const box = document.createElement("div");
      box.className = "variant-switch";
      box.setAttribute("role", "group");
      box.setAttribute("aria-label", "Вариант оформления");
      const show = (v) => {
        frame.src = v === "now" ? "../../index.html" : \`./\${page}?v=\${v}\${extra}\`;
        box.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
      };
      [["now", "Сейчас"], ["a", "А"], ["b", "Б"], ["c", "В"]].forEach(([v, label]) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "tool-button"; b.dataset.v = v; b.textContent = label;
        b.addEventListener("click", () => show(v));
        box.append(b);
      });
      toolbar.classList.add("has-variants");
      document.querySelector(".toolbar-actions").prepend(box);
      show(/^(now|a|b|c)$/.test(params.get("v") || "") ? params.get("v") : "a");
    })();
  </script>
</body>`);
fs.mkdirSync(require('path').dirname(process.argv[3]), { recursive: true });
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync(process.argv[3], s);
console.log('ok, ' + s.length + ' байт; осталось упоминаний «17 Pro Max»: ' + (s.match(/17 Pro Max/g) || []).length);
