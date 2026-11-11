# iOS-подобные UI-фреймворки и CSS-наборы в стиле Apple для готового PWA без сборки

Дата проверки всех цифр: **11.11.2026**. Методика: GitHub REST API без авторизации (`api.github.com/repos/...`, `api.github.com/search/repositories`), реестр npm (`registry.npmjs.org`), API jsDelivr (списки файлов и размеры), `raw.githubusercontent.com` (README, CHANGELOG, исходники), официальные документации, JSON-версии страниц Apple HIG, блог WebKit, данные совместимости MDN (browser-compat-data, ветка `main`). Сжатые размеры (gzip / brotli) — собственный замер: длина ответа jsDelivr с заголовком `Accept-Encoding: gzip` / `br`. Звёзды — значение `stargazers_count` на день проверки. «НЕ ПРОВЕРЕНО» — значит, первичный источник сегодня не открывался или не дал ответа. Дословных цитат намеренно почти нет — всё пересказано; значения CSS, имена классов и версии приведены как есть.

## 0. Сводная таблица и вердикты

### Takeaway
Ни один фреймворк не годится для подключения целиком к готовому одностраничному приложению без сборки: Framework7, Ionic и Onsen UI требуют собственной разметки страниц и инициализации, Konsta UI — Tailwind и React/Vue/Svelte. Разумный путь — взять значения и приёмы (Framework7 v9 «iOS 26», Puppertino 2.0, Ionic iOS-mode) и воссоздать элементы вручную; из готового кода имеет смысл рассматривать только точечные вещи: отдельные SVG из Ionicons или Framework7 Icons (оба MIT) и, по желанию, Cupertino Pane для нижнего листа.

### Cited Findings

**Основные кандидаты**

| Проект | Лицензия | Версия и дата релиза | Звёзды | Последний push | Статус | Размер | Без сборки | Вердикт |
|---|---|---|---|---|---|---|---|---|
| Framework7 | MIT | 9.3.0 — 30.10.2026 (npm, CHANGELOG); на GitHub «Latest release» ещё v9.2.0 от 28.09.2026 | 18 774 | 30.10.2026 | активен | `framework7-bundle.min.css` 485 792 Б (gzip 71 935), `framework7-bundle.min.js` 808 365 Б (gzip 209 995); пакет npm 14,79 МБ | да: один CSS + один JS | **не использовать** — навязывает структуру `#app > .view > .page`, свой роутер и инициализацию; суммарно больше самого приложения. **Взять значения** iOS-26-темы |
| Framework7 Icons | MIT | 5.0.5 — 12.10.2021 | 231 | 03.03.2025 | медленный (релизов с 2021 нет) | 1 252 отдельных SVG (в среднем ≈ 1,5 КБ) либо шрифт woff2 107 416 Б + CSS 872 Б; пакет 13,35 МБ | да (скопировать SVG или шрифт + CSS) | **можно использовать выборочно** — отдельные SVG в разметку; шрифт целиком не подключать; набор не обновлялся с 2021 |
| Ionic (`@ionic/core`) | MIT | 9.0.10 — 28.10.2026 (9.0.0 — 19.08.2026) | 52 752 | 11.11.2026 | активен | загрузчик `ionic.esm.js` 25 424 Б (gzip 6 314) + 97 JS-чанков в `dist/ionic` суммарно 1 135 139 Б + `ionic.bundle.css` 38 657 Б (gzip 6 119); пакет 20,86 МБ | да: `<script type="module">` + CSS | **не использовать** — веб-компоненты с Shadow DOM, каркас `ion-app`/`ion-content`, глобальные normalize/structure-стили, ленивые чанки усложняют офлайн-кэш; про iOS 26 в v9 ничего нет |
| Ionicons | MIT | 8.1.0 — 28.07.2026 | 18 245 | 28.07.2026 | поддерживается | 1 357 отдельных SVG в `dist/svg` (`home.svg` 633 Б); пакет 6,21 МБ | да (скопировать нужные SVG) | **использовать выборочно** — вставлять отдельные SVG прямо в HTML |
| Konsta UI | MIT | 5.5.0 — 28.09.2026 (5.0.0 — 18.08.2025) | 4 289 | 15.10.2026 | активен | пакет 1,32 МБ | **нет**: Tailwind CSS + React/Vue/Svelte | **не использовать**; подсмотреть `styles/glass.css` (2 660 Б) |
| Onsen UI | Apache-2.0 (по npm; GitHub лицензию не определяет, файла LICENSE в корне нет) | 2.12.9 — 16.06.2026 (предыдущий 2.12.8 — 27.12.2022) | 8 852 | 17.06.2026 | медленный, режим поддержки | `onsenui.min.js` 298 020 Б (gzip 69 454) + `onsen-css-components.min.css` 154 287 Б (gzip 20 731) | да | **не использовать** — свои элементы `ons-*`, «плоский» iOS-стиль до Liquid Glass, 3,5 года без релизов |
| Puppertino | MIT | 2.0.0 «Dachshund» — 06.10.2026 (старый пакет `puppertino` 1.5.1 — 23.04.2021) | 1 211 | 31.10.2026 | активен, один автор | `puppertino.min.css` 413 219 Б (gzip 59 396); `puppertino-mobile.min.css` 383 965 Б (gzip 55 037); отдельные файлы компонентов 0,5–108 КБ | да: чистый CSS, JS-помощники необязательны | **взять идеи и токены** (цвета, материалы, размеры); целиком не подключать — 55–59 КБ gzip CSS и риск пересечений |
| Cupertino Pane (`tech-systems/panes`, бывш. `roman-rr/cupertino-pane`) | MIT | 1.5.4 — 27.08.2025 | 728 | 26.02.2026 | медленный | `cupertino-pane.min.js` 67 004 Б (gzip 14 945), без зависимостей | да (UMD-файл) | **можно использовать точечно** для нижнего листа с перетаскиванием; иначе взять идеи |

Источники строк: Framework7 — [GitHub API](https://api.github.com/repos/framework7io/framework7), [npm](https://registry.npmjs.org/framework7), [CHANGELOG](https://raw.githubusercontent.com/framework7io/framework7/master/CHANGELOG.md), [latest release](https://api.github.com/repos/framework7io/framework7/releases/latest), [файлы](https://data.jsdelivr.com/v1/packages/npm/framework7@9.3.0?structure=flat). Framework7 Icons — [GitHub API](https://api.github.com/repos/framework7io/framework7-icons), [npm](https://registry.npmjs.org/framework7-icons), [файлы](https://data.jsdelivr.com/v1/packages/npm/framework7-icons@5.0.5?structure=flat). Ionic — [GitHub API](https://api.github.com/repos/ionic-team/ionic-framework), [npm](https://registry.npmjs.org/@ionic%2Fcore), [файлы](https://data.jsdelivr.com/v1/packages/npm/@ionic/core@9.0.10?structure=flat), [releases](https://github.com/ionic-team/ionic-framework/releases). Ionicons — [GitHub API](https://api.github.com/repos/ionic-team/ionicons), [npm](https://registry.npmjs.org/ionicons), [файлы](https://data.jsdelivr.com/v1/packages/npm/ionicons@8.1.0?structure=flat). Konsta — [GitHub API](https://api.github.com/repos/konstaui/konsta), [npm](https://registry.npmjs.org/konsta), [сайт](https://konstaui.com/). Onsen — [GitHub API](https://api.github.com/repos/OnsenUI/OnsenUI), [npm](https://registry.npmjs.org/onsenui), [latest release](https://api.github.com/repos/OnsenUI/OnsenUI/releases/latest), [корень репозитория](https://api.github.com/repos/OnsenUI/OnsenUI/contents/). Puppertino — [GitHub API](https://api.github.com/repos/codedgar/Puppertino), [npm](https://registry.npmjs.org/@codedgar%2Fpuppertino), [старый пакет](https://registry.npmjs.org/puppertino), [файлы](https://data.jsdelivr.com/v1/packages/npm/@codedgar/puppertino@2.0.0?structure=flat). Cupertino Pane — [GitHub API](https://api.github.com/repos/tech-systems/panes), [npm](https://registry.npmjs.org/cupertino-pane), [файл](https://cdn.jsdelivr.net/npm/cupertino-pane@1.5.4/dist/cupertino-pane.min.js).

**Найденные поиском по GitHub наборы «под iOS 26/27» и Liquid Glass**

| Проект | Лицензия | Версия / дата | Звёзды | Push | Что это | Без сборки | Вердикт |
|---|---|---|---|---|---|---|---|
| `webview-native-ui/ionic-theme-ios27` (npm `@rdlabo/ionic-theme-ios27`, прежде `@rdlabo/ionic-theme-ios26`) | MIT | `ios27` 2.1.3 — 11.11.2026; `ios26` 9.4.3 — 11.11.2026 | 176 | 11.11.2026 | тема поверх Ionic: iOS 26/27, Liquid Glass | только вместе с Ionic | **не использовать** (тянет Ionic); полезна как образец значений |
| `kitlangton/ios-kit` | MIT | 0.1.0 в `package.json`; в npm пакета нет (404) | 7 | 11.10.2026 (создан в тот же день) | прототипный набор iOS 26: рамка телефона, стекло, листы, меню; ES-модуль + CSS | да | **взять идеи**; слишком молодой |
| `JUNGHERZ/GlassKit` (npm `@jungherz-de/glasskit`) | MIT | 1.40.0 — 04.11.2026 (54 версии с 21.03.2026) | 16 | 04.11.2026 | CSS-библиотека «стеклянных» компонентов, вдохновлена iOS 26 | да: один CSS, `glasskit.min.css` 138 256 Б | **взять идеи**; это glassmorphism, а не набор iOS-контролов |
| `mikhailmogilnikov/fluid-kit` (npm `@fluidkit/core`) | MIT | 2.0.0 — 01.11.2026 | 2 | 04.11.2026 | жесты и анимации iOS 26, стекло на CSS | ESM-пакет; `dist/style.css` 20 611 Б, `dist/index.js` 183 479 Б | **взять идеи** |
| `rdev/liquid-glass-react` | MIT | 1.1.1 — 11.06.2025 | 6 662 | 13.06.2025 | React-компонент; в README предупреждение, что в Safari и Firefox смещение не видно | нет (React) | **не использовать** |
| `shuding/liquid-glass` | MIT | — | 1 228 | 26.03.2026 | скрипт-демо на SVG-фильтрах | да (один JS) | **взять идеи**; поддержка Safari не заявлена |
| `lucasromerodb/liquid-glass-effect-macos` | **лицензии нет** | — | 826 | 10.06.2025 | демо на CSS + SVG-фильтре | да | **не копировать код** (нет лицензии) |
| `VII-Cae/hyalite--liquid-glass` | MIT | — | 265 | 11.09.2026 (создан 07.09.2026) | преломление через `backdrop-filter: url()`; README: работает в Chromium, остальным — обычное размытие | да | **взять идеи** |
| `nikdelvin/liquid-glass` | MIT | — | 116 | 24.12.2025 | компоненты Astro; README: в Safari автоматический откат к простому размытию | нет (Astro) | **взять идеи** |

Источники: [ionic-theme-ios27](https://api.github.com/repos/webview-native-ui/ionic-theme-ios27), [npm](https://registry.npmjs.org/@rdlabo%2Fionic-theme-ios26), [README](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/main/README.md); [ios-kit](https://api.github.com/repos/kitlangton/ios-kit), [README](https://raw.githubusercontent.com/kitlangton/ios-kit/main/README.md), [npm 404](https://registry.npmjs.org/@kitlangton%2Fios-kit); [GlassKit](https://api.github.com/repos/JUNGHERZ/GlassKit), [npm](https://registry.npmjs.org/@jungherz-de%2Fglasskit), [файлы](https://data.jsdelivr.com/v1/packages/npm/@jungherz-de/glasskit@1.40.0?structure=flat); [fluid-kit](https://api.github.com/repos/mikhailmogilnikov/fluid-kit), [npm](https://registry.npmjs.org/@fluidkit%2Fcore), [файлы](https://data.jsdelivr.com/v1/packages/npm/@fluidkit/core@2.0.0?structure=flat); [liquid-glass-react](https://api.github.com/repos/rdev/liquid-glass-react), [README](https://raw.githubusercontent.com/rdev/liquid-glass-react/master/README.md); [shuding](https://api.github.com/repos/shuding/liquid-glass); [lucasromerodb](https://api.github.com/repos/lucasromerodb/liquid-glass-effect-macos), [корень](https://api.github.com/repos/lucasromerodb/liquid-glass-effect-macos/contents/); [hyalite](https://api.github.com/repos/VII-Cae/hyalite--liquid-glass), [README](https://raw.githubusercontent.com/VII-Cae/hyalite--liquid-glass/main/README.md); [nikdelvin](https://raw.githubusercontent.com/nikdelvin/liquid-glass/main/README.md).

**Кандидаты из списка, не относящиеся к iOS-стилю (все — «не использовать»)**

| Проект | Лицензия | Версия npm | Звёзды | Push | Почему нет |
|---|---|---|---|---|---|
| `nolimits4web/swiper` | MIT | 14.4.0 | 41 911 | 30.10.2026 | карусель, не про стиль iOS |
| `saadeghi/daisyui` | MIT | 5.7.50 | 42 807 | 09.11.2026 | плагин Tailwind, не iOS |
| `shoelace-style/shoelace` | MIT | 2.20.1 | 13 820 | 14.05.2026 | **репозиторий в архиве**, преемник — Web Awesome |
| `shoelace-style/webawesome` | MIT | 3.14.0 | 1 391 | 10.11.2026 | веб-компоненты общего назначения, не iOS |
| `youzan/vant` | MIT | 4.10.2 | 24 425 | 10.11.2026 | требует Vue |
| `Tencent/weui` | MIT по npm (GitHub: NOASSERTION) | 2.6.26 | 27 449 | 12.03.2026 | стиль WeChat |
| `zdhxiong/mdui` | MIT по npm (GitHub лицензию не определяет) | 2.1.5 | 4 543 | 21.07.2026 | Material Design 3 |
| `ant-design/ant-design-mobile` | MIT | 5.43.0 | 12 092 | 14.09.2026 | требует React |
| `jd-opensource/nutui` (бывш. `jdf2e/nutui`) | MIT | 4.3.15-beta.1 | 6 515 | 02.04.2026 | требует Vue |
| `sakofchit/system.css` | MIT | — | 3 934 | 26.11.2023 | ретро-стиль старого Mac, заброшен |
| `khang-nd/7.css` | MIT | 0.21.1 | 2 488 | 30.09.2026 | стиль Windows 7 |
| `dcloudio/mui` | MIT | — | 13 463 | 20.05.2025 | старый (2014) iOS-7-подобный фреймворк, не развивается |

Источник строк: [GitHub API, пакетный запрос по каждому репозиторию](https://api.github.com/repos/nolimits4web/swiper) (аналогично для остальных имён в таблице) и [реестр npm](https://registry.npmjs.org/swiper/latest) (аналогично по имени пакета).

### Inferences
- Суммарный вес Framework7 (≈ 1,29 МБ несжатых CSS+JS) и Ionic (≈ 1,2 МБ) в два-три раза больше самого приложения (~0,5 МБ); даже без учёта переделки разметки это неоправданно для задачи «подтянуть типографику и контролы».
- Единственные «безопасные» заимствования готового кода — то, что не трогает глобальные стили: отдельные SVG-иконки (MIT) и один самостоятельный JS-модуль листа.
- Для лаборатории дизайна ценнее всего три «эталона значений»: Framework7 9.x (тема `.ios`, заявлена как стиль iOS 26), Puppertino 2.0 (токены цветов и материалов, совпадают с актуальным HIG) и исходники Ionic (классические размеры до iOS 26).

### Gaps
- `ace-design` из списка кандидатов под таким именем не искался и не найден — НЕ ПРОВЕРЕНО. `material-components` не проверялся (в задании помечен «нет»).
- Точная дата и содержание последних коммитов у Onsen UI и Puppertino не получены (API коммитов дважды ответил 403 из-за лимита запросов) — есть только `pushed_at`.
- Звёзды и даты — срез на 11.11.2026; у молодых репозиториев (недели от создания) они быстро меняются.

## 1. Framework7 и Framework7 Icons

### Takeaway
Framework7 жив (v9.3.0 от 30.10.2026) и с v9 перерисовал iOS-тему под iOS 26, включая «стеклянные» поверхности; «Core»-вариант действительно работает без сборщика. Но это каркас приложения, а не набор стилей: он требует своей разметки и инициализации, поэтому для готового приложения — только источник значений.

### Cited Findings
- Репозиторий: 18 774 звезды, MIT, не в архиве, push 30.10.2026, 240 открытых issues — [GitHub API](https://api.github.com/repos/framework7io/framework7).
- npm `framework7` 9.3.0 опубликован 30.10.2026; 9.0.0 — 25.11.2025; 8.0.0 — 03.04.2023; распакованный размер 14 790 421 Б, 681 файл — [npm](https://registry.npmjs.org/framework7).
- В примечаниях к v9.0.0 одной строкой сказано: «All new iOS 26 styles across all components»; термин Liquid Glass там не употребляется. Там же: удалён `dynamicNavbar`, убраны отдельные светлый/тёмный режимы панелей, по умолчанию кнопка «назад» без текста — [Releases](https://github.com/framework7io/framework7/releases).
- При этом в CSS 9.3.0 есть переменные «стекла»: `--f7-glass-bg-color: rgba(255,255,255,0.75)` (светлая) и `rgba(50,50,50,0.5)` (тёмная), наборы внутренних теней `--f7-glass-shadow*`; листы, диалоги и action sheet в теме `.ios` используют `var(--f7-glass-bg-color)` — [framework7-bundle.css 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).
- Размеры файлов 9.3.0: `framework7-bundle.min.css` 485 792 Б (gzip 71 935, br 56 629); `framework7-bundle.min.js` 808 365 Б (gzip 209 995, br 170 753); только ядро CSS `framework7.min.css` 128 969 Б (gzip 21 689) — [список файлов](https://data.jsdelivr.com/v1/packages/npm/framework7@9.3.0?structure=flat), замер по [CDN](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.min.css).
- Подключение без сборки: документация показывает `<link>` на `framework7-bundle.min.css` и `<script>` на `framework7-bundle.min.js`; обязательная разметка — корневой `#app`, в нём `.view.view-main`, в нём `.page` с `.page-content`, затем инициализация приложения в своём скрипте — [App HTML Layout](https://framework7.io/docs/app-layout). Страница установки описывает только npm и CLI, версия в шапке — v9.3.0 — [Installation](https://framework7.io/docs/installation).
- Значения темы `.ios` в 9.3.0 (переменные из бандла, проверена привязка к селектору `.ios`): высота навбара 76px; крупный заголовок 34px / 700 / `letter-spacing: -0.03em`, его блок 52px; тулбар 64px; таббар с иконками 80px, иконка 28px, подпись 12px; inset-список: радиус 24px, боковой отступ 16px, минимальная высота строки 52px, отступы строки 16px по горизонтали и 12px по вертикали; карточка и inset-блок — радиус 24px; лист — радиус 32px; поле поиска — высота 44px, радиус 44px; переключатель 64×28px; большая кнопка 48px, шрифт 17px; фон страницы `#efeff4` / `#000`, фон группы `#fff` / `#1c1c1d`; сегментированный контрол: дорожка `rgba(0,0,0,0.07)` / `rgba(255,255,255,0.1)`, отступ 2px, активная кнопка `#fff` с тенью `0 2px 2px rgba(0,0,0,0.25)` — [framework7-bundle.css 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).
- Переключатель темы `.ios`: дорожка 64×28px, бегунок — капсула 38×24px с отступом 2px от края, ход бегунка 22px (`64 − 38 − 4`), при удержании бегунок увеличивается (`scale(1.4)`) — [framework7-bundle.css 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).
- Размытие в бандле: чаще всего `backdrop-filter: saturate(180%) blur(16px)` (17 вхождений); для панелей — `--f7-bars-translucent-blur: 20px` и `--f7-bars-translucent-opacity: 0.8` — [framework7-bundle.css 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).
- Шрифт iOS-темы задан стеком по именам, без встраивания файлов: `-apple-system, SF Pro Text, SF UI Text, system-ui, Helvetica Neue, Helvetica, Arial, sans-serif` — [framework7-bundle.css 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).
- Safe area: `--f7-safe-area-top: env(safe-area-inset-top)` и аналогично для низа — [framework7-bundle.css 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).
- Framework7 Icons: 231 звезда, MIT, push 03.03.2025; npm 5.0.5 опубликован 12.10.2021; шрифт `Framework7Icons-Regular.woff2` 107 416 Б, `css/framework7-icons.css` 872 Б; в папке `svg` — 1 252 отдельных файла (в среднем ≈ 1,5 КБ, например `airplane.svg` 934 Б), остальное — обёртки для React/Vue/Svelte; пакет 13 349 676 Б, 6 278 файлов — [GitHub API](https://api.github.com/repos/framework7io/framework7-icons), [npm](https://registry.npmjs.org/framework7-icons), [файлы](https://data.jsdelivr.com/v1/packages/npm/framework7-icons@5.0.5?structure=flat).

### Inferences
- Переключатель 64×28 в теме `.ios` против 51×31 в Ionic — признак того, что Framework7 действительно перешёл на пропорции iOS 26 (широкий низкий переключатель), а Ionic остался на классических.
- Частичное использование (например, только CSS переключателя) невозможно без переноса зависимостей: стили завязаны на класс темы `.ios` на корне, на сотни переменных `--f7-*` и на разметку компонентов. Переменные имеют префикс `--f7-`, так что конфликтов имён не будет, но бандл содержит и глобальные правила каркаса.
- Термин «Liquid Glass» в релизах не используется, но по факту «стекло» реализовано полупрозрачным фоном, размытием и набором внутренних теней — без SVG-преломления, то есть подход, работающий в Safari.

### Gaps
- Значение `--f7-button-border-radius: 4px` для `.ios` выглядит неожиданно для iOS 26; фактическая форма кнопок (капсула или нет) в живой демо-странице не проверялась — НЕ ПРОВЕРЕНО.
- GitHub Release для 9.3.0 на день проверки не оформлен (API отдаёт v9.2.0) — расхождение с npm и CHANGELOG, причина неизвестна.

## 2. Ionic Framework и Ionicons

### Takeaway
Ionic 9 (текущая 9.0.10) можно подключить тремя тегами с CDN без сборки, но это веб-компоненты с Shadow DOM и собственным каркасом страницы; в документации v9 и в релизах нет ни слова про iOS 26 или Liquid Glass. Для готового приложения — «не использовать»; Ionicons — годный источник отдельных SVG.

### Cited Findings
- Репозиторий: 52 752 звезды, MIT, push 11.11.2026, 536 открытых issues — [GitHub API](https://api.github.com/repos/ionic-team/ionic-framework).
- `@ionic/core` 9.0.10 опубликован 28.10.2026; 9.0.0 — 19.08.2026; 8.0.0 — 17.04.2024; распакованный размер 20 859 137 Б, 2 739 файлов — [npm](https://registry.npmjs.org/@ionic%2Fcore).
- Документация «CDN»: достаточно двух `<script>` (`dist/ionic/ionic.esm.js` как модуль и `ionic.js` с `nomodule`) и `<link>` на `css/ionic.bundle.css`; сказано, что так доступны все компоненты ядра без установки фреймворка — [Ionic CDN](https://ionicframework.com/docs/intro/cdn).
- `ionic.esm.js` — только загрузчик (25 424 Б, gzip 6 314); сами компоненты лежат в 97 JS-файлах `dist/ionic/*.js` общим объёмом 1 135 139 Б и подгружаются по мере надобности; `ionic.bundle.css` 38 657 Б (gzip 6 119); в папке `css` отдельно лежат `normalize.css`, `structure.css`, `typography.css`, `core.css` — [список файлов](https://data.jsdelivr.com/v1/packages/npm/@ionic/core@9.0.10?structure=flat).
- Режим оформления: на iPhone/iPad по умолчанию применяются стили iOS, на остальных платформах — Material; режим проставляется классом на `<html>` и может быть задан в конфигурации — [Platform Styles](https://ionicframework.com/docs/theming/platform-styles). Глобальная конфигурация без фреймворка задаётся объектом `window.Ionic = { config: { mode: ... } }` — [Config](https://ionicframework.com/docs/developing/config).
- Руководство по переходу на v9: минимальные браузеры — Safari 16 / iOS 16, Chrome 89; перечислены изменения для Angular/React/Vue и компонентов; упоминаний iOS 26, Liquid Glass или новой темы нет — [Ionic 9 upgrade guide](https://ionicframework.com/docs/updating/9-0). В примечаниях к релизам 9.0.1–9.0.10 — только исправления — [Releases](https://github.com/ionic-team/ionic-framework/releases).
- Классические размеры переключателя в iOS-режиме Ionic: 51×31px, рамка 2px, бегунок 27px, фон выключенного — цвет текста с альфой .088, тень бегунка `0 3px 4px rgba(0,0,0,.06), 0 3px 8px rgba(0,0,0,.06)`, длительность 300ms — [toggle.ios.vars.scss](https://raw.githubusercontent.com/ionic-team/ionic-framework/main/core/src/components/toggle/toggle.ios.vars.scss).
- Сторонняя тема «под iOS 26/27» для Ionic: `webview-native-ui/ionic-theme-ios27` (176 звёзд, MIT, push 11.11.2026; пакет `@rdlabo/ionic-theme-ios27` 2.1.3 от 11.11.2026, создан 10.09.2026, MIT, 2 019 623 Б; прежний `@rdlabo/ionic-theme-ios26` 9.4.3 от 11.11.2026, 123 версии) — описывает себя как тему, приносящую Liquid Glass и анимации iOS 27 в Ionic — [GitHub API](https://api.github.com/repos/webview-native-ui/ionic-theme-ios27), [npm ios27](https://registry.npmjs.org/@rdlabo%2Fionic-theme-ios27), [npm ios26](https://registry.npmjs.org/@rdlabo%2Fionic-theme-ios26), [README](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/main/README.md).
- Ionicons: 18 245 звёзд, MIT, 8.1.0 от 28.07.2026, пакет 6 212 842 Б; в `dist/svg` — 1 357 отдельных файлов, например `home.svg` (633 Б) и `home-outline.svg` (484 Б) — [GitHub API](https://api.github.com/repos/ionic-team/ionicons), [npm](https://registry.npmjs.org/ionicons), [файлы](https://data.jsdelivr.com/v1/packages/npm/ionicons@8.1.0?structure=flat).

### Inferences
- Что означало бы внедрение Ionic в готовое приложение: обернуть всё в `ion-app`/`ion-content`, заменить свои кнопки, списки и переключатели на `ion-*`, стилизовать их через CSS-переменные и `::part()` (внутренности в Shadow DOM недоступны обычным селекторам), принять глобальные сбросы из `ionic.bundle.css`, а в service worker закэшировать около сотни чанков с хэшами в именах. Это и есть «переписать приложение».
- Собственный iOS-режим Ionic на 11.11.2026, судя по документации и исходникам переключателя, остаётся «классическим» (до iOS 26); актуальный вид даёт только сторонняя тема.

### Gaps
- Чем тема `ionic-theme-ios27` отличает оформление iOS 27 от iOS 26, не разбиралось; её CSS не читался.
- Суммарный gzip-размер всех чанков Ionic не замерялся.

## 3. Konsta UI

### Takeaway
Konsta UI v5 обновлён под iOS 26, но существует только как компоненты для React, Vue и Svelte поверх Tailwind CSS; варианта для обычного HTML нет. Вердикт — «не использовать», взять можно только идеи из маленького файла со «стеклянными» цветами и тенями.

### Cited Findings
- Репозиторий: 4 289 звёзд, MIT, push 15.10.2026, 11 открытых issues — [GitHub API](https://api.github.com/repos/konstaui/konsta).
- npm `konsta` 5.5.0 опубликован 28.09.2026; 5.0.0 — 18.08.2025; 4.0.0 — 30.08.2024; 1 321 270 Б, 632 файла — [npm](https://registry.npmjs.org/konsta).
- Сайт: компоненты доступны для React, Vue и Svelte, построены на Tailwind CSS; v5 заявлена с обновлённым видом iOS 26 и Material Design 2025; использование в чистом HTML не описано — [konstaui.com](https://konstaui.com/). То же в README — [README](https://raw.githubusercontent.com/konstaui/konsta/master/README.md).
- В `package.json` зависимость `tailwind-merge`, экспорты только `./react`, `./vue`, `./svelte` и `theme.css` — [package.json 5.5.0](https://cdn.jsdelivr.net/npm/konsta@5.5.0/package.json).
- `styles/glass.css` (2 660 Б) написан как блок Tailwind `@theme`: цвета стекла `rgba(255,255,255,0.75)` (светлая) и `rgba(50,50,50,0.5)` (тёмная) плюс наборы многослойных внутренних теней для поверхности, бегунка и плавающей кнопки — те же значения, что в Framework7 — [glass.css](https://cdn.jsdelivr.net/npm/konsta@5.5.0/styles/glass.css). Рядом лежат `safe-areas.css` (4 777 Б) и `hairlines.css` (2 739 Б) — [список файлов](https://data.jsdelivr.com/v1/packages/npm/konsta@5.5.0?structure=flat).

### Inferences
- «Стекло» у Konsta и Framework7 (один автор) — это не преломление, а полупрозрачная заливка + размытие + несколько `inset`-теней, имитирующих блик по кромке. Такой приём работает в Safari на iPhone и переносится в обычный CSS несколькими строками.

### Gaps
- Содержимое `safe-areas.css` и `hairlines.css` не читалось.

## 4. Onsen UI

### Takeaway
Onsen UI формально жив (2.12.9 вышел 16.06.2026), но это первый релиз за три с половиной года и стиль у него «плоский iOS» до Liquid Glass. Вердикт — «не использовать».

### Cited Findings
- Репозиторий: 8 852 звезды, не в архиве, push 17.06.2026, 15 открытых issues; поле лицензии в API пустое, файла LICENSE в корне нет — [GitHub API](https://api.github.com/repos/OnsenUI/OnsenUI), [корень репозитория](https://api.github.com/repos/OnsenUI/OnsenUI/contents/).
- npm `onsenui`: лицензия Apache-2.0; 2.12.9 опубликован 16.06.2026, предыдущий 2.12.8 — 27.12.2022; 10 384 706 Б — [npm](https://registry.npmjs.org/onsenui). На GitHub последним оформленным релизом остаётся 2.12.8 — [latest release](https://api.github.com/repos/OnsenUI/OnsenUI/releases/latest).
- README: ядро на чистом JavaScript поверх веб-компонентов, не зависит от фреймворка; включены «flat (iOS)» и Material-оформление — [README](https://raw.githubusercontent.com/OnsenUI/OnsenUI/master/onsenui/README.md).
- Файлы: `js/onsenui.min.js` 298 020 Б (gzip 69 454); `css/onsen-css-components.min.css` 154 287 Б (gzip 20 731); `css/onsenui.min.css` 10 397 Б (gzip 2 501); есть готовая тёмная тема `dark-onsen-css-components.css` — [список файлов](https://data.jsdelivr.com/v1/packages/npm/onsenui@2.12.9?structure=flat).

### Inferences
- Статус — «медленный / режим поддержки»: проект не заброшен формально, но темп (один релиз за 3,5 года) и отсутствие обновлений оформления делают его плохим ориентиром для «нативного вида 2026 года».

### Gaps
- Что именно вошло в 2.12.9, не выяснено (CHANGELOG по ожидаемому пути отдал 404).

## 5. CSS-наборы и библиотеки «в стиле Apple», найденные поиском по GitHub

### Takeaway
Реальный поиск по GitHub показал: зрелого, популярного «чистого CSS-набора iOS» не существует. Единственный заметный — Puppertino (1 211 звёзд), который в октябре 2026 выпустил 2.0 с мобильными компонентами, актуальными системными цветами и Liquid Glass. Всё остальное — либо демо эффекта стекла, либо репозитории с 0–40 звёздами возрастом в недели и месяцы.

### Cited Findings

**Что дал поиск (GitHub Search API, сортировка по звёздам)**
- «ios css» (1 766 результатов) и «ios ui css» (183): из релевантного сверху только Ionic, `dcloudio/mui` и Konsta; остальное — нативные iOS-библиотеки и мусор — [поиск «ios css»](https://api.github.com/search/repositories?q=ios+css&sort=stars&order=desc), [поиск «ios ui css»](https://api.github.com/search/repositories?q=ios+ui+css&sort=stars&order=desc).
- «cupertino css» (16): лучший результат — `darangonaut/Cupertino.css`, 2 звезды — [поиск](https://api.github.com/search/repositories?q=cupertino+css&sort=stars&order=desc).
- «apple design css» (630): `sakofchit/system.css` (ретро-Mac) и шум — [поиск](https://api.github.com/search/repositories?q=apple+design+css&sort=stars&order=desc).
- «human interface guidelines css» (4): `GLaDOS-096/iOS.css` (1 звезда, 2017), `d9beuD/unity` (0, 2024), `talha020/apple-ui-library` (0, 2026) — [поиск](https://api.github.com/search/repositories?q=human+interface+guidelines+css&sort=stars&order=desc).
- «ios 26 liquid glass css» (25), «liquid glass css» (388), «ios26 css» (14), «liquid glass ui kit» (41), «ios 27 liquid glass css» (3): демо и молодые наборы — `VII-Cae/hyalite--liquid-glass` 265, `nikdelvin/liquid-glass` 116, `kubai087/glasswork` 61 (создан 05.11.2026), `kevinbism/liquid-glass-effect` 50, `wave2234/liquid-glass-recipes` 38, `JUNGHERZ/GlassKit` 16, `GANSGX/liquid-glass-css` 9, `kitlangton/ios-kit` 7, `mikhailmogilnikov/fluid-kit` 2; самый «звёздный» UI-kit в выдаче — `sdegenaar/liquid_glass_widgets` (832), но это Flutter, не веб — [поиск «liquid glass css»](https://api.github.com/search/repositories?q=liquid+glass+css&sort=stars&order=desc), [поиск «ios 26 liquid glass css»](https://api.github.com/search/repositories?q=ios+26+liquid+glass+css&sort=stars&order=desc), [поиск «liquid glass ui kit»](https://api.github.com/search/repositories?q=liquid+glass+ui+kit&sort=stars&order=desc).
- «sf symbols web» (8): ничего пригодного; встречаются репозитории с перерисованными или скопированными символами Apple на 1 звезду — [поиск](https://api.github.com/search/repositories?q=sf+symbols+web&sort=stars&order=desc).
- «ios components web» (296): в основном React Native; из веба — Onsen UI — [поиск](https://api.github.com/search/repositories?q=ios+components+web&sort=stars&order=desc).
- «puppertino» (5): кроме основного репозитория — пустые форки и обёртки — [поиск](https://api.github.com/search/repositories?q=puppertino&sort=stars&order=desc).
- «cupertino-pane» (13): обёртки для Vue (`Devrax/v-cupertino`, 29 звёзд, 2023); сам проект переехал в `tech-systems/panes` — [поиск](https://api.github.com/search/repositories?q=cupertino-pane&sort=stars&order=desc).
- «ios-style switch css» (5): только репозитории 2015–2019 годов с 0–1 звездой — [поиск](https://api.github.com/search/repositories?q=ios-style+switch+css&sort=stars&order=desc).
- Тупики: «apple ui kit html» (8, ничего по теме), «apple system colors css variables» (0), «ios bottom sheet vanilla js» (0), «ios tab bar css liquid glass» (1 результат, 0 звёзд, создан 08.11.2026) — [поиск](https://api.github.com/search/repositories?q=apple+ui+kit+html&sort=stars&order=desc).

**Puppertino 2.0 — подробно**
- 1 211 звёзд, MIT, push 31.10.2026; релиз v2.0.0 «Puppertino Dachshund» оформлен 06.10.2026 — [GitHub API](https://api.github.com/repos/codedgar/Puppertino), [latest release](https://api.github.com/repos/codedgar/Puppertino/releases/latest).
- Новый пакет `@codedgar/puppertino` 2.0.0 (06.10.2026, MIT, 2 103 026 Б, 69 файлов, всего 2 версии); прежний пакет `puppertino` остановился на 1.5.1 от 23.04.2021 (в метаданных npm лицензия ISC) — [npm, новый](https://registry.npmjs.org/@codedgar%2Fpuppertino), [npm, старый](https://registry.npmjs.org/puppertino).
- По README: чистый CSS без сборки и зависимостей; часть компонентов имеет необязательные помощники на обычном JavaScript; три бандла (полный, настольный, мобильный); мобильный набор включает кнопки, формы, модальные окна, action sheet, таббары, навбары, списки со свайпами; есть пять «толщин» материалов и Liquid Glass; учитываются системные настройки «уменьшение движения», «понижение прозрачности», «увеличение контраста»; классы v1 сохранены — [README](https://raw.githubusercontent.com/codedgar/Puppertino/master/README.md).
- Размеры: `puppertino.min.css` 413 219 Б (gzip 59 396, br 46 768); `puppertino-mobile.min.css` 383 965 Б (gzip 55 037, br 43 547); отдельные несжатые файлы: `colors.css` 46 220, `typography.css` 6 836, `materials.css` 32 630, `segmented-controls.css` 18 224, `lists.css` 26 765, `tabs.css` 19 511, `buttons.css` 46 593, `modals.css` 43 646, `forms.css` 108 069 Б — [список файлов](https://data.jsdelivr.com/v1/packages/npm/@codedgar/puppertino@2.0.0?structure=flat).
- Проверка на пересечения с чужим CSS (мобильный бандл): `@font-face` — 0 (шрифты Apple не встроены, только названы в стеке с запасным Inter); классы с префиксом `.p-`, переменные с префиксом `--p-`; сбросов по голым тегам простой проверкой не найдено — [puppertino-mobile.min.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/puppertino-mobile.min.css).
- Но в `colors.css` есть правило на универсальный селектор `:where(*, *::before, *::after)`, которое ставит переменную `--p-color-current` каждому элементу страницы, и регистрация `@property` — [colors.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/colors.css).
- Токены материалов: `--p-material-blur: 30px`, `--p-material-saturate: 180%`; тёмные заливки материалов от `rgba(0,0,0,0.10)` (ultrathin) до `rgba(0,0,0,0.50)` (ultrathick); стекло: `--p-glass-sm` `rgba(242,242,242,0.55)` / `rgba(153,153,153,0.17)` (тёмная) — [materials.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/materials.css).
- «Жидкая линза» на переключателях и ползунках сделана отдельным необязательным скриптом на SVG-фильтрах, применяемых к самим элементам (не через `backdrop-filter: url()`); без скрипта остаётся обычная CSS-анимация — [liquid_glass.js](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/src/js/liquid_glass.js).

**Cupertino Pane**
- Старый адрес `roman-rr/cupertino-pane` перенаправляет на `tech-systems/panes`: 728 звёзд, MIT, push 26.02.2026; npm `cupertino-pane` 1.5.4 от 27.08.2025; на GitHub последний релиз v1.5.3 от 21.08.2025 — [GitHub API](https://api.github.com/repos/tech-systems/panes), [npm](https://registry.npmjs.org/cupertino-pane), [latest release](https://api.github.com/repos/tech-systems/panes/releases/latest).
- README заявляет: около 12 КБ в сжатом виде со всеми модулями, без зависимостей, подходит к любому фреймворку — [README](https://raw.githubusercontent.com/tech-systems/panes/master/README.md). Собственный замер: `dist/cupertino-pane.min.js` 67 004 Б, gzip 14 945, br 13 082; файл в формате UMD (подключается обычным `<script>`) — [файл](https://cdn.jsdelivr.net/npm/cupertino-pane@1.5.4/dist/cupertino-pane.min.js).

**Liquid Glass и Safari**
- `rdev/liquid-glass-react` прямо предупреждает, что Safari и Firefox поддерживают эффект частично и смещение (преломление) там не видно — [README](https://raw.githubusercontent.com/rdev/liquid-glass-react/master/README.md).
- `nikdelvin/liquid-glass`: полная поддержка заявлена для Chrome/Edge/Firefox, для Safari — частичная, с автоматическим откатом к обычному размытию, когда `backdrop-filter: url()` не поддерживается — [README](https://raw.githubusercontent.com/nikdelvin/liquid-glass/main/README.md).
- `VII-Cae/hyalite--liquid-glass`: демо предлагается открывать в Chromium, в остальных браузерах — простое размытие — [README](https://raw.githubusercontent.com/VII-Cae/hyalite--liquid-glass/main/README.md).
- `lucasromerodb/liquid-glass-effect-macos`: в корне только `README.md`, `assets`, `index.html`, `styles.css` — файла лицензии нет — [корень репозитория](https://api.github.com/repos/lucasromerodb/liquid-glass-effect-macos/contents/).

### Inferences
- «Настоящее» преломление Liquid Glass (SVG-карта смещения в `backdrop-filter`) на 11.11.2026 — технология только для Chromium; на iPhone в Safari и в PWA её не будет. Все три независимых README сходятся. Для целевой платформы остаётся «матовое стекло»: полупрозрачная заливка + `blur()` + `saturate()` + блик по кромке тенями.
- Puppertino 2.0 — лучший открытый образец именно как справочник: MIT, чистый CSS, значения совпадают с действующим HIG. Но проекту в новом виде месяц, автор один, а между 1.5.1 и 2.0 прошло пять лет — закладываться на него как на зависимость рискованно; безопаснее переносить значения в собственные переменные приложения.
- Если всё же подключать кусок Puppertino, брать отдельный файл компонента, а не бандл, и помнить о правиле на универсальный селектор в `colors.css`.
- Иконки: репозитории с «SF Symbols для веба» из выдачи брать нельзя — это собственность Apple (как и шрифты SF), и по условию задачи их в веб-приложение не копируем. Открытая замена — Ionicons (1 357 SVG) или Framework7 Icons (1 252 SVG), оба под MIT; шрифт системы подключается только по имени (`-apple-system`), без файлов.
- Заявленная в Puppertino поддержка «понижения прозрачности» на iPhone не сработает: Safari не поддерживает медиазапрос `prefers-reduced-transparency` (см. раздел 7).

### Gaps
- Поддержка Safari у `shuding/liquid-glass` и `lucasromerodb/...` в README не указана и на устройстве не проверялась — НЕ ПРОВЕРЕНО.
- Качество мобильных компонентов Puppertino 2.0 на реальном iPhone не проверялось; сайт документации puppertino.com сегодня не открывался.
- Часть найденных репозиториев (`glasswork`, `liquid-glass-recipes`, `GANSGX/liquid-glass-css`, `Cupertino.css`, `apple-ui-library`) проверена только по метаданным, код не читался.
- Текст лицензии Apple на SF Symbols и шрифты SF сегодня не открывался — запрет на копирование принят по условию задачи, формулировки лицензии НЕ ПРОВЕРЕНЫ.

## 6. Системные цвета iOS и текстовые стили как CSS-переменные

### Takeaway
Apple **изменила значения системных цветов 9 июня 2025 года** (вместе с iOS 26): синий теперь `#0088FF` / `#0091FF`, красный `#FF383C` / `#FF4245`; зелёный и розовый остались прежними, серые уровни тоже. Привычные `#007AFF`, `#FF3B30` — это значения до iOS 26. Готового популярного репозитория «iOS-токены в CSS» нет; из открытого кода актуальные значения содержит только Puppertino 2.0.

### Cited Findings

**Системные цвета iOS / iPadOS по действующей странице HIG «Color» (перевод RGB в HEX — мой)**

| Цвет | Светлая | Тёмная | Повышенный контраст, светлая | Повышенный контраст, тёмная |
|---|---|---|---|---|
| Red | 255,56,60 → `#FF383C` | 255,66,69 → `#FF4245` | 233,21,45 → `#E9152D` | 255,97,101 → `#FF6165` |
| Orange | 255,141,40 → `#FF8D28` | 255,146,48 → `#FF9230` | 197,83,0 → `#C55300` | 255,160,86 → `#FFA056` |
| Yellow | 255,204,0 → `#FFCC00` | 255,214,0 → `#FFD600` | 161,106,0 → `#A16A00` | 254,223,67 → `#FEDF43` |
| Green | 52,199,89 → `#34C759` | 48,209,88 → `#30D158` | 0,137,50 → `#008932` | 74,217,104 → `#4AD968` |
| Mint | 0,200,179 → `#00C8B3` | 0,218,195 → `#00DAC3` | 0,133,117 → `#008575` | 84,223,203 → `#54DFCB` |
| Teal | 0,195,208 → `#00C3D0` | 0,210,224 → `#00D2E0` | 0,129,152 → `#008198` | 59,221,236 → `#3BDDEC` |
| Cyan | 0,192,232 → `#00C0E8` | 60,211,254 → `#3CD3FE` | 0,126,174 → `#007EAE` | 109,217,255 → `#6DD9FF` |
| Blue | 0,136,255 → `#0088FF` | 0,145,255 → `#0091FF` | 30,110,244 → `#1E6EF4` | 92,184,255 → `#5CB8FF` |
| Indigo | 97,85,245 → `#6155F5` | 109,124,255 → `#6D7CFF` | 86,74,222 → `#564ADE` | 167,170,255 → `#A7AAFF` |
| Purple | 203,48,224 → `#CB30E0` | 219,52,242 → `#DB34F2` | 176,47,194 → `#B02FC2` | 234,141,255 → `#EA8DFF` |
| Pink | 255,45,85 → `#FF2D55` | 255,55,95 → `#FF375F` | 231,18,77 → `#E7124D` | 255,138,196 → `#FF8AC4` |
| Brown | 172,127,94 → `#AC7F5E` | 183,138,102 → `#B78A66` | 149,109,81 → `#956D51` | 219,166,121 → `#DBA679` |

Источник: [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color), данные взяты из [JSON-версии страницы](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color.json) (значения записаны в подписях к образцам цвета).

**Серые уровни iOS / iPadOS (та же страница)**

| Имя | Светлая | Тёмная |
|---|---|---|
| systemGray | 142,142,147 → `#8E8E93` | 142,142,147 → `#8E8E93` |
| systemGray2 | 174,174,178 → `#AEAEB2` | 99,99,102 → `#636366` |
| systemGray3 | 199,199,204 → `#C7C7CC` | 72,72,74 → `#48484A` |
| systemGray4 | 209,209,214 → `#D1D1D6` | 58,58,60 → `#3A3A3C` |
| systemGray5 | 229,229,234 → `#E5E5EA` | 44,44,46 → `#2C2C2E` |
| systemGray6 | 242,242,247 → `#F2F2F7` | 28,28,30 → `#1C1C1E` |

Источник: [Apple HIG — Color (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color.json).

- Журнал изменений страницы: 9 июня 2025 — обновлены значения системных цветов и добавлены указания по Liquid Glass; 16 декабря 2025 — уточнены указания по Liquid Glass — [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color).
- Про цвет и Liquid Glass там же: у стекла нет собственного цвета, оно берёт его от содержимого под собой; цвет на стекле применять скупо — для главного действия, причём красить фон элемента, а не значок или текст — [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color).
- Семантические цвета (`label`, `secondaryLabel`, `systemBackground`, `systemGroupedBackground`, `separator` и др.) на странице HIG только названы и описаны словами; числовых значений Apple там не публикует — [Apple HIG — Color (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color.json).
- Независимая сверка: в Puppertino 2.0 все 12 акцентных цветов в светлой и тёмной теме совпадают с таблицей выше (`--p-sys-blue: #0088FF` / `#0091FF`, `--p-sys-red: #FF383C` / `#FF4245` и т. д.); расхождение одно — серый в тёмной теме у Puppertino `#98989F`, у Apple `#8E8E93` — [colors.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/colors.css).
- Значения фонов и разделителей из Puppertino 2.0 (это значения библиотеки, не публикация Apple): тёмные фоны `#000000` / `#1C1C1E` / `#2C2C2E`, приподнятые `#1C1C1E` / `#2C2C2E` / `#3A3A3C`; светлые `#FFFFFF` / `#F2F2F7`; разделитель `rgba(60,60,67,0.29)` (светлая) и `rgba(84,84,88,0.60)` (тёмная), непрозрачный `#C6C6C8` / `#38383A`; вторичный текст в мобильных списках `rgba(60,60,67,0.6)` / `rgba(235,235,245,0.6)` — [colors.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/colors.css), [lists.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/lists.css).
- Текстовые стили iOS при стандартном размере «Large» (размер / интерлиньяж, пт): Large Title 34/41, Title 1 28/34, Title 2 22/28, Title 3 20/25, Headline 17/22 (Semibold), Body 17/22, Callout 16/21, Subhead 15/20, Footnote 13/18, Caption 1 12/16, Caption 2 11/13; все, кроме Headline, — Regular; выделенное начертание — Bold для Large Title и Title 1–2, Semibold для остальных; размер по умолчанию 17 пт, минимальный 11 пт; системный шрифт — SF Pro; выделенные начертания добавлены в таблицу 16.12.2025 — [Apple HIG — Typography (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/typography.json).
- Готовые репозитории с токенами: `nemecek-filip/iOS-CSS-Colors` — 1 звезда, push 04.02.2023, без лицензии, автор сам пишет, что набор не закончен и один цвет намеренно изменён; запрос «apple system colors css variables» дал 0 результатов — [поиск](https://api.github.com/search/repositories?q=ios+system+colors+css&sort=stars&order=desc), [README](https://raw.githubusercontent.com/nemecek-filip/iOS-CSS-Colors/main/README.md).
- В `typography.css` Puppertino 2.0 заявлена «шкала iOS 27»: база 17px, классы на каждый текстовый стиль, трекинг по размерам — [typography.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/typography.css).

### Inferences
- Значения из задания (`#007AFF`/`#0A84FF`, `#FF3B30`/`#FF453A`) — это палитра до июня 2025. Если цель — «как в текущей iOS», для синего и красного нужны новые значения; зелёный `#34C759`/`#30D158` менять не надо. Серые уровни и фоны группированных списков (`#000` / `#1C1C1E` / `#2C2C2E`) совпадают с серыми 6 и 5 в тёмной теме и не менялись.
- Раз Apple не публикует числа для `label`/`separator`/фонов, переносить их можно только из открытых библиотек (Puppertino, Ionic, Framework7) с пометкой «значение библиотеки» и сверкой глазами на устройстве.
- Собственный небольшой файл токенов (десяток цветов + 11 текстовых стилей) проще и надёжнее любой найденной зависимости.

### Gaps
- Прежние (до 09.06.2025) значения системных цветов по архивной копии страницы Apple сверить не удалось (web.archive.org недоступен для инструмента чтения) — `#007AFF`/`#0A84FF`, `#FF3B30`/`#FF453A` приведены только как известные по заданию; факт смены значений подтверждён журналом изменений самой страницы.
- Числовые значения `label`, `secondaryLabel`, `tertiaryLabel`, `quaternaryLabel`, системных заливок и фонов по первичному источнику Apple — НЕ ПРОВЕРЕНО (в HIG их нет; нужен замер в Xcode или Apple Design Resources).
- Таблица трекинга шрифта из HIG не извлечена (страница обрезана инструментом чтения); менялись ли цвета в iOS 27 — в журнале изменений страницы записей после 16.12.2025 не найдено, но страница прочитана не целиком.
- Значения извлечены автоматически из подписей к картинкам; совпадение с независимым источником (Puppertino) есть для акцентных цветов в обычном режиме, для режима повышенного контраста и серых уровней второй сверки нет.

## 7. Рецепты нативных iOS-элементов на чистом CSS

### Takeaway
Все перечисленные элементы воссоздаются вручную в несколько десятков строк CSS; на iPhone надёжно работают размытие (`backdrop-filter` без префикса с Safari 18), `env(safe-area-inset-*)`, атрибут `switch` (Safari 17.4+, с тактильным откликом с iOS 18) и анимации по прокрутке (Safari 26+). Не работают в Safari на 11.11.2026: «сквиркл» (`corner-shape`) и преломление через `backdrop-filter: url()`. Apple в HIG почти не публикует размеров в пунктах — числа ниже взяты из открытых библиотек и помечены источником.

### Cited Findings

**Переключатель (switch)**
- `<input type="checkbox" switch>` появился в Safari 17.4 (пост от 28.02.2024); браузеры без поддержки показывают обычный флажок; `accent-color` красит дорожку; при `appearance: none` оформление полностью своё; псевдоэлементы `::thumb` и `::track` остались за флагом и не выпущены; роль для ассистивных технологий — `switch` — [WebKit: An HTML Switch Control](https://webkit.org/blog/15054/an-html-switch-control/).
- Совместимость по MDN: Safari 17.4+, Chrome — нет, Firefox — нет; статус «экспериментальный, не на пути стандартизации» — [MDN BCD, input.json](https://raw.githubusercontent.com/mdn/browser-compat-data/main/html/elements/input.json).
- С iOS 18 нажатие на такой переключатель даёт тактильный отклик — [WebKit Features in Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/). В Safari 27.0 его поведение при нативном оформлении приведено к остальным контролам (исправление) — [WebKit Features for Safari 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/).
- HIG: переключатель уместен только в строке списка; вне списка — кнопка-переключатель; зелёный по умолчанию менять лишь при необходимости; размеров Apple не даёт — [Apple HIG — Toggles (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/toggles.json).
- Размеры из библиотек: классический 51×31px с бегунком 27px и зазором 2px — [Ionic toggle.ios.vars.scss](https://raw.githubusercontent.com/ionic-team/ionic-framework/main/core/src/components/toggle/toggle.ios.vars.scss). Вариант «iOS 26»: дорожка 64×28px, бегунок-капсула 38×24px, отступ 2px — эти числа независимо совпадают в двух библиотеках: тема `.ios` у [Framework7 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css) и размер `.p-switch-large` у [Puppertino forms.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/forms.css) (у Puppertino есть ещё ступени 54×24 с бегунком 32px и 80×36 с бегунком 47px). Цвет выключенной дорожки на сенсорных экранах в Puppertino: `rgba(60,60,67,0.30)` / `rgba(235,235,245,0.30)` — [forms.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/forms.css). Зелёный «включено»: `#34C759` / `#30D158` — [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color).

Набросок (собран из проверенных значений; на устройстве не проверялся):

```html
<input type="checkbox" switch class="ios-switch" aria-label="…">
```
```css
.ios-switch {
  -webkit-appearance: none; appearance: none;
  inline-size: 51px; block-size: 31px; flex: none; margin: 0;
  border-radius: 999px; position: relative;
  background: rgba(235, 235, 245, 0.30);            /* выключен, тёмная тема */
  transition: background-color .3s;
  -webkit-tap-highlight-color: transparent;
}
.ios-switch::before {
  content: ""; position: absolute; inset-block: 2px; inset-inline-start: 2px;
  inline-size: 27px; border-radius: 50%; background: #fff;
  box-shadow: 0 3px 4px rgba(0,0,0,.06), 0 3px 8px rgba(0,0,0,.06);
  transition: transform .3s;
}
.ios-switch:checked { background: #30D158; }
.ios-switch:checked::before { transform: translateX(20px); }
@media (prefers-reduced-motion: reduce) { .ios-switch, .ios-switch::before { transition: none; } }
```
Вариант «как в iOS 26» — те же правила с другими числами (значения из Framework7 и Puppertino, см. выше):

```css
.ios-switch.v26 { inline-size: 64px; block-size: 28px; }
.ios-switch.v26::before { inline-size: 38px; border-radius: 999px; }   /* капсула 38×24 */
.ios-switch.v26:checked::before { transform: translateX(22px); }      /* 64 − 38 − 4 */
```
Псевдоэлемент `::before` у `<input>` с `appearance: none` — распространённый приём, но формально поведение не стандартизовано; проверить в рамке.

**Сегментированный контрол со скользящим бегунком**
- HIG: на iPhone не больше примерно пяти сегментов; сегменты равной ширины; не смешивать текст и значки; для переключения между разделами приложения — таббар, а не сегменты — [Apple HIG — Segmented controls (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/segmented-controls.json).
- Значения: дорожка `rgba(118,118,128,0.12)` (светлая) / `rgba(118,118,128,0.24)` (тёмная), бегунок `#ffffff` / `rgba(255,255,255,0.27)` — [Puppertino segmented-controls.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/segmented-controls.css); у Framework7: дорожка `rgba(0,0,0,0.07)` / `rgba(255,255,255,0.1)`, внутренний отступ 2px, активный сегмент с тенью `0 2px 2px rgba(0,0,0,0.25)` — [Framework7 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).
- Ступени размеров в Puppertino 2.0 (высота / радиус / кегль): обычная 24px / 6px / 13px, large 28px / 14px, xlarge 36px / 18px (то есть у крупных ступеней форма — капсула), минимальная ширина сегмента 54–62px — [Puppertino segmented-controls.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/segmented-controls.css).
- Селектор `:has()` — Safari 15.4+, Chrome 105+, Firefox 121+ — [MDN BCD, has](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/selectors/has.json).

Набросок (радиокнопки + один подвижный элемент; `:has()` и сетка; на устройстве не проверялся):

```html
<div class="seg" role="radiogroup" style="--n:3">
  <label><input type="radio" name="period" checked>День</label>
  <label><input type="radio" name="period">Неделя</label>
  <label><input type="radio" name="period">Месяц</label>
  <span class="seg-thumb" aria-hidden="true"></span>
</div>
```
```css
.seg { --i: 0; position: relative; display: grid; grid-template-columns: repeat(var(--n), 1fr);
  padding: 2px; border-radius: 999px; background: rgba(118,118,128,0.24); }
.seg label { position: relative; z-index: 1; min-block-size: 32px; display: grid; place-items: center;
  font: 500 13px/1 -apple-system, system-ui, sans-serif; -webkit-tap-highlight-color: transparent; }
.seg input { position: absolute; opacity: 0; pointer-events: none; }
.seg-thumb { position: absolute; inset-block: 2px; inset-inline-start: 2px;
  inline-size: calc((100% - 4px) / var(--n)); border-radius: 999px;
  background: rgba(255,255,255,0.27); box-shadow: 0 2px 2px rgba(0,0,0,0.25);
  transform: translateX(calc(var(--i) * 100%)); transition: transform .25s ease; }
.seg:has(label:nth-of-type(2) input:checked) { --i: 1; }
.seg:has(label:nth-of-type(3) input:checked) { --i: 2; }
```

**Список «inset grouped»**
- Минимальная область нажатия по HIG — 44×44 пт — [Apple HIG — Buttons (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json).
- Страница HIG о списках размеров не даёт и стиль «inset grouped» отдельно не описывает; из полезного: текст строк держать коротким, шеврон — только для перехода вглубь, кнопка «i» — только для сведений, строки-переходы оставлять подсвеченными, строки-варианты отмечать галочкой; последняя правка страницы — 21.06.2023 — [Apple HIG — Lists and tables (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/lists-and-tables.json).
- Значения «iOS 26» по Framework7 9.3.0: радиус группы 24px, боковое поле 16px, минимальная высота строки 52px, внутренние отступы 16px / 12px; фон страницы `#000`, фон группы `#1c1c1d` (тёмная) — [Framework7 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css). По Puppertino: отступ строки 16px, промежуток 12px, значок 30px, разделитель `rgba(84,84,88,0.6)` в тёмной теме — [lists.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/lists.css). Фон группы по палитре Apple — systemGray6 тёмный `#1C1C1E` — [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color).

```css
.group { margin: 0 16px 24px; border-radius: 24px; background: #1C1C1E; overflow: hidden; }
.row { position: relative; display: flex; align-items: center; gap: 12px;
  min-block-size: 52px; padding: 12px 16px; font: 17px/22px -apple-system, system-ui, sans-serif; }
.row + .row::before { content: ""; position: absolute; inset-block-start: 0;
  inset-inline: 16px 0; block-size: 1px; transform: scaleY(.5); transform-origin: top;
  background: rgba(84,84,88,0.6); }               /* разделитель с отступом слева */
.row:active { background: rgba(255,255,255,0.08); }
```
Классический (до iOS 26) вид: радиус около 10–12px и строка 44px — значение радиуса по первичному источнику НЕ ПРОВЕРЕНО.

**Крупный заголовок, который сворачивается**
- Текстовый стиль Large Title: 34/41 пт — [Apple HIG — Typography (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/typography.json); у Framework7: 34px, вес 700, трекинг −0.03em — [Framework7 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).
- Анимации, привязанные к прокрутке (`animation-timeline`), поддерживаются с Safari 26, Chrome 115, Firefox 159 — [MDN BCD, animation-timeline](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/animation-timeline.json), [WebKit Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/).

```css
.nav-small-title { opacity: 0; }
@supports (animation-timeline: scroll()) {
  .large-title { animation: lt-out linear both; animation-timeline: scroll(root); animation-range: 0 56px; }
  .nav-small-title { animation: st-in linear both; animation-timeline: scroll(root); animation-range: 32px 64px; }
  @keyframes lt-out { to { opacity: 0; transform: translateY(-8px) scale(.94); } }
  @keyframes st-in { to { opacity: 1; } }
}
```
На iOS ниже 26 блок `@supports` не сработает — крупный заголовок просто уедет вместе со страницей (приемлемый откат).

**Плавающая панель вкладок («стеклянная» капсула)**
- HIG: в iOS таббар парит над содержимым у нижнего края, его элементы лежат на фоне Liquid Glass; может сворачиваться при прокрутке; справа возможна отдельная вкладка поиска; рекомендуется не больше пяти вкладок, значки с заливкой и подписи; размеров для iOS страница не даёт; изменения — 28.07.2025, 16.12.2025, 08.06.2026 — [Apple HIG — Tab bars (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/tab-bars.json).
- Значения из Puppertino: высота 62px, ширина `min(360px, 100vw − 32px)`, радиус — половина высоты, поля `0 10px`, ширина вкладки 84px; закреплённый вариант: `position: fixed; bottom: max(12px, env(safe-area-inset-bottom))`; размытие `saturate(180%) blur(30px)` с дублем `-webkit-`; значок 22px, подпись 10px / 12px, зазор 3px; «таблетка» выбранной вкладки — псевдоэлемент с `inset: 4px -6px`; рядом может стоять отдельная круглая кнопка 62×62px (например, поиск); свёрнутое состояние — 48px; поверхность `rgba(242,242,242,0.55)` (светлая) / `rgba(153,153,153,0.17)` (тёмная), запасной непрозрачный фон `#1c1c1e`, «таблетка» `rgba(255,255,255,0.085)` — [tabs.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/tabs.css). У Framework7: высота с иконками 80px, значок 28px, подпись 12px — [Framework7 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).

```css
.tabbar { position: fixed; inset-inline: 0; margin-inline: auto;
  inset-block-end: max(12px, env(safe-area-inset-bottom));
  inline-size: min(360px, calc(100% - 32px)); block-size: 62px;
  display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; padding: 4px 10px;
  border-radius: 31px; background: rgba(50,50,50,0.5);
  -webkit-backdrop-filter: saturate(180%) blur(30px); backdrop-filter: saturate(180%) blur(30px);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.25); }
.tabbar a { display: grid; place-items: center; align-content: center; gap: 3px; border-radius: 27px;
  font: 500 10px/12px -apple-system, system-ui, sans-serif; touch-action: manipulation; }
.tabbar a svg { inline-size: 22px; block-size: 22px; }
.tabbar a[aria-current="page"] { background: rgba(255,255,255,0.085); }
main { padding-block-end: calc(62px + 24px + env(safe-area-inset-bottom)); }
```
Числа (62px, 360px, 22px, 10px/12px, 30px, отступ снизу) — из Puppertino; цвет заливки — из Framework7/Konsta; параметры тени — моя заготовка. Откат на непрозрачный фон по `@media (prefers-reduced-transparency)` на iPhone не сработает: Safari этот медиазапрос не поддерживает (Chrome 118+) — [MDN BCD, media](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/at-rules/media.json); надёжный откат — только через `@supports` на `backdrop-filter`.

**Нижний лист с «ручкой» и уровнями**
- HIG: уровни (detents) — large (полная высота) и medium (примерно половина), возможны свои; изменяемому листу нужна «ручка»; закрытие смахиванием вниз; «Отмена» слева, «Готово» справа; последнее изменение страницы 24.03.2026 — [Apple HIG — Sheets (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sheets.json).
- Радиус листа в iOS-теме Framework7 — 32px, фон — «стекло» — [Framework7 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css). `@starting-style` для анимации появления — Safari 17.5+ — [MDN BCD, starting-style](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/at-rules/starting-style.json). Остальное из наброска: `<dialog>` — Safari 15.4+, единицы `dvh` — Safari 15.4+, `transition-behavior: allow-discrete` — Safari 17.4+ — [MDN BCD, dialog](https://raw.githubusercontent.com/mdn/browser-compat-data/main/html/elements/dialog.json), [length](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/types/length.json), [transition-behavior](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/transition-behavior.json).
- Готовая реализация с перетаскиванием и уровнями: Cupertino Pane (UMD, 14,9 КБ gzip, MIT) — [файл](https://cdn.jsdelivr.net/npm/cupertino-pane@1.5.4/dist/cupertino-pane.min.js).

```css
dialog.sheet { margin: auto 0 0; inline-size: 100%; max-inline-size: none; border: 0; padding: 8px 16px calc(16px + env(safe-area-inset-bottom));
  max-block-size: 50dvh;                      /* уровень medium; large — 100dvh минус отступ сверху */
  border-radius: 32px 32px 0 0; background: #1C1C1E; color: inherit;
  transition: transform .35s cubic-bezier(.32,.72,0,1), overlay .35s allow-discrete, display .35s allow-discrete; }
dialog.sheet::before { content: ""; display: block; inline-size: 36px; block-size: 5px; margin: 0 auto 8px;
  border-radius: 3px; background: rgba(235,235,245,0.3); }        /* «ручка» */
dialog.sheet:not([open]) { transform: translateY(100%); }
@starting-style { dialog.sheet[open] { transform: translateY(100%); } }
dialog.sheet::backdrop { background: rgba(0,0,0,0.4); }
```
Размер ручки 36×5 и кривая — заготовки, не из источника; перетаскивание пальцем потребует JS.

**Кнопки**
- HIG: область нажатия не меньше 44×44 пт; заметный стиль — у одного-двух действий на экране; различать главное действие стилем, а не размером; у своей кнопки обязательно состояние нажатия; деструктивное действие — системным красным; про капсульную форму именно в iOS страница ничего не говорит; изменения 09.06.2025 и 16.12.2025 — [Apple HIG — Buttons (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json).
- Framework7 `.ios`: большая кнопка 48px, шрифт 17px; обычная 34px — [Framework7 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css).

```css
.btn { min-block-size: 48px; padding-inline: 20px; border: 0; border-radius: 999px;
  font: 600 17px/22px -apple-system, system-ui, sans-serif; touch-action: manipulation;
  -webkit-tap-highlight-color: transparent; transition: opacity .15s, transform .15s; }
.btn:active { opacity: .6; transform: scale(.98); }
.btn-filled { background: #0091FF; color: #fff; }
.btn-tinted { background: color-mix(in srgb, #0091FF 18%, transparent); color: #0091FF; }
.btn-gray   { background: rgba(118,118,128,0.24); color: #0091FF; }
.btn-plain  { background: none; color: #0091FF; min-block-size: 44px; }
.btn-destructive { color: #FF4245; }
```
Доля 18% у «tinted» и прозрачность нажатия — заготовки, не из источника. `color-mix()` — Safari 16.2+ — [MDN BCD, color](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/types/color.json).

**Непрерывные углы («сквиркл»)**
- `corner-shape` и `superellipse()`: Chrome 139+; Safari и Firefox — только предварительные сборки (в данных MDN значение `preview`); статус экспериментальный — [MDN BCD, corner-shape](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/corner-shape.json), [MDN BCD, superellipse](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/types/superellipse.json). В постах WebKit о Safari 26.0 и 27.0 (27.0 прочитан целиком, в два приёма) свойство не упоминается — [Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/), [Safari 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/).
- Откат: обычный `border-radius` как основа и улучшение в блоке `@supports (corner-shape: squircle)`.

**Полупрозрачные материалы**
- `backdrop-filter` без префикса — с Safari 18; для Safari 9–17 нужен `-webkit-backdrop-filter`; Chrome 76+, Firefox 103+ — [MDN BCD, backdrop-filter](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/backdrop-filter.json), [WebKit Features in Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/).
- Значения в открытых библиотеках: Framework7 — `saturate(180%) blur(16px)` и 20px для панелей при непрозрачности фона 0.8 — [Framework7 9.3.0](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css); Puppertino — `saturate(180%) blur(30px)` для материалов, отдельные ступени `saturate(200%)` с `blur(30px / 45px / 81px)`; тёмные заливки по «толщине»: 0.10 / 0.20 / 0.29 / 0.40 / 0.50 чёрного — [materials.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/materials.css); «стекло» Framework7/Konsta — `rgba(50,50,50,0.5)` в тёмной теме — [Konsta glass.css](https://cdn.jsdelivr.net/npm/konsta@5.5.0/styles/glass.css).
- HIG: Liquid Glass — слой для управления и навигации поверх содержимого; в слое содержимого его не использовать (там — обычные материалы); варианты regular и clear; для clear над ярким фоном — затемняющий слой 35%; обычных материалов четыре: ultraThin, thin, regular (по умолчанию), thick; поверх материалов — «вибрантные» цвета текста — [Apple HIG — Materials (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/materials.json).
- Преломление через SVG-фильтр в `backdrop-filter` в Safari не работает (см. раздел 5) — [liquid-glass-react README](https://raw.githubusercontent.com/rdev/liquid-glass-react/master/README.md). Косвенно то же в открытом баге WebKit от 02.05.2026 (статус NEW): автор пишет, что вариант с `backdrop-filter` пока работает только в Chrome, а обходной путь через SVG-фильтр внутри `<foreignObject>` в Safari 26 тоже не отрисовывается — [WebKit bug 313914](https://bugs.webkit.org/show_bug.cgi?id=313914).

```css
.material { background: rgba(0,0,0,0.29);                       /* «medium», тёмная */
  -webkit-backdrop-filter: saturate(180%) blur(30px); backdrop-filter: saturate(180%) blur(30px); }
.glass { background: rgba(50,50,50,0.5);
  -webkit-backdrop-filter: saturate(180%) blur(16px); backdrop-filter: saturate(180%) blur(16px);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .material, .glass { background: #1C1C1E; } }
```

**Мелочи платформы для PWA на iPhone**
- `viewport-fit=cover` в мета-теге viewport и `env(safe-area-inset-*)`, в том числе внутри `max()`; изначально функция называлась `constant()` — [WebKit: Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/).
- Системный шрифт: `-apple-system`; ключевые слова Dynamic Type для свойства `font`: `-apple-system-body`, `-apple-system-headline`, `-apple-system-subheadline`, `-apple-system-caption1`, `-apple-system-caption2`, `-apple-system-footnote` и др. — задают стиль целиком, с размером и весом — [WebKit: Using the System Font in Web Content](https://webkit.org/blog/3709/using-the-system-font-in-web-content/).
- С iOS 26 любой сайт, добавленный на экран «Домой», по умолчанию открывается как веб-приложение, манифест для этого больше не обязателен — [WebKit Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/).
- В Safari на iOS 26 оттенок области вокруг страницы берётся из фона `body`, а при показе элемента с `position: fixed` — из его фона; автор разбора пишет, что мета-тег `theme-color` во вкладках Safari перестал действовать (статья от 16.11.2025; его баг WebKit 302272 закрыт как дубль решённого 300965) — [Ben Frain](https://benfrain.com/ios26-safari-theme-color-tab-tinting-with-fixed-position-elements/).
- `navigator.vibrate` в Safari не поддерживается — [MDN BCD, Navigator](https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/Navigator.json). Обходной путь — скрытый `<input switch>` с `<label>`; на этом построены `tijnjh/ios-haptics` (141 звезда, MIT, npm 3.3.0 от 25.10.2026, 4 480 Б) и `lochie/web-haptics` (2 842 звезды, MIT) — [поиск «ios-haptics»](https://api.github.com/search/repositories?q=ios-haptics&sort=stars&order=desc), [поиск «web-haptics»](https://api.github.com/search/repositories?q=web-haptics&sort=stars&order=desc), [npm ios-haptics](https://registry.npmjs.org/ios-haptics).
- Поддержка свойств из набросков по данным MDN: `touch-action: manipulation` — Safari 13+; `prefers-reduced-motion` — Safari 10.1+; `color-scheme` — Safari 13+; `prefers-reduced-transparency` — в Safari **нет** — [touch-action](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/touch-action.json), [media](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/at-rules/media.json), [color-scheme](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/color-scheme.json). `-webkit-tap-highlight-color` — нестандартное свойство; для настольного Safari в данных MDN стоит «нет» — [MDN BCD](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/-webkit-tap-highlight-color.json).
- `overscroll-behavior` — с Safari 16 (не действует на контейнеры без прокручиваемого переполнения); `text-box-trim` — Safari 18.2; `field-sizing` — Safari 26.2; позиционирование по якорю — Safari 26; `interpolate-size` в Safari нет — [MDN BCD, overscroll-behavior](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/overscroll-behavior.json), [text-box-trim](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/text-box-trim.json), [field-sizing](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/field-sizing.json), [anchor-name](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/anchor-name.json), [interpolate-size](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/interpolate-size.json).
- «Adaptive Dark Mode» (бета Safari 27.3, пост от 03.11.2026): Safari по желанию пользователя сам затемняет светлые сайты; сайты, объявившие `color-scheme` (мета-тегом или в CSS), не трогает; объявлять рекомендуют в `<head>` или на `:root`, а не скриптом — [WebKit: Introducing Adaptive Dark Mode](https://webkit.org/blog/18541/introducing-adaptive-dark-mode/).

### Inferences
- Для приложения с тёмной темой по умолчанию стоит явно объявить `color-scheme: dark` на `:root` и мета-тегом — это и корректные системные элементы форм, и страховка от автозатемнения Safari.
- Атрибут `switch` выгоден как прогрессивное улучшение: один и тот же `<input type="checkbox">` с `appearance: none` выглядит одинаково везде, а на iPhone дополнительно получает роль `switch` и тактильный отклик.
- «Сквиркл» на iPhone сейчас недостижим средствами CSS; вкладываться в него не стоит — разница с обычным `border-radius` на больших радиусах (24–32px, капсулы) малозаметна.
- Плавающий таббар с `position: fixed` и полупрозрачным фоном в обычной вкладке Safari 26 может влиять на оттенок системных областей; в режиме приложения с экрана «Домой» панелей Safari нет, но поведение стоит проверить в рамке и на устройстве.

### Gaps
- Официальных размеров Apple (в пунктах) для переключателя, сегментов, строк списка, таббара, ручки листа, радиусов в iOS 26/27 в HIG нет; источник — Apple Design Resources (Figma/Sketch), сегодня не открывался — НЕ ПРОВЕРЕНО. Все числа в рецептах — из открытых библиотек или помечены как заготовки.
- Работают ли `theme-color` и `apple-mobile-web-app-status-bar-style` в режиме приложения с экрана «Домой» на iOS 26/27 — НЕ ПРОВЕРЕНО (источники расходятся; нужен тест на устройстве). В поиске всплыли сообщения о регрессиях: на форуме пишут, что с iOS 26.1 пропал эффект `black-translucent`; есть баги WebKit о строке состояния в веб-приложениях с экрана «Домой» ([316008](https://bugs.webkit.org/show_bug.cgi?id=316008)) и о неверных `100vh`/`lvh` без `black-translucent` ([301994](https://bugs.webkit.org/show_bug.cgi?id=301994)) — сами баги не читались, текущий статус неизвестен.
- Поддержка `-webkit-tap-highlight-color` именно в Safari на iOS по данным MDN сегодня не выведена (проверена только строка настольного Safari) — НЕ ПРОВЕРЕНО.
- Требует ли трюк с тактильным откликом жеста пользователя и не закрыт ли он в iOS 27 — НЕ ПРОВЕРЕНО (в выдаче поиска упоминался баг WebKit 285120, сам баг не читался).
- Ни один набросок не запускался в браузере; перед использованием — проверка в рамке iPhone и на устройстве.

## 8. Есть ли поддерживаемый открытый «iOS UI kit для веба», который следит за iOS 26 / iOS 27

### Takeaway
Честный ответ: зрелого независимого набора, который можно просто подключить к обычной странице, нет. За iOS 26 следят Framework7 v9 и Konsta UI v5 (но это фреймворки), Puppertino 2.0 (чистый CSS, заявляет шкалу iOS 27, проекту в новом виде месяц) и сторонняя тема для Ionic; сам Ionic 9 про iOS 26 молчит, Onsen UI не обновлял оформление.

### Cited Findings
- Framework7 9.0.0 (25.11.2025) — новые стили iOS 26 во всех компонентах; актуальная 9.3.0 (30.10.2026) — [Releases](https://github.com/framework7io/framework7/releases), [npm](https://registry.npmjs.org/framework7).
- Konsta UI v5 (с 18.08.2025; актуальная 5.5.0 от 28.09.2026) — заявлен обновлённый вид iOS 26 — [konstaui.com](https://konstaui.com/), [npm](https://registry.npmjs.org/konsta).
- Puppertino 2.0.0 (06.10.2026): в исходниках упоминаются «iOS 27 type scale», единый синий `#0088FF`/`#0091FF`, Liquid Glass — [typography.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/typography.css), [colors.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/colors.css).
- `ionic-theme-ios27` (176 звёзд, обновлён 11.11.2026; npm `@rdlabo/ionic-theme-ios27` 2.1.3) — тема iOS 26/27 поверх Ionic — [npm](https://registry.npmjs.org/@rdlabo%2Fionic-theme-ios27), [README](https://raw.githubusercontent.com/webview-native-ui/ionic-theme-ios27/main/README.md).
- Ionic 9: в руководстве по обновлению и в релизах 9.0.x iOS 26 и Liquid Glass не упоминаются — [Ionic 9 upgrade guide](https://ionicframework.com/docs/updating/9-0), [Releases](https://github.com/ionic-team/ionic-framework/releases).
- Onsen UI: единственный релиз после 2022 года — 2.12.9 (16.06.2026); README по-прежнему описывает «flat (iOS)» оформление — [npm](https://registry.npmjs.org/onsenui), [README](https://raw.githubusercontent.com/OnsenUI/OnsenUI/master/onsenui/README.md).
- Молодые наборы под iOS 26: `kitlangton/ios-kit` (7 звёзд, все коммиты 11.10.2026), `mikhailmogilnikov/fluid-kit` (2 звезды), `JUNGHERZ/GlassKit` (16 звёзд) — [ios-kit](https://api.github.com/repos/kitlangton/ios-kit), [fluid-kit](https://api.github.com/repos/mikhailmogilnikov/fluid-kit), [GlassKit](https://api.github.com/repos/JUNGHERZ/GlassKit).
- iOS 27: пост WebKit о Safari 27.0 датирован 17.09.2026, о бете — 08.06.2026 (WWDC26) — [Safari 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/), [Safari 27 beta](https://webkit.org/blog/17967/news-from-wwdc26-webkit-in-safari-27-beta/). О выходе iOS 27 14.09.2026 сообщают вторичные источники — [MacRumors](https://macrumors.com/2026/09/09/apple-announces-ios-27-release-date/).
- Страница HIG о таббарах обновлялась 08.06.2026 («терминология и иллюстрации») — то есть язык Liquid Glass в iOS 27 продолжен, а не заменён — [Apple HIG — Tab bars (JSON)](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/tab-bars.json).

### Inferences
- «Отслеживание iOS 27» у открытых проектов сейчас в основном декларативное (названия и комментарии в коде); различия iOS 26 → iOS 27 по первичным материалам Apple в этом исследовании не разбирались, поэтому ориентироваться стоит на «язык iOS 26» как на базу.
- Практический вывод прежний: собственный небольшой слой стилей в лаборатории дизайна, со значениями из раздела 6 и рецептами из раздела 7, и сверка с Framework7 9.x / Puppertino 2.0 как с открытыми образцами.

### Gaps
- Официальная страница Apple о выходе iOS 27 не открывалась — дата 14.09.2026 только по вторичным источникам.
- Что именно изменилось в оформлении между iOS 26 и iOS 27 — НЕ ПРОВЕРЕНО.
