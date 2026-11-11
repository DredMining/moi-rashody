# Типографика денег и открытые шрифты для крупных рублёвых сумм

Дата проверки всех фактов: **2026-11-11**. Статус: итоговая версия; всё, что не удалось подтвердить источником, помечено «НЕ ПРОВЕРЕНО».

Как проверялось (чтобы было понятно, чему можно верить):

- **Шрифты** — файлы TTF из репозитория `google/fonts` и WOFF2 из пакетов Fontsource читались в память скриптом (на диск не сохранялись), разбирались таблицы `cmap` (какие символы есть), `hmtx` (ширины), `GSUB` (OpenType-функции и что именно они заменяют), `fvar` (оси), `name` (версия). Это первичные данные, а не пересказ блогов. Ширины даны в тысячных долях кегля (1/1000 em) для мастера по умолчанию.
- **Intl.NumberFormat** — запуск на этой машине: Node v26.13.0, ICU 78.3, CLDR 48.0 (тот же движок V8/ICU, что в Chrome). Safari отсюда проверить нельзя.
- **Поддержка в браузерах** — база MDN browser-compat-data v8.1.8 от 2026-11-02 (на ней построены таблицы MDN и caniuse).
- **Размеры файлов Fontsource** — API jsDelivr (список файлов пакета с размерами).
- Оценки и выводы автора заметок помечены словом **«Оценка»** или вынесены в «Inferences».

## 1. Теория: табличные и пропорциональные, прописные и старостильные цифры

### Takeaway
Табличные цифры (все одной ширины) нужны там, где числа стоят столбцом или меняются на глазах; пропорциональные — там, где одно число читается как слово. Старостильные (с выносными элементами, «минускульные») в интерфейсах денег не используют: суммы набирают прописными (lining) цифрами.

### Cited Findings
- Shopify Polaris (по выдаче поиска; сама страница переехала и дословно не прочитана): табличные цифры делают цифры одной ширины, чтобы списки выравнивались; в админке Shopify их применяют ко всем денежным суммам; использовать моноширинный шрифт как замену не советуют — [Polaris, Typography → Using type](https://polaris.shopify.com/design/typography/using-type) (301 → shopify.dev, НЕ ПРОВЕРЕНО дословно).
- В дизайн-системе Dash денежные столбцы набираются с `font-variant-numeric: tabular-nums`, иначе строки «плывут» — [brand.dash.fi, Tabular numerics](https://brand.dash.fi/foundations/data-viz) (по выдаче поиска).
- Общая типографская рекомендация: пропорциональные цифры — предпочтительный вариант для заголовков, подзаголовков и сплошного текста, то есть везде, где не нужно вертикальное выравнивание; табличные — когда числа стоят друг под другом (прайс-листы, меню) — [Fonts.com, Fontology: Proportional vs. Tabular Figures](https://www.fonts.com/content/learning/fontology/level-3/numbers/proportional-vs-tabular-figures) (по выдаче поиска).
- Мнение (не норма): участник форума шрифтовых дизайнеров Typedrawers пишет, что у акцидентного (display) шрифта цифры должны быть пропорциональными прописными — [Typedrawers, Proportional vs. Tabular Numbers](https://typedrawers.com/discussion/comment/15726) (по выдаче поиска).
- Raleway — пример шрифта, где цифры по умолчанию старостильные: в файле есть функция `lnum` (переключает на прописные), но нет ни `tnum`, ни `pnum`, ни `onum`; ширины цифр по умолчанию разные (608/375/486/521/518/537/595/535/581/579) — [google/fonts ofl/raleway](https://github.com/google/fonts/tree/main/ofl/raleway) (разбор файла, Version 4.026).
- У разных шрифтов «по умолчанию» разное. Табличные по умолчанию: IBM Plex Sans (600), Roboto (562), Roboto Flex (564), Nunito и Nunito Sans (600), Noto Sans (572), Open Sans (572), Source Sans 3 (472), Mulish (600), PT Sans (545), Ubuntu Sans (564), Segoe UI (539). Пропорциональные по умолчанию: Inter, Manrope, Golos Text, Onest, Geist, Montserrat, Rubik, Unbounded, Wix Madefor, TikTok Sans, Google Sans, SN Pro, Segoe UI Variable — разбор файлов из [google/fonts](https://github.com/google/fonts/tree/main/ofl) и `C:\Windows\Fonts` (см. таблицы в разделах 10–11).

### Inferences
- Для этого приложения: суммы в списках операций, столбцы, счётчики и любые меняющиеся числа — табличные; одна крупная статичная сумма баланса может быть пропорциональной (выглядит плотнее), но если она пересчитывается при вводе или анимируется — тоже табличная, иначе число «дрожит».
- Если шрифт табличный по умолчанию и не имеет `pnum` (IBM Plex Sans, Nunito, Mulish), пропорциональных цифр в нём нет вообще — крупная сумма будет с «дырой» вокруг единицы.

### Gaps
- Высказываний именно дизайнеров банковских приложений о крупной сумме баланса не найдено: есть только общая типографская рекомендация (Fonts.com) и частное мнение на форуме. Вывод «для одиночной крупной суммы пропорциональные цифры выглядят плотнее» — рассуждение из механики ширин, а не цитата.
- Practical Typography (Butterick), Typography.com, Google Fonts Knowledge о цифрах — не открывались в этой сессии, НЕ ПРОВЕРЕНО.

## 2. CSS и OpenType: `font-variant-numeric` против `font-feature-settings`, поддержка, системные шрифты

### Takeaway
Для цифр использовать высокоуровневое `font-variant-numeric` (поддерживается везде с 2016 года); `font-feature-settings` оставить только для того, чего в высокоуровневых свойствах нет (`ss01`, `cv11`, `case`). Важно: в сборках Google Fonts / Fontsource многие функции шрифта вырезаны — `zero`, `case`, `ss0x`, `cv0x` там просто не сработают.

### Cited Findings
- `font-variant-numeric` и все его значения (`tabular-nums`, `proportional-nums`, `lining-nums`, `oldstyle-nums`, `slashed-zero`, `diagonal-fractions`, `stacked-fractions`, `ordinal`): Chrome 52, Safari 9.1, Safari iOS 9.3, Firefox 34 — [MDN browser-compat-data v8.1.8](https://github.com/mdn/browser-compat-data), страница [MDN font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric).
- `font-feature-settings`: Chrome 48, Safari 9.1, Safari iOS 9.3, Firefox 34 — [MDN font-feature-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings) (данные BCD v8.1.8).
- MDN прямо советует по возможности использовать `font-variant` и его составные свойства (в том числе `font-variant-numeric`) вместо `font-feature-settings`: первые дают более предсказуемый и понятный результат, а `font-feature-settings` — низкоуровневое средство для случаев, когда иначе до функции шрифта не добраться. Свойство наследуется, вычисленное значение — «как указано» — [MDN font-feature-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings) (страница прочитана 2026-11-11).
- Системный шрифт Apple и `tabular-nums`: в наборе тестов WebKit есть тест, который применяет `font-variant-numeric: tabular-nums` к `-apple-system` и `system-ui` и проверяет, что функции шрифта к ним применяются — [WebKit LayoutTests, fast/text/system-font-features.html](https://webkit.googlesource.com/WebKit/+/master/LayoutTests/fast/text/system-font-features.html). В отчёте об ошибке Firefox 1540143 сказано, что с `-apple-system` свойство не работало в Firefox, а в Safari и Chrome ожидаемое поведение есть — [Bugzilla 1540143](https://bugzilla.mozilla.org/show_bug.cgi?id=1540143) (оба — по выдаче поиска).
- Функции Inter по описанию автора: `tnum` — табличные цифры; `zero` — перечёркнутый ноль; `case` — формы знаков, выровненные по прописным буквам и цифрам; `ss01` — открытые цифры; `cv01` — альтернативная единица, `cv02` — открытая четвёрка, `cv03` — открытая шестёрка, `cv04` — открытая девятка, `cv09` — тройка с плоским верхом. Рекомендуемый автором CSS: семейство `InterVariable` и `font-feature-settings: 'liga' 1, 'calt' 1` с пометкой «исправление для Chrome»; лицензия SIL OFL 1.1 — [rsms.me/inter](https://rsms.me/inter/) (прочитана первая половина страницы).
- `font-variant-alternates: styleset()/character-variant()` (высокоуровневая замена `"ss01"`/`"cv11"`): Chrome 111, Safari 16.2, Firefox 34; правило `@font-feature-values`: Chrome 111, Safari 9.1, Firefox 34 — [MDN font-variant-alternates](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-alternates) (BCD v8.1.8).
- Соответствие значений и OpenType-функций: `tabular-nums` → `tnum`, `proportional-nums` → `pnum`, `lining-nums` → `lnum`, `oldstyle-nums` → `onum`, `slashed-zero` → `zero`, `diagonal-fractions` → `frac`, `ordinal` → `ordn` — [W3C CSS Fonts 4, font-variant-numeric](https://www.w3.org/TR/css-fonts-4/#font-variant-numeric-prop) (по памяти автора, страница в этой сессии не открывалась — НЕ ПРОВЕРЕНО дословно).
- **Сборки Google Fonts/Fontsource урезаны.** В полном Inter (официальный `InterVariable.woff2`, 344,0 КБ) есть `calt case ccmp dlig dnom frac numr ordn pnum salt sinf subs sups tnum zero`, `ss01–ss08`, `cv01–cv14`. В файле Fontsource `inter-latin-wght-normal.woff2` (47,1 КБ) остались только `calt ccmp dnom frac locl numr pnum tnum` — нет `case`, `zero`, `ss01`, `cv11` — сравнение [rsms.me/inter/font-files/InterVariable.woff2](https://rsms.me/inter/font-files/InterVariable.woff2) и [@fontsource-variable/inter@5.3.0](https://cdn.jsdelivr.net/npm/@fontsource-variable/inter@5.3.0/files/inter-latin-wght-normal.woff2) (разбор GSUB обоих файлов).
- То же в других семействах Fontsource (латинский файл, вариативный): Manrope — `calt dnom frac liga locl numr pnum tnum`; Geist — `ccmp dnom frac liga locl numr pnum tnum`; Onest — `calt ccmp locl pnum tnum`; Golos Text — `calt ccmp frac locl pnum tnum`; TikTok Sans — `calt ccmp dnom frac locl numr pnum rvrn tnum`; IBM Plex Sans — `ccmp dnom frac liga numr` (нет `zero`); JetBrains Mono — `calt ccmp frac locl` (нет `zero`). `tnum`/`pnum` сохраняются везде, где они есть в исходнике — разбор файлов пакетов [@fontsource-variable/*](https://www.jsdelivr.com/package/npm/@fontsource-variable/manrope).
- Системные шрифты Windows (проверено на этой машине, Windows 11): **Segoe UI** (Version 5.72) — цифры табличные по умолчанию (539), есть `pnum`, `tnum`, `lnum`, `onum`, знак ₽ есть; **Segoe UI Variable** (Version 2.03, оси `wght 300–700`, `opsz 5–36`) — цифры по умолчанию пропорциональные (единица 379 против 539), есть `tnum`, знак ₽ есть — локальные файлы `C:\Windows\Fonts\segoeui.ttf`, `C:\Windows\Fonts\SegUIVar.ttf`; справка о шрифте: [Microsoft Typography, Segoe UI](https://learn.microsoft.com/en-us/typography/font-list/segoe-ui).

### Inferences
- `font-feature-settings` — одно свойство с одним значением: объявление на потомке целиком заменяет унаследованный список, а не дополняет его (чтобы добавить `"ss01"`, надо повторить и `"tnum"`). `font-variant-numeric` — отдельное свойство, с остальными `font-variant-*` не конфликтует и потому надёжнее в каскаде. (Вывод из того, что MDN описывает свойство как наследуемое с вычисленным значением «как указано»; отдельной фразы «списки не складываются» на странице MDN нет.)
- `tabular-nums` с системным шрифтом на iPhone (`system-ui`/`-apple-system` = SF Pro) должен работать: свойство поддерживается Safari с 9.3, и WebKit держит на это отдельный тест. Прямого теста на iPhone в этой сессии не было.
- В предпросмотре Chrome на Windows `system-ui` даёт Segoe UI Variable/Segoe UI — у них другие ширины и другие цифры по умолчанию, чем у SF Pro; вёрстка сумм на системном шрифте в рамке на Windows будет отличаться от iPhone. Свой подключённый шрифт убирает эту разницу.

### Gaps
- Текст спецификации CSS Fonts 4 (соответствие значений и OpenType-функций) в этой сессии не открывался.
- Работа `font-variant-numeric` с `system-ui` в Safari iOS 26 на устройстве не тестировалась.

## 3. Оптический размер (`opsz`), вариативные оси, вес и размер файлов

### Takeaway
`font-optical-sizing: auto` включён по умолчанию и работает во всех нужных браузерах, но ось `opsz` есть у немногих открытых шрифтов с кириллицей: Inter (14–32), Roboto Flex (8–144), TikTok Sans (12–36), Nunito Sans (6–12), Google Sans (17–18, фактически бесполезно). В Fontsource ось `opsz` лежит в отдельных файлах `*-opsz-normal.woff2`, они в 1,5–2,5 раза тяжелее файлов «только вес».

### Cited Findings
- `font-optical-sizing`: Chrome 79, Safari 13.1, Safari iOS 13.4, Firefox 62 — [MDN font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing) (BCD v8.1.8).
- `font-variation-settings`: Chrome 62, Safari 11, Firefox 62 — [MDN font-variation-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings) (BCD v8.1.8).
- Оси открытых шрифтов (из таблицы `fvar` файлов google/fonts): Inter `opsz 14–32, wght 100–900`; Roboto Flex `opsz 8–144, wght 100–1000, wdth 25–151, slnt, GRAD` + 8 параметрических; TikTok Sans `opsz 12–36, wdth 75–150, wght 300–900, slnt −6–0`; Google Sans Flex `opsz 1–144, wdth 25–151, wght 1–1000, ROND 0–100, slnt −10–0` (без кириллицы); Google Sans `opsz 17–18, wght 400–700, GRAD −50–200`; Nunito Sans `wght 200–1000, wdth 75–125, opsz 6–12, YTLC`; DM Sans `opsz 9–40, wght 100–1000` (без кириллицы); Bricolage Grotesque `opsz 12–96, wght 200–800, wdth 75–100` (без кириллицы); Big Shoulders `opsz 10–72` (без кириллицы) — [google/fonts ofl](https://github.com/google/fonts/tree/main/ofl).
- Fontsource кладёт `opsz` в отдельные файлы: `@fontsource-variable/inter@5.3.0` — `inter-latin-wght-normal.woff2` 47,1 КБ против `inter-latin-opsz-normal.woff2` 71,2 КБ; кириллица 18,3 против 28,9 КБ; latin-ext 83,1 против 130,2 КБ — [jsDelivr, список файлов пакета](https://data.jsdelivr.com/v1/packages/npm/@fontsource-variable/inter@5.3.0?structure=flat). В файле `*-opsz-*` действительно обе оси (`opsz 14–32; wght 100–900`), в `*-wght-*` — только `wght` (разбор `fvar`).
- Roboto Flex в Fontsource: `latin-wght` 33,5 КБ, `latin-opsz` 82,3 КБ, `latin-full` (все 13 осей) 318,8 КБ; кириллица 15,3 / 40,8 / 176,0 КБ — [@fontsource-variable/roboto-flex@5.3.0](https://data.jsdelivr.com/v1/packages/npm/@fontsource-variable/roboto-flex@5.3.0?structure=flat).
- Статические начертания (один вес) заметно легче: Inter latin 400 — 23,1 КБ, cyrillic 400 — 7,5 КБ; Manrope latin 400 — 13,8 КБ, cyrillic 400 — 7,7 КБ; Geist latin 400 — 12,7 КБ, cyrillic 400 — 6,0 КБ — [@fontsource/inter@5.3.0](https://data.jsdelivr.com/v1/packages/npm/@fontsource/inter@5.3.0?structure=flat), [@fontsource/manrope](https://data.jsdelivr.com/v1/packages/npm/@fontsource/manrope@5.3.0?structure=flat), [@fontsource/geist](https://data.jsdelivr.com/v1/packages/npm/@fontsource/geist@5.3.0?structure=flat).
- Segoe UI Variable тоже имеет `opsz 5–36` — локальный файл `C:\Windows\Fonts\SegUIVar.ttf`.
- У Mona Sans в репозитории GitHub (релиз v2.0.27) заявлен файл `MonaSansVF[wdth,wght,opsz,ital].woff2` с осью оптического размера 1–100; в сборке google/fonts (2.000) оси `opsz` нет; кириллица в README не упоминается — [github/mona-sans README](https://github.com/github/mona-sans#readme).

### Inferences
- Для баланса 40–56 px у Inter ось `opsz` упирается в максимум 32 (это «Inter Display»): буквы и цифры уже́ и плотнее, чем на 14. Для подписи 13 px используется минимум 14. Если подключить файл без `opsz` (`*-wght-*`), крупная сумма будет нарисована «текстовым» рисунком — шире и рыхлее; это лечится отрицательным трекингом, но рисунок цифр останется текстовым.
- Вес: вариативная ось позволяет поставить промежуточное значение (`font-weight: 620` или `650`) — это штатный способ, `font-variation-settings: "wght" 650` нужен только для нестандартных осей (`GRAD`, `ROND`), потому что он тоже перезаписывается целиком и ломает `font-weight`/`font-optical-sizing` в каскаде. (Общеизвестная рекомендация; дословный источник в сессии не открывался — НЕ ПРОВЕРЕНО дословно.)
- Одиночное приложение без сборки: если нужны 2–3 веса, вариативный файл (Manrope: 24,3 + 14,2 + 14,8 КБ = 53,3 КБ на latin + cyrillic + latin-ext) выгоднее трёх статических наборов (≈3 × 30 КБ).

### Gaps
- Какой именно единице равен `opsz` в Safari и Chrome (px или pt) — НЕ ПРОВЕРЕНО.
- Самостоятельная обрезка шрифта до «цифры + кириллица + ₽» (pyftsubset / glyphhanger) не выполнялась; размеры такого файла — НЕ ПРОВЕРЕНО.

## 4. Трекинг (межбуквенный интервал) для крупных цифр

### Takeaway
У Apple трекинг зависит от кегля, и в таблице HIG для SF Pro на крупных размерах он **слегка положительный** (на 48 pt: +8/1000 em), потому что уплотнение уже заложено в оптический размер. Отрицательный трекинг (−0,02 em и подобное) нужен шрифтам без оси `opsz` или когда она не подключена.

### Cited Findings
- Таблица трекинга SF Pro (iOS): 13 pt −6; 15 pt −16; 17 pt −26 (−0,43 pt); 20 pt −23; 22 pt −12; 24 pt +3; 28 pt +14 (+0,38 pt); 34 pt +12 (+0,40 pt); 40 pt +10; 48 pt +8 (+0,35 pt); 56 pt +6; 64 pt +4; 72 pt +2; 80 pt и больше — 0 (единицы: 1/1000 em) — [Apple HIG, Typography → Tracking values](https://developer.apple.com/design/human-interface-guidelines/typography) (данные сняты из JSON страницы).
- SF Pro Rounded: 17 pt +22; 24 pt +15; 34 pt +12; 48 pt +8; 56 pt +6; 80 pt и больше — 0 — там же.
- SF Compact (watchOS): 17 pt −4; 34 pt −18; 48 pt −20; 72 pt −24; New York (антиква): 34 pt −14; 48 pt −14 — там же.
- Формула «dynamic metrics» для Inter версии 3 (без оси `opsz`): трекинг = a + b × e^(c × z), где z — кегль, a = −0,0223, b = 0,185, c = −0,1745 (результат в em) — [архив сайта Inter v3, dynmetrics](https://d.rsms.me/inter-website/v3/dynmetrics/). На текущем сайте эта страница удалена (404) — [rsms.me/inter/dynmetrics](https://rsms.me/inter/dynmetrics/).

### Inferences
- Подстановка в формулу Inter v3 (расчёт автора заметок): 13 px → −0,003 em; 17 px → −0,013 em; 24 px → −0,020 em; 32 px → −0,022 em; 48 px → −0,022 em. То есть привычное «−0,02 em для крупной суммы» — это значение для Inter без оптического размера.
- **Оценка.** Для Inter с осью `opsz` на 48 px трекинг ближе к нулю (0…−0,01 em): уплотнение уже заложено в дисплейный рисунок, как у SF Pro. Для файла без `opsz` (`*-wght-*`) и для шрифтов без этой оси (Manrope, Golos Text, Onest, Geist) на 40–56 px уместно −0,015…−0,03 em. Точное значение подбирать глазами в рамке.
- Отрицательный `letter-spacing` в em удобнее px: он масштабируется вместе с `clamp()`/`cqi`.
- У табличных цифр трекинг уменьшает и фиксированные «ячейки» — выравнивание столбцов сохраняется, если трекинг одинаков во всех строках.

### Gaps
- Рекомендаций автора Inter по трекингу именно для версии 4 (с осью `opsz`) не найдено: страница dynmetrics на текущем сайте удалена, формула есть только в архиве сайта версии 3.

## 5. Выравнивание «+», «−», «₽» с цифрами; функция `case`; мелкие копейки и приглушённый знак валюты

### Takeaway
Функция `case` поднимает знаки (минус, плюс, двоеточие, скобки, тире) на высоту прописных/цифр — но в сборках Fontsource/Google Fonts она вырезана, работает только с полным файлом шрифта. Ширина минуса и плюса в `tnum` равна цифре только у части шрифтов.

### Cited Findings
- В полном Inter `case` заменяет `+`, `-`, `−`, `:`, `(`, `–` на варианты той же ширины (другое вертикальное положение); в полном TikTok Sans — `+`, `-`, `−`, `:`, `(`; в Manrope — `-`, `:`, `(`, `–`; в Onest — `-`, `:`, `–`; в Plus Jakarta Sans — `+`, `-`, `−` — разбор GSUB файлов [google/fonts ofl](https://github.com/google/fonts/tree/main/ofl).
- В файлах Fontsource функция `case` отсутствует у Inter, Manrope, Geist, Onest, Golos Text, TikTok Sans (см. раздел 2) — [@fontsource-variable/inter](https://cdn.jsdelivr.net/npm/@fontsource-variable/inter@5.3.0/files/inter-latin-wght-normal.woff2).
- Что именно делает `tnum` (ширины после замены, 1/1000 em):
  - Inter: цифры 648; **также** пробел и неразрывный пробел 281→269, запятая и точка 288→269, двоеточие →269, `+` 662→648, `-` 460→648, `−` 662→648; знак ₽ (701) не меняется.
  - Google Sans: цифры 600; пробел, запятая, точка, двоеточие →300; `+`, `−`, `₽`, `€`, `$`, `%` →600.
  - TikTok Sans: цифры 600; `₽`, `€`, `$`, `%` →600; `+` и `−` и так 600.
  - Onest: цифры 672; запятая, точка, двоеточие →270.
  - Fira Sans: цифры 560; `+`, `−`, `₽`, `€`, `$` →560.
  - Manrope (620), Geist (600), Montserrat (700), Rubik (600), Unbounded (780), Jost (580), Geologica (648): меняются **только цифры**; минус/плюс остаются своей ширины (Manrope: `+` 580, `−` 540; Geist: `+` 558, `−` 520).
  - Источник: разбор GSUB/hmtx файлов [google/fonts ofl](https://github.com/google/fonts/tree/main/ofl).
- Ширина «−» (U+2212) и «+» одинакова у Inter (662/662), Golos Text (550/550), Onest (550/550), IBM Plex Sans (600/600 — равны цифре), Nunito (600/600 — равны цифре), Wix Madefor Display (660/660), Montserrat (560/560); не одинакова у Manrope (`+` 580, `−` 540), Geist (558/520) — там же.
- Положение знака по высоте (1/1000 em от базовой линии; «середина» — центр рисунка знака; мастер по умолчанию) — разбор таблиц `glyf` и `GSUB` файлов [google/fonts ofl](https://github.com/google/fonts/tree/main/ofl) и `C:\Windows\Fonts\segoeui.ttf`:

| Шрифт | Середина цифры «0» | Середина «−» и «+» | Разница | С функцией `case` (полный файл) |
|---|---|---|---|---|
| Inter | 364 | 285 | **−79** | 364 / 361 — точно по цифрам |
| Google Sans | 358 | 271 | **−87** | для минуса замены нет |
| TikTok Sans | 352 | 272 | **−80** | 342 |
| Nunito | 353 | 287 / 284 | **−66** | нет |
| Geist | 355 | 295 | **−60** | для минуса замены нет |
| Segoe UI | 350 | 292 | −58 | нет |
| Rubik | 350 | 300 | −50 | 350 / 347 |
| Martian Mono | 400 | 350 | −50 | 400 |
| IBM Plex Sans | 349 | 305 | −44 | нет |
| JetBrains Mono | 365 | 330 | −35 | нет |
| Roboto Flex | 356 | 329 | −27 | нет |
| Unbounded | 375 | 354 | −21 | нет |
| Manrope | 360 | 360 | **0** | не нужна |
| Onest | 354 | 354 | **0** | не нужна |
| Montserrat | 350 | 350 | **0** | не нужна |
| Wix Madefor Display | 358 | 357 | −1 | не нужна |
| SN Pro | 335 | 341 | +6 | не нужна |
| Golos Text | 350 | 360 | +10 | не нужна |

  Разница −79 означает, что на кегле 48 px минус стоит на 3,8 px ниже середины цифр.
- Лебедев в «Ководстве» (§ 97, 15.01.2003): минус и дефис — разные знаки; в хороших шрифтах минус выровнен по высоте прописных знаков, то есть и цифр; во многих шрифтах знака минуса нет вовсе — [Ководство, § 97 «Тире, минус и дефис»](https://www.artlebedev.ru/kovodstvo/97/).

### Inferences
- Чтобы суммы «+85 237 ₽» и «−25 426,50 ₽» не прыгали по ширине при смене знака, минус и плюс должны быть одной ширины. У Inter (с `tnum`), IBM Plex Sans, Nunito, Google Sans, TikTok Sans это выполняется само; у Manrope и Geist — нет, там знак лучше вынести в отдельный `<span>` фиксированной ширины (`display:inline-block; width:0.62em; text-align:center`).
- Если минус стоит ниже середины цифр, а `case` недоступна (Geist, Google Sans, Nunito, IBM Plex Sans; Inter и TikTok Sans в сборке Fontsource), знак можно поднять вручную: обернуть в `<span>` и задать `position: relative; top: -0.06em` — величину взять из таблицы (разница 60 = 0,06 em). У Manrope, Onest, Montserrat, Wix Madefor, Golos Text, SN Pro поправка не нужна.
- Приём «крупные рубли + мелкие копейки» и «приглушённый знак ₽» делается обычными `<span>` с `font-size: 0.6em`/`opacity` — не через `font-variant-position: super` (он рассчитан на верхние индексы и у шрифта может не быть нужных глифов). Мелкую часть выравнивать по базовой линии (по умолчанию), а не по верху — так устойчивее при смене шрифта.
- Доступность: экранный диктор должен прочитать сумму целиком. Разбитую на `<span>` сумму лучше дублировать `aria-label="110 663 рубля 50 копеек"` на контейнере и скрыть части через `aria-hidden="true"`; минус U+2212 VoiceOver читает как «минус», дефис может пропустить — НЕ ПРОВЕРЕНО на устройстве. Приглушённые копейки/знак должны сохранять контраст не ниже 4,5:1 для мелкого текста (WCAG 1.4.3) — общее требование, в этой сессии источник не открывался.

### Gaps
- Какие приёмы (мелкие копейки, приглушённый ₽) используют конкретные банковские приложения — НЕ ПРОВЕРЕНО источниками.
- Метрики положения знака сняты с мастера по умолчанию вариативного файла; на других весах положение может немного отличаться — не проверялось.

## 6. Защита от обрезания и переполнения длинных сумм на экране 440 px

### Takeaway
Надёжная схема для iPhone Safari: `white-space: nowrap` + размер через `clamp()` с контейнерными единицами `cqi` + короткий JS «уменьшить, если не влезло». Чисто CSS-свойство `text-fit` есть только в Chrome 150+, в Safari его нет. `text-box-trim` уже можно использовать (Safari 18.2+, Chrome 133+, Firefox 154+).

### Cited Findings
- Контейнерные единицы (`cqi`, `cqw`) и `@container`: Chrome 105, Safari 16, Firefox 110 — [MDN, container query length units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#container_query_length_units) (BCD v8.1.8).
- `clamp()`: Chrome 79, Safari 13.1 (iOS 13.4), Firefox 75 — [MDN clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp) (BCD v8.1.8).
- `text-wrap: balance`: Chrome 114, Safari 17.5, Firefox 121; `text-wrap: pretty`: Chrome 117, Safari 26, Firefox — нет — [MDN text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap) (BCD v8.1.8).
- `text-box-trim`, `text-box-edge`, сокращение `text-box`: Chrome 133, Safari 18.2 (и iOS 18.2), Firefox 154; значения `cap`, `ex`, `alphabetic`, `text` поддержаны всеми тремя; на строчных (inline) элементах: Chrome — нет, Safari 26.5 — частично, Firefox 154 — да — [MDN text-box-trim](https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim) (BCD v8.1.8); о Firefox 154 также [web.dev, New to the web platform in August 2026](https://web.dev/blog/web-platform-08-2026).
- `text-fit` (подгонка размера текста под ширину, значения `grow`, `shrink`, `per-line`, `consistent`): Chrome 150 и Chrome Android 150, статус «experimental»; Safari — нет; Firefox — нет; свойств `text-grow`/`text-shrink` в базе нет — [MDN browser-compat-data v8.1.8](https://github.com/mdn/browser-compat-data) (ключ `css.properties.text-fit`).
- `font-size-adjust`: Chrome 127, Safari 16.4, Firefox 3; значение `from-font` и двухзначная форма (`cap-height 0.7`): Chrome 127, Safari 17, Firefox 118/92 — [MDN font-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust) (BCD v8.1.8).
- Дескриптор `size-adjust` в `@font-face` (подгонка запасного шрифта под основной): Chrome 92, Safari 17, Firefox 92 — [MDN @font-face size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust) (BCD v8.1.8).
- `letter-spacing` в процентах: Chrome 145, Safari 17.4, Firefox 133 — [MDN letter-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing) (BCD v8.1.8).
- Библиотеки подгонки текста: fitty 2.4.2 (2023-11-17, MIT, 31 КБ в распакованном виде, без зависимостей; последний коммит 2023-11-17); textfit 2.4.0 (2019-06-18, MIT; последний коммит 2021-06-18) — [npm fitty](https://www.npmjs.com/package/fitty), [npm textfit](https://www.npmjs.com/package/textfit), [GitHub rikschennink/fitty](https://github.com/rikschennink/fitty), [GitHub STRML/textFit](https://github.com/STRML/textFit).
- Вертикальные метрики (1/1000 em; «верх + низ» — сумма верхнего и нижнего полей шрифта из таблицы `hhea`, «запятая» — на сколько она опускается ниже базовой линии): Inter 969 + 241 = 1210, запятая −175; Manrope 1066 + 300 = 1366, −95; Golos Text 980 + 220 = 1200, −150; Onest 970 + 305 = 1275, −121; Geist 1005 + 295 = 1300, −156; IBM Plex Sans 1025 + 275 = 1300, −133; Roboto Flex 928 + 244 = 1172, −142; Nunito 1011 + 353 = 1364, −97; TikTok Sans 1000 + 300 = 1300, −184; Google Sans 966 + 286 = 1252, −110 — разбор таблиц `hhea` и `glyf` файлов [google/fonts ofl](https://github.com/google/fonts/tree/main/ofl).
- Высота прописных букв и цифр (cap height, доля кегля): Unbounded 0,750; Inter 0,728; Manrope 0,720; Google Sans 0,716; Wix Madefor Display 0,715; Roboto и Roboto Flex 0,711; Geist 0,710; Onest 0,707; Nunito и TikTok Sans 0,705; Golos Text, Montserrat, Rubik, Segoe UI 0,700; IBM Plex Sans 0,698; SN Pro 0,670. Знак ₽ у всех равен по высоте прописной букве — таблицы `OS/2` и `glyf` тех же файлов.

### Inferences
- **Расчёт автора по метрикам Inter (табличные цифры, без трекинга).** Ширина строки в em: «110 663,50 ₽» и «−25 426,50 ₽» — 6,69 em; «+85 237 ₽» — 5,13 em; «1 250 000,00 ₽» — 7,61 em. При ширине экрана 440 px и полях по 16 px доступно 408 px: «1 250 000,00 ₽» влезает только при кегле ≤ 53,6 px, восьмизначная сумма с копейками («12 345 678,90 ₽», 8,26 em) — при ≤ 49 px. То есть фиксированные 56 px для баланса небезопасны — нужна подгонка.
- С табличными цифрами ширина строки предсказуема без измерения: её можно посчитать в JS по числу символов и передать в CSS-переменную, а размер задать как `min(3.5rem, calc(100cqi / var(--w-em)))`. Это работает во всех целевых браузерах (нужны только `cqi`).
- `text-wrap: balance` к одиночной сумме с `nowrap` не относится; он полезен для подписей под суммой.
- `overflow: hidden` вместе с `line-height: 1` может обрезать хвост запятой: у всех проверенных шрифтов «верх + низ» больше 1 em (1,17–1,37). Расчёт автора для Inter: при `line-height: 1` под базовой линией остаётся около 0,136 em, а запятая опускается на 0,175 em — на кегле 48 px срежется около 2 px. У Manrope запас есть (0,117 em против 0,095 em). Вывод: держать `line-height` ≥ 1,1 либо добавлять нижний `padding` и не ставить `overflow: hidden` на сам элемент суммы; для точной посадки цифр по высоте использовать `text-box: trim-both cap alphabetic` под `@supports`.
- Высота цифр у кандидатов почти одинакова (0,70–0,73 кегля; исключения — SN Pro 0,67 и Unbounded 0,75), поэтому при замене шрифта кегль суммы пересчитывать почти не придётся.
- `font-size-adjust` полезен, только если запасной шрифт (например, Segoe UI в рамке на Windows до загрузки основного) заметно отличается по высоте строчных; для цифр важнее `size-adjust` в `@font-face` запасного шрифта.

### Gaps
- Поведение `text-fit` в Chrome 150 вживую не проверялось; спецификация и точный синтаксис — НЕ ПРОВЕРЕНО.
- CSS-only приёмы «fit text» 2025–2026 (через `@property` + контейнерные запросы) — не изучались по источникам.

## 7. Русские правила записи денежных сумм

### Takeaway
Данные Unicode CLDR для русского: разряды разделяются неразрывным пробелом U+00A0, дробная часть — запятой, знак валюты после числа через U+00A0, группировка начинается уже с четырёх цифр («1 234»), знак минуса наследуется из корня — дефис-минус U+002D.

### Cited Findings
- `ru.xml` (ветка main): `<decimal>,</decimal>`, `<group>` = U+00A0; формат валюты `#,##0.00 ¤` с U+00A0 перед знаком; формат процентов `#,##0 %` с U+00A0; символ RUB — `₽` (U+20BD); `minusSign`, `plusSign`, `minimumGroupingDigits` наследуются от корня — [unicode-org/cldr, common/main/ru.xml](https://github.com/unicode-org/cldr/blob/main/common/main/ru.xml).
- В корневой локали `minusSign` = U+002D (дефис-минус), `plusSign` = `+`, `minimumGroupingDigits` = 1 — [unicode-org/cldr, common/main/root.xml](https://github.com/unicode-org/cldr/blob/main/common/main/root.xml).
- Последний выпуск CLDR на дату проверки — release-49 (2026-10-21) — [GitHub releases unicode-org/cldr](https://github.com/unicode-org/cldr/releases).
- Для сравнения (тот же тест): французский использует узкий неразрывный пробел U+202F для разрядов, шведский — типографский минус U+2212; русский — ни то ни другое — локальный тест `Intl.NumberFormat` (Node 26.13.0, ICU 78.3, CLDR 48), см. раздел 8.
- Лебедев, «Ководство», § 74 (28.10.2001): знак валюты (на примере доллара) в русских текстах ставится только справа от суммы; запись «100 $» приведена как правильная, «$100» — как неправильная; исключение — финансовые и биржевые тексты, где знак слева является отраслевым стандартом — [Ководство, § 74 «Доллар куда будем ставить?»](https://www.artlebedev.ru/kovodstvo/74/).
- Лебедев, «Ководство», § 159 (опубликован 25.03.2009, дополнен): Банк России утвердил графическое обозначение рубля 11 декабря 2013 года; знак рубля должен стоять с отбивкой (пробелом) от числа — [Ководство, § 159 «Принятие знака рубля»](https://www.artlebedev.ru/kovodstvo/159/).
- Лебедев, «Ководство», § 97 (15.01.2003): минус — отдельный знак, не дефис и не тире; по высоте он выровнен по прописным знакам и цифрам — [Ководство, § 97](https://www.artlebedev.ru/kovodstvo/97/). Правило «ширина минуса равна ширине плюса» в тексте параграфа не найдено; оно встречается только в пересказе — [Skillbox Media](https://skillbox.ru/media/design/simple-text-design/).
- Другие параграфы «Ководства» по теме: § 116 «Знак рубля», § 77 «Евро пришло», § 158 «Короткое тире», § 62 «Экранная типографика» (не читались) — [список параграфов](https://www.artlebedev.ru/kovodstvo/sections/).

### Inferences
- Какой пробел ставить: **U+00A0** — есть во всех проверенных шрифтах и во всех файлах-подмножествах; **U+202F** (узкий неразрывный) есть в полных файлах Inter, Golos Text, Onest, IBM Plex Sans, Noto Sans, Source Sans 3, но **отсутствует в латинских файлах Fontsource/Google Fonts** (проверено у Inter, Manrope, Geist, Onest, Golos Text, TikTok Sans, Roboto, IBM Plex Sans) — браузер возьмёт его из запасного шрифта с чужой шириной. **U+2009** (тонкий пробел) — разрывный, для сумм не годится. Практичный вывод: оставлять U+00A0 из `Intl`, а зазор между разрядами при желании сужать через CSS `word-spacing` (отрицательное значение в em).
- Минус: `Intl` для `ru-RU` выдаёт дефис-минус U+002D; типографски правильный знак — U+2212 «−» (он есть во всех проверенных шрифтах с кириллицей, кроме Noto Sans Display, Press Start 2P, Russo One, Scada). Заменять при выводе.

### Gaps
- В списке параграфов «Ководства» нет параграфа о разбивке чисел на разряды и о виде пробела между ними.
- Правило справочника Мильчина и Чельцовой о четырёхзначных числах (по памяти: «1000» пишется слитно, «10 000» — с пробелом) источником не подтверждено — НЕ ПРОВЕРЕНО. Данные CLDR и `Intl` разбивают и четырёхзначные числа («1 234»). Нормы ГОСТ не проверялись.
- Код знака рубля U+20BD подтверждён данными CLDR и таблицами `cmap` шрифтов; по документам самого Юникода не сверялся.

## 8. Что именно выдаёт `Intl.NumberFormat('ru-RU')`

### Takeaway
В движке V8 с ICU 78.3 / CLDR 48: `110 663,50 ₽` = цифры, U+00A0 между разрядами, запятая, U+00A0 перед `₽` (U+20BD). Минус — дефис-минус U+002D, плюс — обычный `+`. Узкого пробела U+202F и типографского минуса U+2212 в русской локали нет.

### Cited Findings
Локальный запуск (Node v26.13.0, ICU 78.3, CLDR 48.0, Unicode 17); в квадратных скобках — код символа. Справка по API: [MDN Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat); данные локали: [CLDR ru.xml](https://github.com/unicode-org/cldr/blob/main/common/main/ru.xml).

- `{style:'currency', currency:'RUB'}`:
  - `110663.5` → `110[U+00A0]663,50[U+00A0]₽`
  - `85237` → `85[U+00A0]237,00[U+00A0]₽`
  - `-25426.5` → `[U+002D]25[U+00A0]426,50[U+00A0]₽`
  - `1250000` → `1[U+00A0]250[U+00A0]000,00[U+00A0]₽`
  - `1234.5` → `1[U+00A0]234,50[U+00A0]₽` (четырёхзначное число тоже разбивается)
  - `0` → `0,00[U+00A0]₽`; `-0.004` → `[U+002D]0,00[U+00A0]₽` (получается «минус ноль»)
- `signDisplay:'always'`: `85237` → `+85[U+00A0]237,00[U+00A0]₽`; `0` → `+0,00[U+00A0]₽`.
- `signDisplay:'exceptZero'`: `85237` → `+85[U+00A0]237,00[U+00A0]₽`; `0` → `0,00[U+00A0]₽`; `-0.004` → `0,00[U+00A0]₽` (без минуса).
- `signDisplay:'negative'`: плюс не ставится, «минус ноль» убирается.
- `maximumFractionDigits:0`: `110663.5` → `110[U+00A0]664[U+00A0]₽` (округление halfExpand); `999.99` → `1[U+00A0]000[U+00A0]₽`.
- `trailingZeroDisplay:'stripIfInteger'`: `85237` → `85[U+00A0]237[U+00A0]₽`; `110663.5` → `110[U+00A0]663,50[U+00A0]₽`.
- `currencyDisplay:'code'` → `110[U+00A0]663,50[U+00A0]RUB`; `'name'` → `110[U+00A0]663,50 российского рубля` (обычные пробелы U+0020); `'narrowSymbol'` → как `symbol`.
- `currencySign:'accounting'` для `ru-RU` скобок не даёт: `-25426.5` → `[U+002D]25[U+00A0]426,50[U+00A0]₽`.
- Без валюты: `{minimumFractionDigits:2, maximumFractionDigits:2}` → `110[U+00A0]663,50`.
- `notation:'compact'`: `110663.5` → `111[U+00A0]тыс.`; `1250000` → `1,3[U+00A0]млн`.
- `style:'percent'`: `0.1` → `10[U+00A0]%` (неразрывный пробел перед знаком процента).
- `formatToParts(-25426.5)` → `minusSign "-"(U+002D)`, `integer "25"`, `group U+00A0`, `integer "426"`, `decimal ","`, `fraction "50"`, `literal U+00A0`, `currency "₽"`.
- `resolvedOptions()` по умолчанию: `minimumFractionDigits 2`, `maximumFractionDigits 2`, `useGrouping "auto"`, `signDisplay "auto"`, `roundingMode "halfExpand"`, `trailingZeroDisplay "auto"`.
- Поддержка опций: `signDisplay`, `notation`, `compactDisplay`, `currencySign`, `currencyDisplay: 'narrowSymbol'` — Chrome 77, Safari 14.1 (iOS 14.5), Firefox 78; `trailingZeroDisplay`, `roundingMode`, `roundingIncrement` — Chrome 106, Safari 15.4, Firefox 116; `minimumFractionDigits`, `maximumFractionDigits`, `useGrouping` — Chrome 24, Safari 10, Firefox 29 — [MDN browser-compat-data v8.1.8](https://github.com/mdn/browser-compat-data).
- Поддержка методов: `formatToParts` — Chrome 64, Safari 13, Firefox 58; `formatRange` — Chrome 106, Safari 15.4, Firefox 116 — [MDN browser-compat-data v8.1.8](https://github.com/mdn/browser-compat-data).

### Inferences
- Набор символов задаётся данными CLDR, а не движком, поэтому в Safari (ICU от Apple) для `ru-RU` ожидается то же самое (U+00A0, запятая, U+002D); различия возможны только при другой версии CLDR. Прямой тест в Safari не делался — НЕ ПРОВЕРЕНО.
- Не полагаться на точную строку `Intl` в тестах и сравнениях; собирать вывод через `formatToParts` и самому подставлять минус U+2212 и нужный пробел — так результат одинаков в любом браузере.
- Для приложения, которое хранит целые копейки: делить на 100 перед `format()` — это число с плавающей точкой; для сумм до ~10¹³ копеек ошибка не проявится, но надёжнее форматировать целые рубли (`Math.trunc(kop/100)`) и копейки (`kop % 100`, дополнить нулём) раздельно.

### Gaps
- Вывод Safari iOS 26 вживую — НЕ ПРОВЕРЕНО.
- В самом Chrome строки не снимались: тест шёл в Node на том же движке V8 с ICU 78.3; версия ICU в установленном Chrome может отличаться.

## 9. Библиотеки форматирования чисел: нужны ли они

### Takeaway
Для приложения без сборки, которое уже хранит деньги целыми копейками, библиотека не нужна: хватает встроенного `Intl.NumberFormat` + `formatToParts`. Старые numeral.js, accounting.js и odometer заброшены с 2017 года.

### Cited Findings
Данные реестра npm и страниц GitHub на 2026-11-11:

| Библиотека | Последняя версия (дата) | Лицензия | Размер пакета (распакованный) | Состояние репозитория |
|---|---|---|---|---|
| `Intl.NumberFormat` | встроен в браузер | — | 0 | — |
| [numeral](https://www.npmjs.com/package/numeral) | 2.0.6 (2017-03-27) | MIT | нет данных | [adamwdraper/Numeral-js](https://github.com/adamwdraper/Numeral-js): последний коммит 2017-03-27 — заброшена |
| [accounting](https://www.npmjs.com/package/accounting) | 0.4.1 (2014-07-16) | в npm не указана | нет данных | [openexchangerates/accounting.js](https://github.com/openexchangerates/accounting.js): последний коммит 2017-03-16 — заброшена |
| [currency.js](https://www.npmjs.com/package/currency.js) | 2.0.4 (2021-05-19); тег `next` от 2025-08-11 | MIT | 35 КБ, 0 зависимостей | [scurker/currency.js](https://github.com/scurker/currency.js): последний коммит 2025-08-11 |
| [dinero.js](https://www.npmjs.com/package/dinero.js) | 2.0.2 (2026-03-13) | MIT | 838 КБ, 0 зависимостей | [dinerojs/dinero.js](https://github.com/dinerojs/dinero.js): последний коммит 2026-07-06 |
| [big.js](https://www.npmjs.com/package/big.js) | 7.0.1 (2025-04-21) | MIT | 58 КБ | [MikeMcl/big.js](https://github.com/MikeMcl/big.js): последний коммит 2025-04-22 (точная арифметика, не форматирование) |
| [decimal.js](https://www.npmjs.com/package/decimal.js) | 10.6.0 (2025-07-06) | MIT | 278 КБ | [MikeMcl/decimal.js](https://github.com/MikeMcl/decimal.js): последний коммит 2026-08-30 (точная арифметика) |
| [@formatjs/intl-numberformat](https://www.npmjs.com/package/@formatjs/intl-numberformat) | 10.0.4 (2026-11-09) | MIT | ≈61 МБ (с данными всех локалей) | [formatjs/formatjs](https://github.com/formatjs/formatjs): активен; это полифил для старых браузеров |
| [number-flow](https://www.npmjs.com/package/number-flow) | 0.6.2 (2026-07-18) | MIT | 58 КБ, 1 зависимость | [barvian/number-flow](https://github.com/barvian/number-flow): последний коммит 2026-09-20; анимация смены цифр |
| [odometer](https://www.npmjs.com/package/odometer) | 0.4.8 (2017-02-05) | MIT | нет данных | [HubSpot/odometer](https://github.com/HubSpot/odometer): архивирован |
| [countup.js](https://www.npmjs.com/package/countup.js) | 2.10.1 (2026-07-02) | MIT | 1236 КБ (с исходниками и демо) | [inorganik/countUp.js](https://github.com/inorganik/countUp.js): последний коммит 2026-10-17 |

- Звёзды GitHub (страницы репозиториев, 2026-11-11): formatjs 14 754; Numeral-js 9 694; countUp.js 8 152; number-flow 7 796; odometer 7 287; decimal.js 7 271; dinero.js 6 811; big.js 5 203; accounting.js 4 976; fitty 3 854; currency.js 3 375; textFit 686. Лицензия MIT указана на страницах всех этих репозиториев, кроме formatjs и textFit, где она со страницы не считалась (в npm у обоих — MIT).
- number-flow описан автором как компонент анимированного числа для React, Vue, Svelte и для чистого TS/JS — [barvian/number-flow README](https://github.com/barvian/number-flow#readme).

### Inferences
- Минимальный путь: один объект `Intl.NumberFormat('ru-RU')` для целых рублей + ручная сборка копеек, знака и `₽` (см. рецепты в разделе 15). Копейки целыми числами уже решают задачу точности — big.js/decimal.js/dinero.js не нужны.
- Анимация цифр (number-flow, countup.js) требует табличных цифр, иначе число дёргается; для однофайлового приложения проще CSS-переход прозрачности, чем библиотека.

### Gaps
- Как подключить number-flow без сборщика (одним файлом) и сколько он весит в минифицированном виде — НЕ ПРОВЕРЕНО.
- Размер минифицированных сборок (gzip) — не измерялся.

## 10. Шорт-лист открытых шрифтов: проверенная таблица

### Takeaway
С кириллицей, знаком ₽, вариативной осью веса и рабочими табличными цифрами одновременно: **Inter, Manrope, Onest, Geist, IBM Plex Sans, Roboto Flex/Roboto, TikTok Sans, Google Sans, Nunito, Montserrat, Rubik**. Не подходят для русского интерфейса: **Google Sans Flex, Mona Sans, Hubot Sans, Google Sans Code** (нет кириллицы и ₽). С оговорками: **Golos Text и SN Pro** (функция `tnum` есть, но цифры после неё не равны по ширине), **Wix Madefor** (табличных цифр нет вообще).

### Cited Findings
Все строки — разбор файлов из [google/fonts](https://github.com/google/fonts/tree/main/ofl) (полные TTF) на 2026-11-11; лицензия у всех — SIL OFL 1.1 (поле `license` в METADATA.pb и запись в таблице `name`). «Циф. по умолч.» — ширины цифр по умолчанию: «проп.» — разные, «табл.» — одинаковые.

| Шрифт | Автор / репозиторий | Версия в google/fonts (дата файла) | Оси | Кир. | ₽ | U+2212 «−» | U+202F / U+2009 | Циф. по умолч. | `tnum` / `pnum` | Прочие функции цифр |
|---|---|---|---|---|---|---|---|---|---|---|
| **Inter** | Rasmus Andersson — [rsms/inter](https://github.com/rsms/inter) (20 056 звёзд; релиз v4.1 от 2024-11-16) | 4.001 (2024-05-24) | `opsz 14–32`, `wght 100–900` | да (+расш.) | да | да | да / да | проп. | `tnum` → 648 (и пробел, запятая, точка, `+`, `−`) / `pnum` | `zero`, `case`, `ss01–ss08`, `cv01–cv14`, `frac`, `sups` |
| **Manrope** | Mikhail Sharanda — [googlefonts/manrope](https://github.com/googlefonts/manrope) (исходный `sharanda/manrope` отдаёт 404) | 4.505 (2026-09-14) | `wght 200–800` | да (без расш.) | да | да | нет / нет | проп. | `tnum` → 620 (только цифры) / `pnum` | `case`, `frac`, `sups`; `zero` нет |
| **Golos Text** | Alexandra Korolkova, Vitaly Kuzmin (Paratype) — [googlefonts/golos-text](https://github.com/googlefonts/golos-text) (23 звезды) | 2.004 (2023-01-06) | `wght 400–900` | да (+расш.) | да | да | да / да | проп. | `tnum` **с дефектом**: 620/620/580/585/620/580/605/620/610/605 (цифры не равны) / `pnum` | `lnum`, `onum`, `case`, `frac` |
| **Onest** | Dmitri Voloshin, Andrey Kudryavtsev — [simpals/onest](https://github.com/simpals/onest) (71 звезда; релиз 2.001 от 2026-08-06) | 2.001 (2026-08-06) | `wght 100–900` | да (+расш.) | да | да | да / да | проп. | `tnum` → 672 (и запятая, точка, двоеточие → 270) / `pnum` | `case`, `ss01–ss02`, `sups` |
| **Geist** | Vercel / Basement Studio — [vercel/geist-font](https://github.com/vercel/geist-font) (3 750 звёзд; релиз v1.9.2 от 2026-11-06) | 1.800 (2026-04-02) | `wght 100–900` | да (+расш.) | да (широкий, 714) | да | нет / нет | проп. | `tnum` → 600 (только цифры) / `pnum` | `case`, `ss01–ss11`; `zero` нет |
| **Geist Mono** | там же | 1.701 (2026-05-20) | `wght 100–900` | да (+расш.) | да | да | нет / нет | моно 600 | — | `case`, `ss01–ss11` |
| **IBM Plex Sans** | Mike Abbink, Bold Monday — [IBM/plex](https://github.com/IBM/plex) (11 764 звезды) | 3.201 (2025-01-10) | `wght 100–700`, `wdth 75–100` | да (+расш.) | да | да | да / да | **табл. 600** | `tnum` не нужен; **`pnum` нет** | `zero`, `ss01–ss06`, `lnum`, `onum` |
| **Roboto Flex** | Font Bureau, David Berlow и др. — [googlefonts/roboto-flex](https://github.com/googlefonts/roboto-flex) (530 звёзд; релиз 3.200 от 2023-06-30) | 3.200 (2023-06-30) | `opsz 8–144`, `wght 100–1000`, `wdth 25–151`, `slnt`, `GRAD` + 8 параметрических | да (+расш.) | да (узкий, 500) | да | нет / да | **табл. 564** | `pnum` есть | — |
| **Roboto** | Christian Robertson — [googlefonts/roboto-classic](https://github.com/googlefonts/roboto-classic) | 3.015 (2026-01-14) | `wght 100–900`, `wdth 75–100` | да (+расш.) | да | да | нет / да | **табл. 562** | `pnum`, `tnum` | `lnum`, `onum`, `ss01–ss07` |
| **Google Sans** | Google — [googlefonts/googlesans](https://github.com/googlefonts/googlesans) (28 звёзд) | 14.000 (2026-06-10) | `opsz 17–18`, `wght 400–700`, `GRAD −50–200` | да (+расш.) | да | да | нет / да | проп. | `tnum` → 600 (цифры, `+`, `−`, `₽`, `€`, `$`, `%`; пробел и запятая → 300) / `pnum` | `zero`, `case`, `ss01–ss09` |
| **Google Sans Flex** | Google (OFL с ноября 2025 по вторичным источникам) | 5.000 (2026-10-09) | `opsz 1–144`, `wdth 25–151`, `wght 1–1000`, `ROND 0–100`, `slnt −10–0` | **нет** | **нет** | да | да / да | проп. | `tnum`, `pnum` | `zero` |
| **Google Sans Code** | Google, Universal Thirst — [googlefonts/googlesans-code](https://github.com/googlefonts/googlesans-code) (2 574 звезды) | 6.001 (2025-08-21) | `wght 300–800` | **нет** | **нет** | да | нет / нет | моно 600 | — | — |
| **Mona Sans** | GitHub, Degarism Studio — [github/mona-sans](https://github.com/github/mona-sans) (4 195 звёзд; релиз v2.0.27 от 2026-05-19) | 2.000 (2024-09-11) | `wdth 75–125`, `wght 200–900` | **нет** | **нет** | да | нет / нет | проп. | `tnum` → 600 / `pnum` | `case`, `ss01–ss08` |
| **Hubot Sans** | там же — [github/hubot-sans](https://github.com/github/hubot-sans) | 2.000 (2024-09-11) | `wdth 75–125`, `wght 200–900` | **нет** | **нет** | да | нет / нет | проп. | `tnum`, `pnum` | `case` |
| **TikTok Sans** | Grilli Type, Contrast Foundry, Type Network — [TikTok/TikTokSans](https://github.com/TikTok/TikTokSans) (релиз v4.000 от 2025-07-09) | 4.000 (2025-06-13) | `opsz 12–36`, `wdth 75–150`, `wght 300–900`, `slnt −6–0` | да (+расш.) | да | да | нет / да | проп. | `tnum` → 600 (цифры, `₽`, `€`, `$`, `%`) / `pnum` | `zero`, `case`, `cv01–cv05` |
| **Wix Madefor Display** | Dalton Maag — [wix-incubator/wixmadefor](https://github.com/wix-incubator/wixmadefor) | 3.100 (2023-08-08) | `wght 400–800` | да (без расш.) | да | да | нет / да | проп. | **нет ни `tnum`, ни `pnum`** | `case`, `frac` |
| **Wix Madefor Text** | там же | 3.100 (2023-08-08) | `wght 400–800` | да (без расш.) | да | да | нет / да | проп. | **нет** | `case`, `frac` |
| **Nunito** (округлый) | Vernon Adams, Cyreal, Jacques Le Bailly — [googlefonts/nunito](https://github.com/googlefonts/nunito) (архивирован) | 3.602 (2022-02-16) | `wght 200–1000` | да (+расш.) | да (600) | да (600) | нет / да | **табл. 600** | `pnum` нет | `onum`, `case`, `ss01–ss02` |
| **Nunito Sans** | Vernon Adams, Jacques Le Bailly и др. — [googlefonts/NunitoSans](https://github.com/googlefonts/NunitoSans) | 3.101 (2023-03-31) | `wght 200–1000`, `wdth 75–125`, `opsz 6–12`, `YTLC` | да (+расш.) | да | да | нет / да | **табл. 600** | `pnum` нет | `onum`, `case` |
| **SN Pro** (округлый) | Tobias Whetton, Supernotes — [supernotes/sn-pro](https://github.com/supernotes/sn-pro) (релиз 1.5.0 от 2025-05-29) | 1.005 (2025-12-07; в Google Fonts с 2025-12-03) | `wght 200–900` | да (+расш.) | да | да | нет / да | проп. | `tnum` **с дефектом**: на весе 400 — 600/600/591/570/593/600/600/576/600/590 / `pnum` | `onum`, `case`, `ss01–ss03` |
| **JetBrains Mono** | JetBrains — [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono) (релиз v2.304 от 2023-01-14) | 2.211 (2020-11-18) | `wght 100–800` | да | да | да | нет / нет | моно 600 | — | `zero`, `case` |
| **Martian Mono** | Roman Shamin, Evil Martians — [evilmartians/mono](https://github.com/evilmartians/mono) (релиз v1.1.0 от 2025-02-10) | 1.000 (2023-01-11) | `wght 100–800`, `wdth 75–112,5` | да | да | да | нет / нет | моно 750 | — | `case`, `cv01–cv02` |
| **IBM Plex Mono** | IBM/plex | 2.3 (2022-11-09), статический, 14 файлов | нет | да (+расш.) | да | да | нет / нет | моно 600 | — | `zero`, `ss01–ss05` |
| **Roboto Mono** | [googlefonts/RobotoMono](https://github.com/googlefonts/RobotoMono) | 3.001 (2025-03-31) | `wght 100–700` | да (+расш.) | **нет** | да | нет / да | моно 600 | — | — |
| **Montserrat** | Julieta Ulanovsky и др. — [JulietaUla/Montserrat](https://github.com/JulietaUla/Montserrat) | 9.000 (2024-10-17) | `wght 100–900` | да (+расш.) | да | да | нет / да | проп. | `tnum` → 700 / `pnum` | `lnum`, `onum`, `case` |
| **Rubik** | Hubert & Fischer и др. — [googlefonts/rubik](https://github.com/googlefonts/rubik) | 2.300 (2023-06-13) | `wght 300–900` | да (+расш.) | да | да | нет / нет | проп. | `tnum` → 600 / `pnum` | `zero`, `case` |
| **Unbounded** | NaN — [googlefonts/unbounded](https://github.com/googlefonts/unbounded) | 1.701 (2023-04-12) | `wght 200–900` | да (без расш.) | да | да | нет / нет | проп. | `tnum` → 780 / `pnum` | `case`, `ss01–ss04` |
| **Commissioner** | Kostas Bartsokas — [kosbarts/Commissioner](https://github.com/kosbarts/Commissioner) (релиз 1.012 от 2025-11-18) | 1.001 (2023-02-01) | `wght 100–900`, `slnt`, `FLAR`, `VOLM` | да (+расш.) | да | да | нет / да | проп. | в сборке google/fonts **нет** | `case`, `frac` |

Дополнительные проверки тех же шрифтов:

- Дефект `tnum` у Golos Text подтверждён на трёх файлах: вариативном из google/fonts, вариативном из Fontsource и статических 400 и 600 из Fontsource (на 600: 639/639/599/604/639/599/624/639/629/624) — [@fontsource/golos-text@5.3.0](https://cdn.jsdelivr.net/npm/@fontsource/golos-text@5.3.0/files/golos-text-latin-600-normal.woff2), [google/fonts ofl/golostext](https://github.com/google/fonts/tree/main/ofl/golostext). Заменяются все 10 цифр, но у «2, 3, 5, 6, 8, 9» табличный вариант имеет ту же ширину, что пропорциональный.
- Дефект `tnum` у SN Pro: на весе 200 — 600/600/577/554/580/600/600/537/600/590; на 400 — 600/600/591/570/593/600/600/576/600/590; на 600 — 600/600/600/580/600/600/600/600/600/590 — [@fontsource/sn-pro@5.3.0](https://cdn.jsdelivr.net/npm/@fontsource/sn-pro@5.3.0/files/sn-pro-latin-400-normal.woff2), [google/fonts ofl/snpro](https://github.com/google/fonts/tree/main/ofl/snpro).
- Версии Fontsource могут отставать от google/fonts: Manrope в Fontsource — Version 4.504, в google/fonts — 4.505; Google Sans — 13.002 против 14.000 — разбор файлов [@fontsource-variable/manrope@5.3.0](https://cdn.jsdelivr.net/npm/@fontsource-variable/manrope@5.3.0/files/manrope-latin-wght-normal.woff2), [@fontsource-variable/google-sans@5.3.2](https://cdn.jsdelivr.net/npm/@fontsource-variable/google-sans@5.3.2/files/google-sans-latin-wght-normal.woff2).
- Google Sans Flex выпущен под SIL OFL 1.1 в ноябре 2025 (по Википедии — 18 ноября 2025); одновременно открыт и Google Sans — [Wikipedia, Product Sans](https://en.wikipedia.org/wiki/Product_Sans), [9to5Google, Google Fonts](https://9to5google.com/guides/google-fonts) (вторичные источники; официальный пост Google не найден). Лицензия OFL подтверждена расположением файлов в каталоге `ofl/` — [google/fonts ofl/googlesansflex](https://github.com/google/fonts/tree/main/ofl/googlesansflex), [ofl/googlesans](https://github.com/google/fonts/tree/main/ofl/googlesans).
- Не найдены ни в google/fonts, ни в Fontsource: **Golos UI**, **PT Root UI**, **Martian Grotesk**, **Cash Sans**; адреса `github.com/paratype/pt-root-ui` и `github.com/cashapp/cash-sans` отдают 404 — [api.fontsource.org/v1/fonts/golos-ui](https://api.fontsource.org/v1/fonts/golos-ui) (404). Martian Grotesk живёт в [evilmartians/grotesk](https://github.com/evilmartians/grotesk) (релиз v1.0.0 от 2025-06-03); лицензия и состав символов — НЕ ПРОВЕРЕНО.
- Commit Mono в Fontsource — только латиница, без ₽ (версия v1.132, 2024-07-15); в репозитории последний релиз v1.143 (2023-12-28) — [api.fontsource.org/v1/fonts/commit-mono](https://api.fontsource.org/v1/fonts/commit-mono), [eigilnikolajsen/commit-mono](https://github.com/eigilnikolajsen/commit-mono). Шрифтовые файлы Commit Mono — под SIL OFL, код сайта — под MIT; 2 205 звёзд — [README](https://github.com/eigilnikolajsen/commit-mono#readme).
- Официальный файл Geist из npm-пакета `geist@1.9.2` (`Geist-Variable.woff2`, 67,9 КБ, Version 1.900): латиница, кириллица и ₽ в одном файле, ось `wght 100–900`, функции `case`, `tnum`, `pnum`, `frac`, `sups`, `ss01–ss11` сохранены; U+202F и U+2009 нет; `zero` нет. `GeistMono-Variable.woff2` (69,5 КБ) — так же — [geist@1.9.2 на jsDelivr](https://cdn.jsdelivr.net/npm/geist@1.9.2/dist/fonts/geist-sans/Geist-Variable.woff2) (разбор файлов).
- Martian Grotesk: вариативный по весу и ширине, 63 статических начертания, заявлена поддержка 308 языков, из них 11 на кириллице; лицензия на странице репозитория — OFL-1.1; 300 звёзд; в Fontsource и google/fonts его нет (файлы — в релизах GitHub); наличие ₽ и `tnum` — НЕ ПРОВЕРЕНО — [evilmartians/grotesk](https://github.com/evilmartians/grotesk).
- Звёзды GitHub у остальных репозиториев (страницы репозиториев, 2026-11-11): JetBrains/JetBrainsMono 13 166; evilmartians/mono 2 746; github/hubot-sans 1 967; supernotes/sn-pro 775; kosbarts/Commissioner 256; TikTok/TikTokSans 213; wix-incubator/wixmadefor 42; googlefonts/manrope 4 (это зеркало для Google Fonts; исходный репозиторий автора недоступен). Лицензия на страницах всех перечисленных — OFL-1.1.

### Inferences
- «Кириллица: да (без расш.)» означает, что русский алфавит есть, а казахских/других букв расширенной кириллицы нет — для русского интерфейса это не важно.
- Версия Mona Sans в google/fonts (2.000) старее релиза в репозитории (v2.0.27); есть ли кириллица в новом релизе — НЕ ПРОВЕРЕНО. Версия Geist в google/fonts (1.800) старее релиза v1.9.2.
- Дефект `tnum` у Golos Text и SN Pro найден разбором таблиц и не проверялся глазами в браузере; перед отказом от этих шрифтов стоит один раз посмотреть столбец цифр в рамке.

### Gaps
- Качество кириллицы (форма «д», «л», «ж», «я») оценивается только глазами — в этой сессии не оценивалось.
- Есть ли кириллица в свежем релизе Mona Sans (v2.0.27) — НЕ ПРОВЕРЕНО (в README не упоминается; в сборке google/fonts её нет).
- Golos UI и PT Root UI: где сейчас лежат файлы и под какой лицензией — НЕ ПРОВЕРЕНО.

## 11. Длинный хвост: компактная таблица «да / нет»

### Takeaway
Из популярных «модных» гротесков кириллицы нет у Figtree, DM Sans, Plus Jakarta Sans, Outfit, Sora, Lexend, Instrument Sans, Hanken Grotesk, Albert Sans, Public Sans, Space Grotesk, Bricolage Grotesque, Reddit Sans. Знака ₽ нет у Open Sans, Roboto Mono, Sofia Sans, M PLUS Rounded 1c, Ubuntu (старого).

### Cited Findings
Разбор файлов [google/fonts](https://github.com/google/fonts/tree/main/ofl) на 2026-11-11. Лицензия OFL, кроме семейства Ubuntu (Ubuntu Font Licence, каталог `ufl/`).

| Шрифт (версия) | Кир. | ₽ | Табл. цифры | Вариативный | Примечание |
|---|---|---|---|---|---|
| Noto Sans (2.015) | да | да | по умолч. (572); `pnum` есть | `wght 100–900`, `wdth` | есть U+202F |
| Source Sans 3 (3.052) | да | да | по умолч. (472); `pnum` есть | `wght 200–900` | `zero`, U+202F |
| Fira Sans (4.203) | да | да | `tnum` → 560 (+ `+ − ₽ € $`) | нет, 18 файлов | `zero`, `case` |
| Ubuntu Sans (1.006, UFL) | да | да | по умолч. (564); `pnum` есть | `wdth 75–100`, `wght 100–800` | — |
| Ubuntu (0.83, UFL) | да | **нет** | по умолч. | нет | устарел |
| Open Sans (3.003) | да | **нет** | по умолч. (572); `pnum` есть | `wght 300–800`, `wdth` | `zero` |
| PT Sans (2.003) | да | да | по умолч. (545) | нет, 4 файла | Paratype |
| Mulish (3.603) | да | да | по умолч. (600); `pnum` нет | `wght 200–1000` | родственник Nunito без скруглений |
| Geologica (1.010) | да | да | `tnum` → 648 | `wght 100–900`, `slnt`, `CRSV`, `SHRP` | — |
| Exo 2 (2.010) | да | да | `tnum` → 620 (у «4» 615) | `wght 100–900` | — |
| Overpass (4.000) | да | да | `tnum` → 616 | `wght 100–900` | `zero`, U+202F |
| Tektur (1.005) | да | да | `tnum` → 650 | `wdth`, `wght 400–900` | технический, `zero` |
| Jost (3.710) | да | да | `tnum` → 580 | `wght 100–900` | геометрический |
| Sofia Sans (4.101) | да | **нет** | `tnum` → 630 | `wght 1–1000` | — |
| Oswald (4.103) | да | да | **нет** | `wght 200–700` | узкий акцидентный |
| Raleway (4.026) | да | да | **нет**; цифры старостильные по умолч. | `wght 100–900` | пример «как не надо» |
| Comfortaa (3.105) | да | да | **нет** | `wght 300–700` | округлый геометрический |
| M PLUS Rounded 1c (1.059) | да | **нет** | по умолч. (620) | нет, 7 файлов по 3,3 МБ | округлый |
| Varela Round (3.010) | **нет** | да | по умолч. | нет | — |
| Play (2.101) | да | да | по умолч. (580) | нет | — |
| Figtree (2.002) | **нет** | **нет** | `tnum` → 620 | `wght 300–900` | — |
| DM Sans (4.004) | **нет** | да | **нет** | `opsz 9–40`, `wght 100–1000` | — |
| Plus Jakarta Sans (2.071) | **нет** | да | `tnum` → 600 | `wght 200–800` | — |
| Outfit (1.100) | **нет** | **нет** | `tnum` → 590 | `wght 100–900` | — |
| Sora (2.000) | **нет** | **нет** | `tnum` → 676 | `wght 100–800` | — |
| Lexend (1.007) | **нет** | да | **нет** | `wght 100–900` | `zero` |
| Instrument Sans (1.000) | **нет** | **нет** | `tnum` → 600 | `wdth`, `wght 400–700` | — |
| Hanken Grotesk (3.013) | **нет** (только осколки расш. кириллицы) | да | по умолч. (560) | `wght 100–900` | — |
| Albert Sans (1.025) | **нет** | да | **нет** | `wght 100–900` | — |
| Public Sans (2.001) | **нет** | **нет** | `tnum` → 700 | `wght 100–900` | — |
| Space Grotesk (2.000) | **нет** | да | `tnum` → 620 | `wght 300–700` | — |
| Reddit Sans (1.014) | **нет** | да | `tnum` → 608 | `wght 200–900` | — |
| Bricolage Grotesque (1.001) | **нет** | да | `tnum` → 580 | `opsz 12–96`, `wght`, `wdth` | — |
| Recursive (1.085) | **нет** (только осколки расш.) | да | по умолч. (600) | `MONO`, `CASL`, `wght 300–1000`, `slnt`, `CRSV` | — |
| Source Code Pro (1.026) | да | да | моно | `wght 200–900` | `zero` |
| Fira Code (5.002) | да | да | моно | `wght 300–700` | `zero` |
| Noto Sans Mono (2.014) | да | да | моно | `wght 100–900`, `wdth` | `zero` |
| Overpass Mono (4.000) | да | да | моно | `wght 300–700` | `zero` |
| Ubuntu Sans Mono (1.006, UFL) | да | да | моно | `wght 400–700` | — |
| PT Mono (1.001) | да | да | моно | нет | — |
| Victor Mono (1.561) | да | **нет** | моно | `wght 100–700` | — |
| Cousine (1.241) | да | **нет** | моно | нет | — |
| Anonymous Pro (1.003) | да | **нет** | моно | нет | — |
| Space Mono, DM Mono, Chivo Mono, Red Hat Mono, Kode Mono, Sometype Mono, Spline Sans Mono, Doto | **нет** | — | моно | — | не подходят |
| Акцидентные: Bebas Neue (нет кир., нет ₽), Anton (нет кир.), Big Shoulders (нет кир.; `opsz 10–72`), Russo One (кир. есть, ₽ нет), Press Start 2P (кир. и ₽ есть, пиксельный) | — | — | — | — | — |

### Inferences
- «Цифровых» акцидентных шрифтов с кириллицей и ₽ под открытой лицензией в google/fonts практически нет; выразительные крупные цифры реальнее получить из Unbounded, Montserrat, TikTok Sans (широкое начертание `wdth 150`), Tektur или Martian Mono.

### Gaps
- Шрифты вне google/fonts (Golos UI, PT Root UI, Martian Grotesk, Cash Sans) файлами не проверены.

## 12. Где брать WOFF2 для самостоятельного размещения и подводные камни подмножеств

### Takeaway
Fontsource раздаёт те же нарезанные файлы, что Google Fonts. **Знак ₽ лежит в файле `latin-ext`, а не в `cyrillic` и не в `latin`** — для рублёвого приложения нужны три файла: `latin` (цифры, минус, пробелы), `cyrillic` (буквы), `latin-ext` (₽). Узкого пробела U+202F в этих файлах нет.

### Cited Findings
- Диапазоны `unicode-range` подмножеств (одинаковы для всех семейств Google): `cyrillic` = `U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`; `latin` = `U+0000-00FF, …, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, …`; `latin-ext` = `…, U+20A0-20AB, U+20AD-20C0, …` (сюда попадает U+20BD ₽) — [api.fontsource.org/v1/fonts/inter](https://api.fontsource.org/v1/fonts/inter).
- Проверка по самим файлам (Inter, Manrope, Golos Text, статические 400): ₽ есть только в `latin-ext`; цифры, U+2212, U+00A0 — в `latin`; U+00A0 продублирован во всех трёх; U+202F нет ни в одном, хотя диапазон `U+2000-206F` его формально покрывает — [cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-400-normal.ttf](https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-400-normal.ttf) (разбор `cmap`).
- Имена и размеры вариативных файлов (пакет `@fontsource-variable/<id>`, каталог `files/`), на 2026-11-11 — [data.jsdelivr.com](https://data.jsdelivr.com/v1/packages/npm/@fontsource-variable/manrope@5.3.0?structure=flat):

| Шрифт | Пакет (версия) | `latin` | `cyrillic` | `latin-ext` (здесь ₽) | Итого три файла |
|---|---|---|---|---|---|
| Inter (только вес) | `@fontsource-variable/inter` 5.3.0 | `inter-latin-wght-normal.woff2` 47,1 КБ | `inter-cyrillic-wght-normal.woff2` 18,3 КБ | `inter-latin-ext-wght-normal.woff2` 83,1 КБ | 148,5 КБ |
| Inter (вес + opsz) | там же | `inter-latin-opsz-normal.woff2` 71,2 КБ | `inter-cyrillic-opsz-normal.woff2` 28,9 КБ | `inter-latin-ext-opsz-normal.woff2` 130,2 КБ | 230,3 КБ |
| Manrope | `@fontsource-variable/manrope` 5.3.0 | `manrope-latin-wght-normal.woff2` 24,3 КБ | `manrope-cyrillic-wght-normal.woff2` 14,2 КБ | `manrope-latin-ext-wght-normal.woff2` 14,8 КБ | 53,3 КБ |
| Golos Text | `@fontsource-variable/golos-text` 5.3.0 | 37,0 КБ | 21,5 КБ | 18,7 КБ | 77,2 КБ |
| Onest | `@fontsource-variable/onest` 5.3.1 | 33,0 КБ | 15,5 КБ | 27,8 КБ | 76,3 КБ |
| Geist | `@fontsource-variable/geist` 5.3.0 | 28,7 КБ | 14,7 КБ | 16,1 КБ | 59,5 КБ |
| Geist Mono | `@fontsource-variable/geist-mono` 5.3.0 | 22,6 КБ | 12,6 КБ | 14,4 КБ | 49,6 КБ |
| IBM Plex Sans (только вес) | `@fontsource-variable/ibm-plex-sans` 5.3.0 | 44,6 КБ | 28,8 КБ | 30,2 КБ | 103,6 КБ |
| Roboto Flex (только вес) | `@fontsource-variable/roboto-flex` 5.3.0 | 33,5 КБ | 15,3 КБ | 22,9 КБ | 71,7 КБ |
| Roboto Flex (вес + opsz) | там же | 82,3 КБ | 40,8 КБ | 57,6 КБ | 180,7 КБ |
| Roboto (только вес) | `@fontsource-variable/roboto` 5.3.0 | 42,1 КБ | 23,1 КБ | 28,7 КБ | 93,9 КБ |
| Google Sans (только вес) | `@fontsource-variable/google-sans` 5.3.2 | 35,1 КБ | 15,6 КБ | 21,0 КБ | 71,7 КБ |
| TikTok Sans (только вес) | `@fontsource-variable/tiktok-sans` 5.3.0 | 43,7 КБ | 21,7 КБ | 31,6 КБ | 97,0 КБ |
| Nunito | `@fontsource-variable/nunito` 5.3.0 | 38,2 КБ | 20,3 КБ | 34,8 КБ | 93,3 КБ |
| SN Pro | `@fontsource-variable/sn-pro` 5.3.0 | 46,1 КБ | 21,9 КБ | 40,6 КБ | 108,6 КБ |
| Montserrat | `@fontsource-variable/montserrat` 5.3.0 | 37,1 КБ | 23,3 КБ | 69,0 КБ | 129,4 КБ |
| Rubik | `@fontsource-variable/rubik` 5.3.0 | 34,5 КБ | 14,8 КБ | 18,9 КБ | 68,2 КБ |
| Unbounded | `@fontsource-variable/unbounded` 5.3.0 | 49,7 КБ | 30,7 КБ | 115,6 КБ | 196,0 КБ |
| JetBrains Mono | `@fontsource-variable/jetbrains-mono` 5.3.0 | 39,5 КБ | 11,8 КБ | 14,8 КБ | 66,1 КБ |
| Martian Mono (только вес) | `@fontsource-variable/martian-mono` 5.3.0 | 23,0 КБ | 10,3 КБ | 15,5 КБ | 48,8 КБ |
| Wix Madefor Display | `@fontsource-variable/wix-madefor-display` 5.3.0 | 19,7 КБ | 13,5 КБ | 12,2 КБ | 45,4 КБ |
| Nunito Sans (только вес) | `@fontsource-variable/nunito-sans` 5.3.0 | 30,3 КБ | 16,0 КБ | 27,3 КБ | 73,6 КБ |

  Имена файлов у всех по образцу `<id>-<подмножество>-<ось>-normal.woff2` (например `onest-cyrillic-wght-normal.woff2`).
- Полные (не нарезанные, со всеми функциями) файлы от авторов: Inter — `InterVariable.woff2` 344,0 КБ на [rsms.me/inter](https://rsms.me/inter/font-files/InterVariable.woff2) и в npm-пакете [inter-ui@4.1.1](https://www.jsdelivr.com/package/npm/inter-ui) (`/variable/InterVariable.woff2` 344,0 КБ; `/variable-latin/InterVariable-subset.woff2` 97,4 КБ); Geist — npm-пакет [geist@1.9.2](https://www.jsdelivr.com/package/npm/geist): `/dist/fonts/geist-sans/Geist-Variable.woff2` 67,9 КБ и `/dist/fonts/geist-mono/GeistMono-Variable.woff2` 69,5 КБ — в каждом латиница, кириллица и ₽ вместе, функции не вырезаны (разбор файлов). Внимание: `InterVariable-subset.woff2` из `inter-ui` (97,4 КБ) — только латиница, без кириллицы и без ₽, зато со всеми функциями и осью `opsz`.

### Inferences
- В `@font-face` для трёх файлов надо обязательно сохранить их `unicode-range` из CSS Fontsource — тогда браузер сам возьмёт ₽ из `latin-ext`, а буквы из `cyrillic`.
- Так как ₽ на экране денег есть всегда, файл `latin-ext` будет загружаться всегда; у Inter это 83 КБ ради одного знака. Варианты: (а) взять шрифт с маленьким `latin-ext` (Manrope 14,8 КБ, Geist 16,1 КБ, Golos 18,7 КБ); (б) взять полный файл автора: у Geist это один файл 67,9 КБ со всем нужным; у Inter — 344 КБ, из него стоит сделать собственное подмножество (цифры + кириллица + знаки + ₽), тогда сохранятся `case`, `zero`, `ss01`; (в) рисовать ₽ запасным системным шрифтом (на iPhone — SF Pro) — выглядит чужеродно.
- Service worker должен положить все три файла в кэш, иначе офлайн ₽ отрисуется системным шрифтом.

### Gaps
- Размер собственного подмножества «цифры + русская кириллица + ₽» не измерялся.
- Полные файлы от авторов Manrope, Onest, Golos Text, TikTok Sans (вне Google Fonts) не разбирались.

## 13. Рейтинги (оценка автора заметок)

### Takeaway
Ближе всего к SF Pro — Inter (полный файл с осью `opsz`), затем Geist. Для «премиальных» крупных цифр — TikTok Sans, Manrope, Google Sans, Unbounded, Montserrat. Это оценка по проверенным техническим свойствам; на вид шрифты в этой сессии не сравнивались.

### Cited Findings
- Технические свойства, на которые опирается оценка, — в таблицах разделов 10–12 (источник: разбор файлов [google/fonts](https://github.com/google/fonts/tree/main/ofl)).

### Inferences
**(i) Топ-5 «ближе всего к SF Pro» на Windows/Android — оценка.**
1. **Inter** — нео-гротеск той же школы, что SF; единственный с осью `opsz` (текстовый и дисплейный рисунок, как SF Pro Text/Display); в `tnum` табличными становятся и цифры, и пробел, и запятая, и плюс/минус; полный набор пробелов и ₽. Минус: в сборке Fontsource вырезаны `case`/`zero`/`ss01`, а `latin-ext` с ₽ весит 83 КБ.
2. **Geist** — строгий гротеск швейцарского толка, по характеру следующий после Inter; кириллица и ₽ есть; официальный файл — один, 67,9 КБ, со всеми функциями. Минусы: знак ₽ шире цифры (714 против 600), минус и плюс стоят ниже середины цифр на 0,06 em и у́же цифры — их надо выравнивать вручную.
3. **Roboto Flex** — ось `opsz 8–144` и табличные цифры по умолчанию; среди авторов указаны Илья Рудерман и Юрий Остроменцкий. Рисунок узнаваемо «андроидный», но на крупных кеглях ведёт себя как системный шрифт.
4. **Onest** — нейтральный гротеск с кириллицей от русскоязычных авторов; минус и плюс стоят точно по середине цифр; активно обновляется (2.001, август 2026).
5. **Google Sans** — открыт под OFL, кириллица и ₽, `tnum` выравнивает также `₽`, `+`, `−`; геометричнее SF, вес только 400–700, минус стоит низко (−0,087 em).

Не вошли: IBM Plex Sans (характерные «инженерные» формы, нет пропорциональных цифр), Golos Text (дефект `tnum`), Manrope (геометричнее и шире SF).

**(ii) Топ-5 «выразительные премиальные цифры» — оценка.**
1. **TikTok Sans** — оси `opsz`, `wdth 75–150`, `wght 300–900`: можно сделать и широкие, и узкие плотные цифры; `tnum` включает ₽; есть `zero` и `case`.
2. **Manrope** — открытые крупные цифры с характером, веса до 800, самые лёгкие файлы (53,3 КБ на три подмножества); минус и плюс стоят по середине цифр, но разной ширины (учесть в вёрстке).
3. **Google Sans** — мягкая геометрия, знак ₽ табличной ширины.
4. **Unbounded** — широкий акцидентный, цифры 780/1000 em: очень выразительно, но длинные суммы тесны (по расчёту «1 250 000,00 ₽» занимает 8,88 em — на экране 440 px это кегль не больше 46 px).
5. **Montserrat** (вес 600–700) или **Onest** (700–800) — запасные варианты с полноценной кириллицей и `tnum`.

Для «округлого», как SF Pro Rounded: **Nunito** (табличные цифры по умолчанию, ₽ и минус шириной в цифру) надёжнее, чем SN Pro (дефект `tnum`); Comfortaa и M PLUS Rounded 1c не подходят (нет `tnum` / нет ₽).

### Gaps
- Визуальное сравнение в рамке iPhone не проводилось — рейтинг надо подтвердить глазами.

## 14. Что используют известные финтех-приложения

### Takeaway
Подтверждено источниками немного: Revolut — Aeonik Pro, Wise — собственный Wise Sans плюс открытый Inter, Stripe — Söhne. Все фирменные шрифты закрытые — использовать **нельзя**; из найденного открыт только Inter.

### Cited Findings
- **Revolut** — Aeonik Pro (запись на Fonts in Use); по неофициальным разборам дизайн-системы — в паре с Inter для основного текста. Aeonik Pro — коммерческий шрифт: **нельзя** — [Fonts in Use, Revolut](https://www.fontsinuse.com/uses/61484/revolut) (по выдаче поиска; название словолитни в найденных источниках не подтверждено).
- **Wise** — Wise Sans: собственный акцидентный шрифт, сделан с агентством Ragged Edge и шрифтовым дизайнером Люком Праузом (Luke Prowse); вторым шрифтом служит Inter, в том числе из-за набора знаков валют. Wise Sans — **нельзя**; Inter — можно — [Type-01, Wise Sans](https://type-01.com/wise-sans-the-font-update-shaping-wises-visual-identity/), [Wise Design, Creating a Wise typographic set](https://medium.com/transferwise-design/creating-a-wise-typographic-set-1052503f9f01) (по выдаче поиска).
- **Stripe** — Söhne (Kris Sowersby, Klim Type Foundry, 2019), коммерческая лицензия: **нельзя** — [Typewolf, Söhne](https://www.typewolf.com/sohne), [Klim, Söhne](https://klim.co.nz/fonts/soehne/) (по выдаче поиска).
- **N26** — собственный фирменный гротеск без публичного названия (по стороннему описанию дизайн-системы): **нельзя** — [shadcn.io, N26 design](https://www.shadcn.io/design/n26) (вторичный источник).
- **Cash App** — Cash Sans (по каталогу сайтов и шрифтов); лицензия в источниках не указана, открытого репозитория не найдено: считать **нельзя**, пока не доказано обратное — [maxibestof.one, Cash Sans](https://maxibestof.one/typefaces/cash-sans).
- **Т-Банк (Тинькофф)** — фирменный стиль обновляло агентство ONY; для основного текста выбран гротеск с узкими пропорциями, удобными для кириллицы. Название шрифта и его автор в найденных фрагментах не названы — НЕ ПРОВЕРЕНО; шрифт фирменный: **нельзя** — [ONY, Tinkoff](https://en.ony.ru/work/tinkoff), [Sostav, обновление фирменного стиля Тинькофф](https://www.sostav.ru/publication/grotesknyj-shrift-i-fine-tuning-ony-obnovilo-firmennyj-stil-tinkoff-40775.html) (по выдаче поиска).
- Проверено отсутствие открытого Cash Sans: в google/fonts и Fontsource его нет, `github.com/cashapp/cash-sans` отдаёт 404 — [api.fontsource.org/v1/fonts/cash-sans](https://api.fontsource.org/v1/fonts/cash-sans) (404).

### Inferences
- SF Pro и SF Pro Rounded распространяются Apple только для разработки под свои платформы; встраивать их файлом в веб-приложение нельзя, но можно вызывать через `font-family: -apple-system, system-ui` на самом iPhone (условия лицензии в этой сессии не открывались — НЕ ПРОВЕРЕНО).

### Gaps
- Monzo, Robinhood (Capsule Sans), Apple Wallet/Stocks (SF Pro Rounded / SF Compact для цифр) — источников не найдено, НЕ ПРОВЕРЕНО.
- Название и автор фирменного шрифта Т-Банка — НЕ ПРОВЕРЕНО.
- Какие именно приёмы набора сумм (мелкие копейки, приглушённый знак валюты, табличные цифры) применяет каждое из приложений — НЕ ПРОВЕРЕНО.

## 15. CSS-рецепты (сборка автора заметок на основе проверенных данных)

### Takeaway
Три рецепта: крупная сумма баланса, суммы в списке, столбец с выравниванием — плюс функция форматирования копеек и подгонка размера. Всё работает в Safari iOS 16+ и Chrome 105+.

### Cited Findings
- Поддержка использованных свойств — разделы 2, 3, 6 (BCD v8.1.8); символы `Intl` — раздел 8; метрики шрифтов — раздел 10.
- `word-spacing` действует на символы-разделители слов, к которым относятся пробел U+0020 и неразрывный пробел U+00A0 — [W3C CSS Text 3, word-spacing](https://www.w3.org/TR/css-text-3/#word-spacing-property) (по памяти автора; страница в сессии не открывалась — НЕ ПРОВЕРЕНО дословно).

### Inferences

**Подключение шрифта (три файла, пример для Manrope из Fontsource; `unicode-range` — из раздела 12):**

```css
@font-face {
  font-family: "Manrope Variable";
  font-weight: 200 800; font-style: normal; font-display: swap;
  src: url("fonts/manrope-cyrillic-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
@font-face {
  font-family: "Manrope Variable";
  font-weight: 200 800; font-style: normal; font-display: swap;
  src: url("fonts/manrope-latin-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
                 U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face { /* здесь знак ₽ (U+20BD) */
  font-family: "Manrope Variable";
  font-weight: 200 800; font-style: normal; font-display: swap;
  src: url("fonts/manrope-latin-ext-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304,
                 U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020,
                 U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
:root { --font-num: "Manrope Variable", system-ui, -apple-system, "Segoe UI", sans-serif; }
```

**Форматирование из целых копеек (без деления с плавающей точкой, минус U+2212, пробелы U+00A0):**

```js
const RUB_INT = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const NBSP = '\u00A0', MINUS = '\u2212';

// kop — целое число копеек; sign: 'auto' | 'always' (плюс у положительных); kopecks: 'always' | 'strip'
function formatRub(kop, { sign = 'auto', kopecks = 'always' } = {}) {
  const abs = Math.abs(kop);
  const rub = Math.trunc(abs / 100);            // целые рубли — точно
  const k = abs % 100;                          // копейки — точно
  const s = kop < 0 ? MINUS : (sign === 'always' && kop > 0 ? '+' : '');
  const frac = (kopecks === 'strip' && k === 0) ? '' : ',' + String(k).padStart(2, '0');
  return { sign: s, int: RUB_INT.format(rub), frac, cur: '₽' };   // int содержит U+00A0 между разрядами
}
// Простой текст: p.sign + p.int + p.frac + NBSP + p.cur  →  «−25 426,50 ₽»
```

**Рецепт 1. Крупная сумма баланса (40–56 px, мелкие копейки, приглушённый ₽):**

```html
<div class="hero">
  <p class="amount" aria-label="110 663 рубля 50 копеек">
    <span aria-hidden="true"><span class="int">110&nbsp;663</span><span class="frac">,50</span><span class="cur">&nbsp;₽</span></span>
  </p>
</div>
```

```css
.hero { container-type: inline-size; }             /* даёт единицы cqi */
.amount {
  margin: 0;
  font-family: var(--font-num);
  font-weight: 650;                                 /* промежуточный вес вариативной оси */
  font-size: clamp(2rem, 13cqi, 3.5rem);            /* 32–56 px, зависит от ширины контейнера */
  line-height: 1.15;                                /* не 1: иначе overflow обрежет хвост запятой */
  letter-spacing: -0.02em;                          /* оценка; для Inter c opsz — ближе к 0 */
  font-variant-numeric: lining-nums tabular-nums;   /* если сумма статична — можно proportional-nums */
  font-optical-sizing: auto;                        /* по умолчанию; важно при файле с осью opsz */
  font-kerning: normal;
  white-space: nowrap;                              /* сумма не переносится */
  word-spacing: -0.06em;                            /* сужает U+00A0 между разрядами */
  font-synthesis-weight: none;                      /* не рисовать фальшивый жирный */
}
.amount .frac { font-size: 0.6em; font-weight: 600; opacity: 0.7; }
.amount .cur  { font-size: 0.6em; font-weight: 500; opacity: 0.6; }
/* Знак «−»/«+» в отдельном <span class="sign">: поднять к середине цифр.
   Нужно для Geist (−0.06em), Nunito (−0.066em), Google Sans (−0.087em), Inter из Fontsource (−0.079em);
   для Manrope, Onest, Montserrat, Wix Madefor не нужно (см. таблицу в разделе 5). */
.amount .sign { position: relative; top: -0.06em; }
@supports (text-box: trim-both cap alphabetic) {
  .amount { text-box: trim-both cap alphabetic; }   /* Safari 18.2+, Chrome 133+: высота блока = высота цифр */
}
```

**Подгонка, если сумма длиннее экрана (10 строк, без библиотек):**

```js
function fitAmount(el, minPx = 24) {
  el.style.fontSize = '';                                   // вернуть размер из CSS
  const box = el.parentElement.clientWidth;
  const need = el.scrollWidth;
  if (need > box) {
    const cur = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = Math.max(minPx, Math.floor(cur * box / need)) + 'px';
  }
}
document.fonts.ready.then(() => document.querySelectorAll('.amount').forEach(el => fitAmount(el)));
// Вызывать повторно после изменения суммы и при повороте экрана (ResizeObserver на контейнере).
```

Вариант без измерений (годится при табличных цифрах, где ширина предсказуема): посчитать ширину строки в em в JS и отдать в переменную:

```css
.amount { font-size: min(3.5rem, calc(100cqi / var(--w-em, 7))); }
```

```js
// Для Inter с tnum: цифра 0,648 em; пробел и запятая 0,269; ₽ 0,701; знак 0,648. Для другого шрифта — числа из раздела 10.
const widthEm = s => [...s].reduce((w, c) => w + (/\d/.test(c) ? 0.648 : c === '₽' ? 0.701 : /[+\u2212]/.test(c) ? 0.648 : 0.269), 0);
el.style.setProperty('--w-em', (widthEm(text) * 1.02).toFixed(2));
```

**Рецепт 2. Суммы в списке операций (15–17 px):**

```css
.tx-amount {
  font-family: var(--font-num);
  font-size: 1.0625rem;                             /* 17 px */
  font-weight: 600;
  font-variant-numeric: lining-nums tabular-nums;   /* цифры в строках стоят друг под другом */
  white-space: nowrap;
  text-align: right;
  flex: none;                                       /* сумму не сжимать — сжимается название операции */
}
.tx-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tx-amount.income  { color: var(--income); }        /* «+85 237 ₽» */
.tx-amount.expense { color: var(--text); }          /* «−25 426,50 ₽», минус U+2212 */
```

**Рецепт 3. Выровненный столбец (разряды и запятая на одной вертикали):**

```css
.col-amount {
  font-variant-numeric: lining-nums tabular-nums;
  text-align: right;                                /* при одинаковом числе знаков после запятой запятые совпадут */
  white-space: nowrap;
}
/* Знак в ячейке фиксированной ширины — нужно для шрифтов, где «+» и «−» разной ширины (Manrope, Geist) */
.col-amount .sign { display: inline-block; width: 0.62em; text-align: center; }
/* Если копейки показываются не всегда — зарезервировать место под «,00» */
.col-amount .frac:empty::after { content: ",00"; visibility: hidden; }
```

Замечания к рецептам:
- `tabular-nums` выравнивает цифры, но не обязательно пробелы, запятую и знаки — это зависит от шрифта (раздел 5). При одинаковом формате строк (всегда две копейки, всегда `&nbsp;₽`) столбец всё равно получится ровным: неравные знаки стоят в одинаковых местах.
- `font-feature-settings: "case"`, `"zero"`, `"ss01"` с файлами Fontsource не сработают (раздел 2); с полным `InterVariable.woff2` — сработают.
- Тёмная тема: приглушать копейки и ₽ через `opacity`/цвет, проверяя контраст; очень тонкие веса (200–300) на тёмном фоне и на OLED выглядят тоньше — для сумм держать вес ≥ 500.

### Gaps
- Рецепты не запускались в рамке iPhone в этой сессии — перед применением проверить в рамке и в консоли.
- Числа в `widthEm` верны только для Inter; для выбранного шрифта их надо взять из таблицы раздела 10.
