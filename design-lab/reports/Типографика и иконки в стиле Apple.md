# Как законно приблизить «Мои расходы» к iOS

*Отчёт по заметкам исследования, срез на 11.11.2026. Написан для владельца приложения, термины объясняются по ходу.*

Приблизить приложение к облику iOS можно законно и без переписывания: ничего не привозить от Apple, а попросить у самого iPhone его системный шрифт и его эмодзи, а недостающее (значки, запасной шрифт цифр для Windows и Android) взять из открытых наборов. Исследование заодно нашло настоящую ошибку в нынешнем виде приложения: у шрифта Golos Text цифры, которые должны быть одной ширины, на деле разные, поэтому суммы в столбцах стоят неровно. Все варианты собраны в галерее Design Lab — файл `design-lab/apple-typography.html`. **Основное приложение (`index.html`, `sw.js`) не менялось.**

## Резюме

1. **Файлы Apple в приложение класть нельзя** — ни шрифт SF Pro, ни значки SF Symbols, ни Apple Color Emoji, ни графику из UI-китов. Лицензии Apple разрешают их только для макетов и приложений под системы Apple.
2. **Законный путь к «настоящему» виду — системный шрифт устройства.** Если в CSS написать `-apple-system` / `system-ui`, iPhone сам подставит SF Pro; это способ, который называет сама Apple.
3. **Главная находка: «табличные» цифры Golos Text на деле разной ширины** (разброс около 6 % ширины цифры). У Inter все цифры одинаковы. Это проверено замером в браузере.
4. **Рекомендация исследователя — вариант D (Hybrid):** нынешний дизайн сохраняется, меняются только цифры (SF Pro на iPhone, Inter на Windows и Android), копейки и знак ₽ становятся мельче и спокойнее, вместо эмодзи категорий — единый набор значков.
5. **Значки — Lucide** (открытая лицензия ISC): сетка 24, толщина линии настраивается до 1,9 — как у нынешних значков нижней панели. Нужные 25–30 значков вставляются прямо в `index.html`, без CDN.
6. **Эмодзи — системные и только там, где они нужны.** На iPhone это и будут настоящие эмодзи Apple, законно и бесплатно. Фреймворки вроде Framework7 и Ionic подключать не стоит: это и есть переписывание приложения.
7. **Честные оговорки:** это рекомендация, окончательный выбор — за тобой по галерее; **на настоящем iPhone страница лаборатории ещё не открывалась**, поэтому вид SF Pro, знак ₽ и ровность цифр в Safari пока не подтверждены.

Пометки в тексте: **НЕ ПРОВЕРЕНО** — подтверждения найти не удалось (так же помечено в заметках); «оценка» или «вывод» — мнение исследователя, а не факт из источника; «замер» — проверено напрямую на рабочем компьютере (Windows 11, Chrome). Отчёт не является юридической консультацией.

## 1. Ресурсы Apple: правила и числа брать можно, файлы — нельзя

Apple публикует много материалов для дизайнеров, но почти все они выданы под одно условие: делать макеты и приложения только для систем Apple. Веб-приложение, которое открывается и в Windows, и в Android, под это условие не подпадает. Отсюда общий вывод: числа, правила и идеи Apple использовать можно, файлы — нет.

| Ресурс | Что это | Вердикт для нашего веб-приложения | Законная замена |
|---|---|---|---|
| Шрифты SF Pro, SF Pro Rounded, SF Compact, SF Mono, New York | Системные шрифты Apple, выложены для дизайнеров | **Нельзя** подключать файлом, хранить на GitHub Pages, переводить в WOFF2 | Системный стек шрифтов: iPhone сам подставит SF Pro |
| SF Symbols | Библиотека из более чем 7 000 значков Apple | **Нельзя** — ни SVG, ни шрифтом, ни перерисовкой «один в один» | Открытые наборы значков (раздел 6) |
| Apple Color Emoji | Шрифт с эмодзи в iOS и macOS | Файлы и картинки — **нельзя**; писать обычные символы эмодзи — **можно** | Символ в тексте: iPhone нарисует его сам |
| Apple Design Resources | UI-киты для Figma и Sketch, шаблоны, рамки устройств | **Нельзя** вставлять графику и рамки; изучать размеры и повторять своим кодом — можно | Собственные стили и собственная рамка iPhone |
| Human Interface Guidelines (HIG) | Руководство Apple по интерфейсам | **Можно** читать и следовать; копировать тексты и иллюстрации — нет | — |

**Шрифты SF.** На странице Apple Fonts лежат восемь загрузок: SF Pro, SF Compact, SF Mono, New York и четыре расширения для других письменностей; для SF Pro заявлены девять весов, четыре ширины, скруглённый вариант и кириллица ([Apple Fonts](https://developer.apple.com/fonts/)). Лицензия, встроенная в эту страницу, разрешает шрифт только для макетов интерфейсов программ под системы Apple и только зарегистрированным разработчикам Apple. В ней прямо сказано: "You may not embed the Apple Font in any software programs or other products" (Apple, лицензия шрифта San Francisco, §2B); использование для содержимого сайтов, раздача по сети, копирование, изменение и передача тоже запрещены ([Apple Fonts](https://developer.apple.com/fonts/)). Документация Apple 2026 года повторяет: эти семейства зарезервированы для системы, а скачивание с сайта — отдельный рабочий процесс для дизайнерских макетов ([Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md)). Репозитории на GitHub, раздающие извлечённые файлы SF, существуют, но это нарушение лицензии: по одному из них Apple направляла GitHub требование об удалении в июне 2020 ([зеркало архива уведомлений](https://git.randommeaninglesscharacters.com/github/dmca/src/branch/master/2020/06/2020-06-05-apple.md)). Сослаться на шрифт по имени тоже не выйдет: системный шрифт запрашивается только общими ключевыми словами, а шрифты, которые пользователь установил сам, Safari страницам не показывает ([WebKit: Tracking Prevention](https://webkit.org/tracking-prevention/)).

Законный путь один, и его называет сама Apple: не поставлять шрифт, а попросить у устройства его собственный — словами `system-ui`, `ui-sans-serif`, `ui-serif`, `ui-monospace`, `ui-rounded` ([Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md)). Заметки отдельно советуют не ставить SF Pro даже на рабочий компьютер с Windows «чтобы посмотреть»: лицензия покрывает макеты программ для систем Apple, и веб-приложение в неё явно не укладывается (вывод исследователя). **НЕ ПРОВЕРЕНО:** текст лицензии внутри сегодняшних установщиков шрифтов — образы не скачивались; на странице показан текст 2016 года, где шрифт назван «San Francisco».

**SF Symbols.** Приложение работает только на Mac, текущая загрузка подписана «SF Symbols 27» ([SF Symbols](https://developer.apple.com/sf-symbols/), [Apple Design Resources](https://developer.apple.com/design/resources/)). По соглашению Xcode and Apple SDKs Agreement (редакция от 08.06.2026, пункт 2.10) системные изображения Apple лицензируются только для разработки приложений под устройства Apple; там же запрещено использовать их и похожие до смешения рисунки в иконке приложения, логотипе и товарном знаке ([Xcode and Apple SDKs Agreement](https://www.apple.com/legal/sla/docs/xcode.pdf)). PWA, даже установленное на экран «Домой», остаётся веб-страницей, а не приложением в смысле этого соглашения, поэтому вердикт — нельзя (вывод исследователя из текста соглашения). **НЕ ПРОВЕРЕНО:** лицензия, вшитая в установщик SF Symbols; официального ответа сотрудника Apple про веб на форумах нет — там отвечают обычные участники ([Apple Developer Forums, ветка 837003](https://developer.apple.com/forums/thread/837003)).

**Apple Color Emoji.** Правила App Review (пункт 4.5.6) разрешают приложениям использовать символы Unicode, которые отображаются как эмодзи Apple, но запрещают использовать эмодзи Apple на других платформах и встраивать их в приложение ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)). Для нас это значит: писать символ в тексте можно — iPhone нарисует его своим шрифтом; класть в репозиторий шрифт Apple или его картинки нельзя. Оговорка из заметок: эти правила формально написаны для приложений App Store, а не для сайтов, но это самое ясное публичное заявление Apple. **НЕ ПРОВЕРЕНО:** точная формулировка пункта о шрифтах в лицензии macOS.

**Apple Design Resources.** На странице ресурсов — UI-киты iOS 27 и iPadOS 27 для Figma и Sketch, шаблоны, рамки устройств, включая iPhone 18 ([Apple Design Resources](https://developer.apple.com/design/resources/)). Лицензия от 21.06.2023 отдаёт их только для макетов программ, работающих исключительно на системах Apple; встраивать ресурсы в продукты, использовать для содержимого сайтов и извлекать графику из шаблонов нельзя ([лицензия Apple Design Resources, PDF](https://developer.apple.com/support/downloads/terms/apple-design-resources/Apple-Design-Resources-License-20230621-English.pdf)). Практический вывод: рамка iPhone в проекте должна быть нарисована самостоятельно, а размеры и отступы можно изучать и воспроизводить своим кодом (вывод исследователя). **НЕ ПРОВЕРЕНО:** существует ли редакция лицензии новее 2023 года.

**HIG.** Руководство даёт твёрдые числа, которым можно следовать: основной текст 17 pt, минимум 11 pt, шкала стилей от Large Title 34/41 до Caption 2 11/13 ([HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)); область нажатия 44×44 pt при минимуме 28×28 и контраст 4,5:1 для текста мельче 18 pt ([HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)). Нынешняя шкала приложения (11–20 px) не опускается ниже минимума HIG. Системные цвета Apple обновила 9 июня 2025 года: синий теперь `#0088FF` в светлой теме и `#0091FF` в тёмной, красный `#FF383C` / `#FF4245`, зелёный остался `#34C759` / `#30D158` ([HIG Color](https://developer.apple.com/design/human-interface-guidelines/color)). Высот панелей, полей и радиусов HIG не публикует — такие числа есть только в открытых библиотеках и считаются «значениями библиотеки». Рекомендаций именно по показу денежных сумм в HIG найти не удалось.

## 2. Проверенные репозитории GitHub: живых и чистых по лицензии немного

Все цифры — срез на 11.11.2026 по страницам GitHub, реестру npm и спискам файлов jsDelivr. «Без сборки» значит: можно подключить к одному `index.html` без npm и сборщика. Ссылки на репозитории, которые раздают файлы Apple, намеренно не приводятся (см. конец раздела).

### Значки

| Репозиторий | Лицензия | Версия, дата релиза | Звёзды | Поддержка | Размер | Подключение без сборки |
|---|---|---|---|---|---|---|
| [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | ISC (часть значков от Feather — MIT) | 1.72.0, 11.11.2026 | 25 703 | активная, коммит 10.11.2026 | 2 052 значка; один SVG около 0,5 КБ; папка значков 1,1 МБ | скопировать нужные SVG в `index.html`; готовый скрипт на 486 КБ тянет все значки сразу |
| [tabler/tabler-icons](https://github.com/tabler/tabler-icons) | MIT | 3.51.0, 08.11.2026 | 22 601 | активная | 6 287 значков; пакет 11,5 МБ | отдельные SVG; общий спрайт 1,95 МБ |
| [phosphor-icons/core](https://github.com/phosphor-icons/core) | MIT | 2.1.1 в npm, 29.03.2024 | 399 (у репозитория сайта — 7 794) | медленная: значки не обновлялись с марта 2024, репозитории живые | 1 512 значков в 6 вариантах (четыре толщины, заливка, двухцветный); пакет 6,5 МБ | отдельные SVG; шрифт на одну толщину около 147 КБ плюс 78 КБ CSS |
| [iconoir-icons/iconoir](https://github.com/iconoir-icons/iconoir) | MIT | 7.12.2, 04.11.2026 | 4 632 | активная | 1 383 контурных и 288 с заливкой; 7,1 МБ | отдельные SVG |
| [ionic-team/ionicons](https://github.com/ionic-team/ionicons) | MIT | 8.1.0, 28.07.2026 | 18 245 | умеренная | 1 357 SVG; 6,2 МБ | отдельные SVG из пакета; фирменный компонент догружает значки по сети — для офлайна не годится |
| [tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons) | MIT | 2.2.0, 18.11.2024 | 23 907 | набор «заморожен»: только исправления | 324 значка; 0,7 МБ | скопировать SVG |
| [framework7io/framework7-icons](https://github.com/framework7io/framework7-icons) | MIT, но набор основан на SF Symbols | 5.0.5, 12.10.2021 | 231 | остановлена: релизов с 2021 года нет | 1 252 значка; 13,3 МБ | SVG или шрифт — **не использовать** (раздел 9) |

Источники: страницы репозиториев, файлы лицензий ([Lucide LICENSE](https://raw.githubusercontent.com/lucide-icons/lucide/main/LICENSE), [Tabler LICENSE](https://raw.githubusercontent.com/tabler/tabler-icons/main/LICENSE), [Phosphor LICENSE](https://raw.githubusercontent.com/phosphor-icons/core/main/LICENSE)) и списки файлов пакетов ([lucide-static 1.72.0](https://data.jsdelivr.com/v1/packages/npm/lucide-static@1.72.0?structure=flat), [ionicons 8.1.0](https://data.jsdelivr.com/v1/packages/npm/ionicons@8.1.0?structure=flat)). Оценка «активная / медленная» — вывод исследователя по датам.

Также проверены: [Remix Icon](https://github.com/Remix-Design/RemixIcon) (8 460 звёзд, 4.9.1 от 29.01.2026; с января 2026 собственная лицензия вместо Apache-2.0), [Material Symbols](https://github.com/google/material-design-icons) (54 277, Apache-2.0, шрифт 3,5–5,4 МБ на стиль), [Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) (10 973, MIT, 1.1.345 от 30.10.2026), [Feather](https://github.com/feathericons/feather) (26 038, MIT, развитие остановилось, преемник — Lucide), [Bootstrap Icons](https://github.com/twbs/icons) (8 176, MIT, 1.13.2 от 08.10.2026), [Solar](https://github.com/480-Design/Solar-Icon-Set) (390, лицензия указана противоречиво), [Hugeicons](https://github.com/hugeicons/hugeicons) (1 230, бесплатная часть MIT, пакет 80,6 МБ; подключение без сборщика **НЕ ПРОВЕРЕНО**), [MynaUI Icons](https://github.com/praveenjuge/mynaui-icons) (175, MIT), [css.gg](https://github.com/astrit/css.gg) (10 061, собственная лицензия с ограничениями), [Iconify](https://github.com/iconify/iconify) (6 394, код MIT, у каждого набора своя лицензия).

### Эмодзи

| Репозиторий | Лицензия рисунков | Версия, дата | Звёзды | Поддержка | Размер | Подключение без сборки |
|---|---|---|---|---|---|---|
| [jdecked/twemoji](https://github.com/jdecked/twemoji) | CC-BY 4.0 (код MIT) | 17.0.3, 01.06.2026 | 1 918 | активная, покрывает Emoji 17.0 | один SVG около 2,5 КБ; 18 нужных значков — 16,7 КБ; весь набор 10,1 МБ | положить нужные SVG в проект или вставить в HTML; нужна строка об авторстве |
| [twitter/twemoji](https://github.com/twitter/twemoji) | CC-BY 4.0 | 14.0.2, 31.03.2022 | 17 814 | застрял на Emoji 14.0 | — | не брать, использовать форк выше |
| [hfg-gmuend/openmoji](https://github.com/hfg-gmuend/openmoji) | CC BY-SA 4.0 | 17.0.0, 23.04.2026 | 4 585 | активная, коммит 04.11.2026 | около 3,2 КБ за значок; 18 значков — 51,4 КБ; набор 14,2 МБ | SVG-файлы; авторство плюс «та же лицензия» для изменённых значков |
| [googlefonts/noto-emoji](https://github.com/googlefonts/noto-emoji) | Apache 2.0 (картинки), OFL 1.1 (шрифты) | выпуск «Unicode 18.0», 24.09.2026 | 5 126 | активная | около 11 КБ за значок; 18 значков — 178,6 КБ; набор 41,7 МБ | SVG из папки `2D/svg`; сохранить текст лицензии |
| [microsoft/fluentui-emoji](https://github.com/microsoft/fluentui-emoji) | MIT | релизов нет; рисунки не менялись с 30.01.2025 | 10 209 | медленная | Color — около 42 КБ за значок (18 значков — 319,8 КБ); Flat — 5,5 КБ (18 значков — 30,8 КБ) | SVG-файлы; сохранить уведомление об авторском праве |

Источники: [Twemoji README](https://github.com/jdecked/twemoji/blob/main/README.md), [OpenMoji README](https://github.com/hfg-gmuend/openmoji/blob/master/README.md), [Noto Emoji README](https://github.com/googlefonts/noto-emoji/blob/main/README.md), [Fluent Emoji LICENSE](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE). Также проверены: [JoyPixels](https://github.com/joypixels/emoji-toolkit) (472 звезды, собственная лицензия с платными планами), [EmojiTwo](https://github.com/EmojiTwo/emojitwo) (362, CC-BY 4.0, последний коммит 06.03.2025), [Tossface](https://github.com/toss/tossface) (380, своя лицензия с запретом неразрешённых изменений), шрифты [twemoji-colr](https://github.com/mozilla/twemoji-colr) (408, релиз 2022) и [twemoji-color-font](https://github.com/13rac1/twemoji-color-font) (1 940, релиз 04.10.2024), [полифил флагов TalkJS](https://github.com/talkjs/country-flag-emoji-polyfill) (233, MIT, 0.1.10 от 02.08.2026).

### iOS-фреймворки и CSS-наборы

| Репозиторий | Лицензия | Версия, дата | Звёзды | Поддержка | Размер | Без сборки | Вердикт |
|---|---|---|---|---|---|---|---|
| [framework7io/framework7](https://github.com/framework7io/framework7) | MIT | 9.3.0, 30.10.2026 | 18 774 | активная | CSS 486 КБ и JS 808 КБ (в сжатом виде 72 и 210 КБ) | да: один CSS и один JS | не подключать; взять числа темы iOS 26 |
| [ionic-team/ionic-framework](https://github.com/ionic-team/ionic-framework) | MIT | 9.0.10, 28.10.2026 | 52 752 | активная | загрузчик 25 КБ, 97 файлов на 1,14 МБ, CSS 39 КБ | да: скрипт-модуль и CSS | не подключать |
| [konstaui/konsta](https://github.com/konstaui/konsta) | MIT | 5.5.0, 28.09.2026 | 4 289 | активная | пакет 1,32 МБ | нет: нужны Tailwind и React, Vue или Svelte | не подключать |
| [OnsenUI/OnsenUI](https://github.com/OnsenUI/OnsenUI) | Apache-2.0 (по npm) | 2.12.9, 16.06.2026; предыдущий — 27.12.2022 | 8 852 | режим поддержки | JS 298 КБ и CSS 154 КБ | да | не подключать |
| [codedgar/Puppertino](https://github.com/codedgar/Puppertino) | MIT | 2.0.0, 06.10.2026 | 1 211 | активная, один автор | CSS 413 КБ (59 КБ в сжатом виде) | да: чистый CSS | только как справочник значений |
| [tech-systems/panes](https://github.com/tech-systems/panes) (Cupertino Pane) | MIT | 1.5.4, 27.08.2025 | 728 | медленная | 67 КБ (15 КБ в сжатом виде) | да: один файл | можно точечно для нижнего листа |
| [webview-native-ui/ionic-theme-ios27](https://github.com/webview-native-ui/ionic-theme-ios27) | MIT | 2.1.3, 11.11.2026 | 176 | активная | пакет 2,0 МБ | только вместе с Ionic | не подключать |

Источники: [реестр npm, framework7](https://registry.npmjs.org/framework7), [список файлов Framework7 9.3.0](https://data.jsdelivr.com/v1/packages/npm/framework7@9.3.0?structure=flat), [Ionic: подключение через CDN](https://ionicframework.com/docs/intro/cdn), [konstaui.com](https://konstaui.com/), [реестр npm, onsenui](https://registry.npmjs.org/onsenui), [Puppertino README](https://raw.githubusercontent.com/codedgar/Puppertino/master/README.md). Поиск по GitHub показал, что зрелого «чистого CSS-набора iOS» не существует; остальное — демо эффекта «жидкого стекла»: `rdev/liquid-glass-react` (6 662 звезды, только React), `shuding/liquid-glass` (1 228), `lucasromerodb/liquid-glass-effect-macos` (826, без лицензии), `VII-Cae/hyalite--liquid-glass` (265), `JUNGHERZ/GlassKit` (16), `kitlangton/ios-kit` (7) ([поиск GitHub «liquid glass css»](https://api.github.com/search/repositories?q=liquid+glass+css&sort=stars&order=desc)). Проверены и отброшены как не относящиеся к стилю iOS, требующие фреймворка или заброшенные: Swiper, daisyUI, Shoelace (в архиве), Web Awesome, Vant, WeUI, mdui, Ant Design Mobile, NutUI, system.css, 7.css, MUI от DCloud.

### Шрифты

| Репозиторий | Лицензия | Версия, дата | Звёзды | Поддержка (по датам) | Размер трёх файлов (латиница, кириллица, файл со знаком ₽) | Подключение без сборки |
|---|---|---|---|---|---|---|
| [rsms/inter](https://github.com/rsms/inter) | OFL 1.1 | v4.1, 16.11.2024 | 20 056 | последний релиз — ноябрь 2024 | 148,5 КБ (только вес) или 230,3 КБ (вес и оптический размер); полный файл автора 344 КБ | положить woff2 в `fonts/` и описать в `@font-face` |
| [vercel/geist-font](https://github.com/vercel/geist-font) | OFL 1.1 | v1.9.2, 06.11.2026 | 3 750 | активная | 59,5 КБ; либо один официальный файл 67,9 КБ | то же |
| [googlefonts/manrope](https://github.com/googlefonts/manrope) | OFL 1.1 | 4.505, 14.09.2026 | 4 (это зеркало; репозиторий автора недоступен) | обновлён в 2026 | 53,3 КБ | то же |
| [simpals/onest](https://github.com/simpals/onest) | OFL 1.1 | 2.001, 06.08.2026 | 71 | активная | 76,3 КБ | то же |
| [googlefonts/golos-text](https://github.com/googlefonts/golos-text) | OFL 1.1 | 2.004, 06.01.2023 | 23 | без обновлений с 2023 | 77,2 КБ | уже в приложении |
| [googlefonts/roboto-flex](https://github.com/googlefonts/roboto-flex) | OFL 1.1 | 3.200, 30.06.2023 | 530 | без релизов с 2023 | 71,7 КБ (вес) или 180,7 КБ (с оптическим размером) | то же |
| [IBM/plex](https://github.com/IBM/plex) (IBM Plex Sans) | OFL 1.1 | 3.201, 10.01.2025 | 11 764 | в заметках не оценивалась | 103,6 КБ | то же |
| [TikTok/TikTokSans](https://github.com/TikTok/TikTokSans) | OFL 1.1 | v4.000, 09.07.2025 | 213 | в заметках не оценивалась | 97,0 КБ | то же |
| [googlefonts/googlesans](https://github.com/googlefonts/googlesans) | OFL 1.1 | 14.000, 10.06.2026 | 28 | в заметках не оценивалась | 71,7 КБ | то же |
| [googlefonts/nunito](https://github.com/googlefonts/nunito) | OFL 1.1 | 3.602, 16.02.2022 | нет данных | репозиторий в архиве | 93,3 КБ | то же |
| [supernotes/sn-pro](https://github.com/supernotes/sn-pro) | OFL 1.1 | 1.5.0, 29.05.2025 | 775 | в заметках не оценивалась | 108,6 КБ | то же |

Источники: разбор файлов из [google/fonts](https://github.com/google/fonts/tree/main/ofl) и списки файлов Fontsource ([Inter 5.3.0](https://data.jsdelivr.com/v1/packages/npm/@fontsource-variable/inter@5.3.0?structure=flat), [Manrope 5.3.0](https://data.jsdelivr.com/v1/packages/npm/@fontsource-variable/manrope@5.3.0?structure=flat)). Также разобраны Montserrat, Rubik, Unbounded, Wix Madefor Display, Commissioner, Sofia Sans, моноширинные JetBrains Mono, Martian Mono, Geist Mono, IBM Plex Mono. Без кириллицы и поэтому отброшены: Google Sans Flex, Google Sans Code, Mona Sans, Hubot Sans, DM Sans, Figtree.

**Репозитории с файлами Apple.** Проверено, что они существуют, но брать из них ничего нельзя: выгрузки SF Symbols в SVG (например, `brendanballon/sfsymbols-svg`, 130 звёзд, без лицензии), перепаковки Apple Color Emoji (`samuelngs/apple-emoji-ttf`, 1 633 звезды; `iamcal/emoji-data` и npm-пакет `emoji-datasource-apple`). Пометка MIT в таких проектах относится к скриптам, а не к рисункам Apple: автор скрипта не может выдать лицензию на чужую работу (вывод исследователя на основании [п. 2.10 соглашения Apple](https://www.apple.com/legal/sla/docs/xcode.pdf) и [правил App Review](https://developer.apple.com/app-store/review/guidelines/)).

## 3. Рекомендованные библиотеки: Lucide, Inter и встроенные средства браузера

Рекомендованных внешних зависимостей всего две, и обе — не «библиотеки» в привычном смысле, а наборы файлов, которые один раз копируются в проект и дальше работают офлайн.

**Lucide — значки.** Лицензия ISC, указывать авторство в интерфейсе не требуется, но текст лицензии нужно сохранить в копиях исходников ([Lucide LICENSE](https://raw.githubusercontent.com/lucide-icons/lucide/main/LICENSE)). Подключение — копированием нужных SVG прямо в `index.html`; сами авторы предупреждают, что общий спрайт и шрифт значков для боевых страниц не рекомендуются, потому что грузят все значки сразу ([README lucide-static](https://unpkg.com/lucide-static@1.72.0/README.md)). По оценке заметок, 30 значков добавят к файлу примерно 12–18 КБ.

**Inter — запасной шрифт цифр для Windows и Android.** Открытая лицензия SIL OFL 1.1, кириллица, табличные цифры, ось оптического размера ([rsms.me/inter](https://rsms.me/inter/)). На iPhone он не понадобится: там цифры рисует системный SF Pro.

**Форматирование сумм — без библиотек.** Встроенный `Intl.NumberFormat` с методом `formatToParts` поддерживается всеми нужными браузерами ([MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)). Приложение уже хранит деньги целыми копейками, поэтому библиотеки точной арифметики не нужны.

**Эмодзи — без библиотек.** Системные эмодзи не требуют ничего. Если когда-нибудь понадобится одинаковая картинка на всех устройствах, самый лёгкий законный набор — Twemoji в SVG (около 16,7 КБ на 18 значков), с одной строкой об авторстве в разделе «О приложении» или в исходнике — такой способ указания прямо разрешён проектом ([Twemoji README](https://github.com/jdecked/twemoji/blob/main/README.md)).

**Справочники вместо зависимостей.** Framework7 9.x и Puppertino 2.0 полезны как открытые образцы чисел в стиле iOS 26 (радиусы, высоты строк, размытие), но подключать их целиком не нужно ([Framework7 9.3.0, CSS](https://cdn.jsdelivr.net/npm/framework7@9.3.0/framework7-bundle.css), [Puppertino README](https://raw.githubusercontent.com/codedgar/Puppertino/master/README.md)). Единственный готовый модуль, который заметки допускают «точечно», — Cupertino Pane для нижнего листа с перетаскиванием; к типографике он не относится.

Тексты лицензий открытых наборов проще всего держать файлами рядом, как уже сделано в лаборатории (`design-lab/assets/fonts/licenses/` и `design-lab/assets/licenses/`), либо комментарием в `index.html` — это практическая рекомендация заметок, а не юридическое заключение.

## 4. Шрифты: SF Pro приходит с iPhone сам, Inter подменяет его на Windows и Android

Сейчас приложение набрано двумя своими шрифтами: Golos Text (весь текст и цифры) и Unbounded (только заголовок месяца в тёмно-синей теме). Попутная находка: вес 700 у Golos Text в приложении не объявлен, хотя запрошен в четырёх местах, включая крупную сумму, — на деле он рисуется как 600 (чтение `index.html`, заметка `lab_measurements.md`).

### Что увидит каждое устройство

| Запись в CSS | iPhone (Safari и PWA) | Windows 11, Chrome | Android |
|---|---|---|---|
| `system-ui`, `-apple-system` | SF Pro | Segoe UI, не Segoe UI Variable — по источникам 2022–2023 годов; для ноября 2026 **НЕ ПРОВЕРЕНО** | Roboto; для 2026 года **НЕ ПРОВЕРЕНО** |
| `ui-rounded` | SF Rounded | не поддерживается, пропускается | не поддерживается |
| `ui-monospace` | SF Mono | не поддерживается | не поддерживается |
| `ui-serif` | New York | не поддерживается | не поддерживается |
| свой файл шрифта (Golos Text, Inter) | одинаково на всех устройствах | одинаково | одинаково |

Источники: соответствие ключевых слов шрифтам — [Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md) и [разбор Олли Уильямса](https://blog-236.pages.dev/blog/system-font-deep-dive); поддержка в браузерах — [данные MDN](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/font-family.json); Windows — [Microsoft Learn](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/typography) и [Tiger Oakes](https://tigeroakes.com/posts/segoe-ui-variable).

Главное следствие: **на рабочем компьютере приложение никогда не покажет SF Pro** — только на устройстве Apple. Поэтому в стек после системного шрифта Apple ставится Inter: в лаборатории это запись `-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif`. На iPhone она даёт SF Pro, на Windows и Android — Inter. Слово `BlinkMacSystemFont` в ней необязательно: по заметкам, это устаревшее имя для старого Chrome на Mac (по первоисточнику **НЕ ПРОВЕРЕНО**).

### Кириллица и знак ₽

Для SF Pro кириллицу Apple заявляет прямо ([Apple Fonts](https://developer.apple.com/fonts/)). А вот **наличие знака ₽ в шрифтах SF — НЕ ПРОВЕРЕНО**: официального списка знаков Apple не публикует. Если знака в SF Pro нет, браузер возьмёт его из другого шрифта, и он может отличаться толщиной и рисунком. Кириллица именно в скруглённом SF Pro Rounded по первоисточнику тоже **НЕ ПРОВЕРЕНА**.

Открытые шрифты проверены по самим файлам и замером в Chrome (заметка `lab_measurements.md`; файлы — пакеты [Fontsource](https://data.jsdelivr.com/v1/packages/npm/@fontsource-variable/inter@5.3.0?structure=flat)):

| Шрифт | Кириллица | Знак ₽ | Цифры одной ширины (замер в Chrome) | Годится для сумм |
|---|---|---|---|---|
| Inter | да | да | ровно: каждая цифра 25,78 px при весе 400–700 | да |
| Geist, Onest | да | да | ровно | да |
| Manrope | да | да | практически ровно (цифра 6 шире на 0,06 px) | да |
| Nunito, IBM Plex Sans, Roboto Flex, Montserrat, Rubik, Unbounded | да | да | ровно | да |
| **Golos Text** | да | да | **не ровно при любом весе** | для текста — да, для сумм — нет |
| SN Pro | да | да | не ровно | нет |
| Wix Madefor Display, Commissioner | да | да | цифр одной ширины нет вообще | нет |
| Sofia Sans | да | нет | — | нет |
| Segoe UI (системный в Windows) | да | да | цифра 7 уже на 3,4 % | только как крайний запас |

Две технические мелочи, которые важно знать заранее. Во-первых, в готовых сборках (Google Fonts, Fontsource) знак ₽ лежит не в файле кириллицы и не в файле латиницы, а в третьем файле `latin-ext`; у Inter он весит 83 КБ (или 130 КБ в версии с оптическим размером) ради одного знака ([список подмножеств Fontsource](https://api.fontsource.org/v1/fonts/inter)). В приложении эта задача для Golos Text уже решена отдельными крошечными файлами со знаком ₽; сделать такое же собственное подмножество для Inter заметки предлагают как вариант, но его размер **НЕ ПРОВЕРЕН**. Во-вторых, в этих сборках у Inter вырезаны дополнительные возможности (перечёркнутый ноль, выравнивание минуса по высоте цифр) — они есть только в полном файле автора на 344 КБ ([rsms.me/inter](https://rsms.me/inter/)).

По оценке исследователя, Inter — ближайший к SF Pro открытый шрифт (та же школа, есть отдельный рисунок для крупного кегля), следом идёт Geist; глазами в рамке iPhone шрифты не сравнивались. Фирменные шрифты финтех-приложений (Aeonik Pro у Revolut, Söhne у Stripe, Wise Sans) закрыты и использовать их нельзя; эти сведения взяты из выдачи поиска, сами страницы не читались.

Привязку размеров к системной настройке «Размер текста» (Dynamic Type) заметки описывают, но для неё все размеры в приложении пришлось бы перевести из пикселей в относительные единицы; в рамках «без переписывания» это не предлагается.

## 5. Денежные суммы: ровные цифры, мелкие копейки, защита от обрезания

### Цифры одной ширины нужны там, где суммы стоят столбцом

Цифры бывают пропорциональные (единица уже нуля) и табличные (все одной ширины). Табличные нужны в списках операций, столбцах и везде, где число меняется на глазах, иначе оно «дрожит»; там, где выравнивание по вертикали не нужно, типографы предпочитают пропорциональные ([Fonts.com: Proportional vs. Tabular Figures](https://www.fonts.com/content/learning/fontology/level-3/numbers/proportional-vs-tabular-figures) — по выдаче поиска). Поэтому одиночная крупная статичная сумма может быть пропорциональной — по рассуждению заметок, так она выглядит плотнее. В CSS табличные цифры включаются свойством `font-variant-numeric: tabular-nums`; оно работает во всех браузерах, включая Safari на iOS с версии 9.3, и MDN советует именно его, а не низкоуровневое `font-feature-settings` ([MDN: font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric), [MDN: font-feature-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings)). В приложении это свойство уже задано глобально и ещё в 13 местах — то есть намерение правильное.

### Проверенный факт: у Golos Text «табличные» цифры разной ширины

Замер в Chrome на Windows 11 при включённом `tabular-nums`, кегле 40 px и весе 600 (заметка `lab_measurements.md`, раздел 3):

| Цифры | 0, 1, 4, 7 | 8 | 6, 9 | 3 | 2, 5 |
|---|---|---|---|---|---|
| Ширина | 25,56 px | 25,16 px | 24,96 px | 24,16 px | 23,96 px |

Разброс — 1,6 px на кегле 40 px, то есть около 6 % ширины цифры; на кегле 15 px это до 0,6 px на каждую цифру. Неровность есть при любом весе. Разбор самого файла шрифта объясняет причину: у цифр 2, 3, 5, 6, 8, 9 «табличный» вариант имеет ту же ширину, что и обычный ([google/fonts, Golos Text](https://github.com/google/fonts/tree/main/ofl/golostext)). Для сравнения, у Inter все десять цифр — ровно 25,78 px при любом весе от 400 до 700. **Вывод: приложение просит табличные цифры, но с Golos Text суммы в столбцах не стоят точно друг под другом. Это главный практический довод сменить шрифт цифр.**

На iPhone цифры системного шрифта по умолчанию пропорциональные — так с iOS 9, по пересказу доклада Apple в блоге ([Use Your Loaf](https://useyourloaf.com/blog/ios-9-proportional-numbers)); табличные включаются тем же свойством. WebKit держит тест, который применяет `tabular-nums` к системному шрифту ([тест WebKit](https://webkit.googlesource.com/WebKit/+/49e061d8a3dbe8c30f3935dcdd27d7b6b9ae2882/LayoutTests/fast/text/system-font-features.html)), но есть и старый отчёт о сбое ([Mozilla bug 1540143](https://bugzilla.mozilla.org/show_bug.cgi?id=1540143)). Две заметки пересказывают этот отчёт по-разному (в одной сбой был в Safari 12, в другой — в Firefox), поэтому вопрос считается открытым: **работает ли `tabular-nums` на системном шрифте в нынешнем Safari — НЕ ПРОВЕРЕНО**, нужно посмотреть на iPhone.

### Крупная сумма: оптический размер и расстояние между знаками

Оптический размер — это когда у шрифта есть отдельный рисунок для мелкого и для крупного текста. На iPhone система подбирает его сама ([HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)). У Inter такая настройка тоже есть (диапазон 14–32), но только в более тяжёлых файлах; браузеры включают её автоматически ([MDN: font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing)). В лаборатории подключены именно такие файлы Inter. В какой единице браузеры считают оптический размер — **НЕ ПРОВЕРЕНО**.

Расстояние между знаками (трекинг) Apple задаёт таблицей: для SF Pro на 17 pt оно слегка отрицательное, а на крупных кеглях — слегка положительное, например +8 тысячных кегля на 48 pt ([HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)). В приложениях система применяет эту таблицу сама; **делает ли это Safari для веб-текста — НЕ ПРОВЕРЕНО**. Практический вывод заметок: на iPhone с системным шрифтом `letter-spacing` для сумм не задавать. Для Inter с оптическим размером на крупном кегле трекинг близок к нулю, а для шрифтов без такой настройки уместно около −0,02 от кегля — это оценка исследователя, значение подбирается глазами.

### Копейки, знак ₽, минус и пробел между тысячами

Сейчас копейки показываются только у нецелых сумм, а мельче и серее рублей они лишь на экране «Деньги» и в подвале командировки. Приём «крупные рубли, мелкие копейки, спокойный знак ₽» делается обычной разметкой: копейки и знак валюты получают меньший размер (в заготовке заметок — 0,6 от размера рублей) и приглушённый цвет, выравнивание — по нижней линии цифр. Приглушённые части должны сохранять контраст не ниже 4,5:1 ([HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)). Чтобы экранный диктор читал сумму целиком, заметки советуют дублировать её текстовой подписью; как VoiceOver прочитает такую сумму и минус — **НЕ ПРОВЕРЕНО** на устройстве.

Знак валюты в русском тексте ставится после числа ([«Ководство», § 74](https://www.artlebedev.ru/kovodstvo/74/)), а знак рубля — с пробелом от числа ([«Ководство», § 159](https://www.artlebedev.ru/kovodstvo/159/)); так его ставит и стандартная база локалей ([CLDR, ru.xml](https://github.com/unicode-org/cldr/blob/main/common/main/ru.xml)). Знак ₽ — обычный символ, не эмодзи: его вид определяет только текстовый шрифт.

Минус — отдельный знак, не дефис: в хороших шрифтах он выровнен по высоте цифр ([«Ководство», § 97](https://www.artlebedev.ru/kovodstvo/97/)). Приложение уже подставляет правильный минус «−» само. У Inter из готовых сборок минус стоит ниже середины цифр на 0,079 кегля (на 48 px это 3,8 px); заметки предлагают при необходимости приподнять знак разметкой. При включённых табличных цифрах плюс и минус у Inter получают ширину цифры, так что суммы не прыгают при смене знака ([google/fonts, разбор файлов](https://github.com/google/fonts/tree/main/ofl)). Для SF Pro такие замеры не делались.

Пробел между тысячами оставлять тот, что даёт браузер, — обычный неразрывный. Узкого неразрывного пробела в готовых сборках шрифтов нет вовсе: браузер взял бы его из чужого шрифта с чужой шириной ([список подмножеств Fontsource](https://api.fontsource.org/v1/fonts/inter)).

### Что выдаёт Intl.NumberFormat('ru-RU')

Проверено запуском на рабочем компьютере (Node 26.13.0 с тем же движком, что в Chrome; данные локали — [CLDR, ru.xml](https://github.com/unicode-org/cldr/blob/main/common/main/ru.xml)):

| Что форматируется | Результат | Что важно |
|---|---|---|
| 110663.5, рубли | 110 663,50 ₽ | между разрядами и перед ₽ — неразрывный пробел, дробная часть через запятую |
| 85237 | 85 237,00 ₽ | «,00» добавляется всегда |
| 85237 с настройкой `trailingZeroDisplay: 'stripIfInteger'` | 85 237 ₽ | копейки скрываются у целых сумм |
| 1234.5 | 1 234,50 ₽ | четырёхзначные числа тоже разбиваются |
| −25426.5 | -25 426,50 ₽ | минус — обычный дефис, не типографский «−» |
| 110663.5 с настройкой `maximumFractionDigits: 0` | 110 664 ₽ | округление до рубля |
| −0.004 | -0,00 ₽ | получается «минус ноль»; убирается настройкой `signDisplay: 'negative'` |
| 85237 с настройкой `signDisplay: 'always'` | +85 237,00 ₽ | плюс у положительных |

Узкого пробела и типографского минуса русская локаль не выдаёт, поэтому заметки советуют собирать сумму из частей (`formatToParts`) и самим подставлять минус «−», а рубли и копейки форматировать раздельно из целых копеек, без деления дробных чисел ([MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)). В Safari ожидается тот же результат, потому что символы задаёт общая база локалей, но **вывод Safari вживую НЕ ПРОВЕРЕН**; в самом Chrome строки тоже не снимались.

### Защита от обрезания

В приложении длинные суммы уже подгоняются скриптами (`fitBig`, `fitMonth`, `fitTiles`), и это правильная основа: чисто CSS-свойство подгонки текста `text-fit` есть только в Chrome 150 и новее, в Safari его нет ([данные MDN](https://github.com/mdn/browser-compat-data)). К этому заметки добавляют три правила. Сумма не должна переноситься. Высоту строки у суммы не делать меньше 1,1 и не обрезать сам элемент: у Inter при высоте строки 1 хвост запятой срезается примерно на 2 px на кегле 48 px (расчёт исследователя). Точную посадку цифр по высоте можно получить свойством `text-box`, которое уже работает в Safari 18.2 и Chrome 133 ([MDN: text-box-trim](https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim)). По расчёту заметок для Inter, сумма «1 250 000,00 ₽» на экране 440 px с полями по 16 px помещается при кегле не больше 53,6 px; по этому расчёту нынешние размеры крупной суммы (до 36 px, в варианте D — 40 px) оставляют запас. Для SF Pro ширины не измерялись — после смены шрифта подгонку нужно перепроверить в рамке и на iPhone. Сами CSS-заготовки из заметок в рамке iPhone не запускались.

## 6. Значки: Lucide продолжает стиль нынешней нижней панели

Сейчас в приложении смешаны четыре графических языка: контурные значки нижней панели (пять штук, сетка 24, линия 1,9, скруглённые концы), цветные рисунки счетов, эмодзи категорий и текстовые знаки вроде крестика и стрелок (чтение `index.html`, заметка `lab_measurements.md`). Единый набор значков — самый простой способ это выровнять.

**Lucide подходит лучше всего потому, что он уже «тот же стиль».** Его значки нарисованы на сетке 24×24 линией толщиной 2 со скруглёнными концами и стыками, цвет берут из цвета текста, а толщина меняется одним числом — её можно поставить 1,9, как у нынешней панели ([пример значка Lucide](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shopping-bag.svg)). Набор закрывает все 12 проверенных категорий (покупки, продукты, транспорт, такси, кафе, рестораны, дом, здоровье, развлечения, образование, путешествия, подписки) и служебные значки: кошелёк, плюс, минус, стрелки, диаграмма, настройки, календарь, поиск, корзина, карандаш, галочка, крестик, знак рубля ([список файлов lucide-static 1.72.0](https://data.jsdelivr.com/v1/packages/npm/lucide-static@1.72.0?structure=flat)). Две ловушки с именами: значка «такси» нет, вместо него `car-taxi-front`; старые имена `home`, `pie-chart`, `trash-2`, `edit` заменены на `house`, `chart-pie`, `trash`, `square-pen`. Файлы стоит брать из версии с точным номером и один раз положить в проект — ссылаться на чужие адреса из приложения нельзя, пропадёт работа офлайн.

Слабое место Lucide — нет значков с заливкой. В iOS контурный вид — основной, а заливка используется в панели вкладок и для выбранного состояния ([HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)); с Lucide выбранное состояние придётся показывать цветом или подложкой, как в приложении сделано сейчас.

Альтернативы на случай, если в галерее Lucide не понравится. **Phosphor** — шесть вариантов каждого значка, включая заливку для выбранного состояния; все нужные имена есть. **Ionicons** — набор, изначально рисовавшийся в том числе под iOS, у каждого значка три варианта. **Tabler** — близок к Lucide, но заливки есть не у всех и нет такси. **Iconoir** и **Heroicons** — тонкая линия 1,5, но у первого нет такси, корзинки, билета и круговой диаграммы, а второй мал (324 значка). Источники — списки файлов пакетов: [Phosphor](https://data.jsdelivr.com/v1/packages/npm/@phosphor-icons/core@2.1.1?structure=flat), [Ionicons](https://data.jsdelivr.com/v1/packages/npm/ionicons@8.1.0?structure=flat), [Tabler](https://data.jsdelivr.com/v1/packages/npm/@tabler/icons@3.51.0?structure=flat), [Iconoir](https://data.jsdelivr.com/v1/packages/npm/iconoir@7.12.2?structure=flat). Все шесть наборов (по 25 значков) встроены в лабораторию.

Честная оговорка: авторитетного сравнения «какой открытый набор ближе всего к SF Symbols» найти не удалось. По оценке исследователя, по устройству ближе всех Phosphor и Ionicons, а Lucide и Tabler близки формой штриха; глазами в рамке iPhone наборы не сверялись. **НЕ ПРОВЕРЕНО** также, как Safari на iPhone применяет толщину линии, заданную через CSS поверх значения в самом значке.

Отдельно про иконку приложения на главном экране: делать её из готового значка любого набора не стоит, а знаки, похожие до смешения на SF Symbols, в иконках и логотипах Apple запрещает прямо ([Xcode and Apple SDKs Agreement, п. 2.10](https://www.apple.com/legal/sla/docs/xcode.pdf)).

## 7. Эмодзи: законных путей четыре, одинаковый вид дают только привезённые картинки

Сейчас все категории обозначены цветными эмодзи, которые рисует само устройство. У этого есть два следствия. Один и тот же знак служит разным смыслам (полумесяц означает и «Закят», и тёмную тему; чемодан — две категории; плюс — три категории «Другое»). И вид эмодзи зависит от устройства: на iPhone это Apple Color Emoji, на Windows 11 — Segoe UI Emoji, на Android — Noto Color Emoji ([Emojipedia: Microsoft 3D Fluent](https://emojipedia.org/microsoft-3D-fluent), [Noto Emoji README](https://github.com/googlefonts/noto-emoji/blob/main/README.md)). Замер на рабочем компьютере показал, что Chrome 157 рисует системные эмодзи Windows объёмными, с градиентами, — предпросмотр на Windows не показывает, как эмодзи выглядят на iPhone (заметка `emoji.md`).

| Вариант | Что на iPhone | Что на Windows | Вес на 18 значков | Обязанности |
|---|---|---|---|---|
| Системные эмодзи (символ в тексте) | настоящие эмодзи Apple | эмодзи Microsoft | 0 | нет |
| Привезённые SVG: Twemoji | одинаково везде, плоские | то же | 16,7 КБ | строка об авторстве (CC-BY 4.0) |
| Привезённые SVG: Fluent Flat / Fluent Color | одинаково везде | то же | 30,8 КБ / 319,8 КБ | сохранить уведомление MIT |
| Привезённые SVG: OpenMoji | одинаково везде, контурные | то же | 51,4 КБ | авторство; изменённые значки — под той же лицензией (CC BY-SA 4.0) |
| Привезённые SVG: Noto 2D | одинаково везде | то же | 178,6 КБ | сохранить текст Apache 2.0 |
| Шрифт-эмодзи (Noto Color Emoji) | одинаково, но Safari и Chrome нужны разные файлы | то же | около 2,1 МБ и 4 МБ, либо один файл 5,8 МБ | OFL 1.1 |
| Заменить эмодзи значками (Lucide) | одинаково везде, в цвет текста | то же | около 0,5 КБ за значок | сохранить текст ISC |

Источники: размеры и адреса файлов — заметка `emoji.md` по прямым запросам, например [Twemoji](https://raw.githubusercontent.com/jdecked/twemoji/main/assets/svg/1f6d2.svg); лицензии — [Twemoji README](https://github.com/jdecked/twemoji/blob/main/README.md), [Fluent Emoji LICENSE](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE), [OpenMoji README](https://github.com/hfg-gmuend/openmoji/blob/master/README.md), [условия CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en), [Noto Emoji README](https://github.com/googlefonts/noto-emoji/blob/main/README.md); веб-шрифт — [Google Fonts, Noto Color Emoji](https://fonts.googleapis.com/css2?family=Noto+Color+Emoji).

**Если цель — именно вид Apple на iPhone, самый точный и законный способ — ничего не привозить и писать обычные символы.** Привозить набор картинок стоит только тогда, когда значки должны выглядеть одинаково на всех устройствах. По мнению исследователя, из открытых наборов к объёмному глянцевому стилю Apple ближе всего Fluent Color и новый объёмный Noto 3D, из плоских — Noto 2D; сравнения бок о бок с настоящими эмодзи Apple не делалось. Все четыре набора (по 18 значков) лежат в лаборатории; файлов Apple там нет.

Три технических правила для системных эмодзи. Сумки с покупками (U+1F6CD), тарелку с приборами (U+1F37D) и самолёт (U+2708) нужно писать с добавочным знаком U+FE0F сразу после символа, иначе в Windows они получаются чёрно-белыми — это замер; такие знаки по данным Unicode «текстовые по умолчанию» ([emoji-data.txt](https://www.unicode.org/Public/UCD/latest/ucd/emoji/emoji-data.txt)). Обратный знак U+FE0E («сделать текстовым») на iPhone работает ненадёжно ([Apple Developer Forums, ветка 774794](https://developer.apple.com/forums/thread/774794)), поэтому одноцветные галочки, стрелки и сердечки надёжнее делать значками SVG. Свойство CSS `font-variant-emoji` на iPhone не поможет: в Safari на iOS оно выключено по умолчанию ([caniuse](https://caniuse.com/mdn-css_properties_font-variant-emoji)). Как нынешний Safari рисует эти знаки с добавочными символами и без них — **НЕ ПРОВЕРЕНО** на устройстве.

Что незаконно или не годится: шрифт Apple Color Emoji и любые его перепаковки; JoyPixels (для реального использования нужна платная лицензия, полный текст бесплатной не прочитан); Tossface (запрет неразрешённых изменений мешает перекрашиванию под тёмную тему); анимированные наборы (десятки и сотни килобайт на один значок). Лицензия анимированных эмодзи Telegram — **НЕ ПРОВЕРЕНА**, использовать нельзя.

## 8. Windows и iPhone: значки и свои шрифты совпадут, системное будет отличаться

Правило простое: одинаково выглядит только то, что приложение привозит с собой (свои файлы шрифтов, значки SVG, картинки). Всё, что берётся у системы, на каждом устройстве своё — и в этом как раз смысл системного шрифта.

| Что | iPhone (Safari и PWA) | Windows 11, Chrome | Что делать |
|---|---|---|---|
| Цифры через системный стек с Inter | SF Pro | Inter | смириться: на компьютере виден Inter, вид SF Pro проверять на iPhone |
| Текст на Golos Text (свой файл) | одинаково | одинаково | ничего |
| `ui-rounded` (скруглённый шрифт) | SF Rounded | пропускается | не опираться, если нужна одинаковая «округлость» |
| Цифры одной ширины | на SF Pro ожидается, но **НЕ ПРОВЕРЕНО** | у Inter ровно (замер) | проверить на iPhone |
| Значки SVG в самом файле | одинаково | одинаково | ничего |
| Системные эмодзи | эмодзи Apple | объёмные эмодзи Microsoft | писать с U+FE0F там, где нужно |
| Флаги стран | рисуются | Windows флаги не рисует | иметь в виду при предпросмотре |
| Форматирование сумм `Intl` | ожидается то же (**НЕ ПРОВЕРЕНО**) | проверено на том же движке | собирать сумму из частей |
| Размытый «стеклянный» фон (`backdrop-filter`) | работает; без префикса с Safari 18 | работает | писать и вариант с `-webkit-` |
| Преломление «жидкого стекла» через SVG-фильтр | не работает | только Chromium | не использовать |
| «Сквиркл» — непрерывные углы (`corner-shape`) | нет | Chrome 139 и новее | обычные скругления |
| Подгонка текста `text-fit` | нет | Chrome 150 и новее | подгонка своим скриптом |
| Точная высота строки `text-box` | Safari 18.2 и новее | Chrome 133 и новее | можно как улучшение |
| Цветные шрифты с градиентами (COLRv1) | нет | да | для эмодзи — SVG, а не шрифт |
| Переключатель `<input switch>` | Safari 17.4 и новее; тактильный отклик — с iOS 18 | нет, обычный флажок | только как улучшение |

Источники: системные шрифты — [Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md) и [данные MDN](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/font-family.json); флаги — [README полифила TalkJS](https://github.com/talkjs/country-flag-emoji-polyfill); размытие — [данные MDN, backdrop-filter](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/backdrop-filter.json); преломление — [README liquid-glass-react](https://raw.githubusercontent.com/rdev/liquid-glass-react/master/README.md); «сквиркл» — [данные MDN, corner-shape](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/corner-shape.json); цветные шрифты — [caniuse: COLRv1](https://caniuse.com/colr-v1); переключатель — [блог WebKit](https://webkit.org/blog/15054/an-html-switch-control/).

Что будет отличаться наверняка: ширина строк, переносы и высота блоков с цифрами, потому что у SF Pro и Inter разные ширины знаков; метрики этих двух шрифтов в исследовании не сравнивались. Поэтому окончательную вёрстку сумм нужно смотреть на настоящем iPhone, а не только в рамке на компьютере. Рамка 440×956 при этом, скорее всего, верна: Apple указывает для iPhone 18 Pro Max экран 2868×1320 пикселей при 460 ppi — те же числа, что у двух предыдущих Pro Max с логическим размером 440×956 ([характеристики iPhone 18 Pro](https://www.apple.com/uk/iphone-18-pro/specs/)); сама цифра 440×956 для этой модели Apple не опубликована, это вывод делением на три.

## 9. Что лучше не использовать и почему

| Что | Почему | Источник |
|---|---|---|
| Любые файлы Apple: шрифты SF, выгрузки SF Symbols, шрифт и картинки Apple Color Emoji, графика UI-китов; репозитории и пакеты, которые их раздают | запрещено лицензиями Apple; пометка MIT на чужом репозитории прав не даёт | [Apple Fonts](https://developer.apple.com/fonts/), [соглашение Apple, п. 2.10](https://www.apple.com/legal/sla/docs/xcode.pdf), [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) |
| Установка SF Pro на компьютер с Windows «для предпросмотра» | спорная зона лицензии; безопаснее смотреть на iPhone (вывод исследователя) | [Apple Fonts](https://developer.apple.com/fonts/) |
| Framework7 Icons | автор сам пишет, что набор основан на SF Symbols; релизов нет с 2021 года. В одной из заметок он назван допустимым «выборочно» из-за лицензии MIT, но здесь принята более строгая оценка | [блог Framework7](https://blog.framework7.io/migration-to-framework7-v5) |
| Framework7, Ionic, Onsen UI | требуют собственной разметки страниц и запуска; весят больше самого приложения — это и есть переписывание | [Framework7: разметка приложения](https://framework7.io/docs/app-layout), [Ionic: CDN](https://ionicframework.com/docs/intro/cdn) |
| Konsta UI | работает только с Tailwind и React, Vue или Svelte | [konstaui.com](https://konstaui.com/) |
| Puppertino целиком | 55–59 КБ сжатого CSS, правило на все элементы страницы; новой версии месяц, автор один | [Puppertino, colors.css](https://cdn.jsdelivr.net/npm/@codedgar/puppertino@2.0.0/dist/css/colors.css) |
| Библиотеки «жидкого стекла» | преломление в Safari не видно; у одной из популярных демо нет лицензии | [README liquid-glass-react](https://raw.githubusercontent.com/rdev/liquid-glass-react/master/README.md) |
| css.gg, Solar, Remix Icon | css.gg — коммерческое использование только с разрешения и запрет производных работ; Solar — три разных указания лицензии; Remix Icon — новая собственная лицензия (для интерфейса годится, для иконки приложения и логотипа нет) | [css.gg LICENSE](https://raw.githubusercontent.com/astrit/css.gg/main/LICENSE.md), [Remix Icon License](https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/License) |
| Feather | развитие остановилось, преемник — Lucide | [репозиторий Feather](https://github.com/feathericons/feather) |
| Шрифты значков, общие спрайты, компоненты Iconify и `<ion-icon>` | сотни килобайт ради трёх десятков значков либо догрузка по сети, то есть без интернета не работают | [README lucide-static](https://unpkg.com/lucide-static@1.72.0/README.md), [readme Ionicons](https://raw.githubusercontent.com/ionic-team/ionicons/main/readme.md) |
| Замена эмодзи скриптом с картинками из CDN, оригинальный `twitter/twemoji` | по умолчанию нужен интернет; оригинал застрял на Emoji 14.0 | [README jdecked/twemoji](https://github.com/jdecked/twemoji/blob/main/README.md), [README twitter/twemoji](https://github.com/twitter/twemoji/blob/master/README.md) |
| Эмодзи веб-шрифтом | 2–6 МБ и разные форматы для Safari и Chrome ради десятков значков | [Google Fonts, Noto Color Emoji](https://fonts.googleapis.com/css2?family=Noto+Color+Emoji) |
| JoyPixels, Tossface, анимированные наборы | платная лицензия, запрет изменений, большой вес | [JoyPixels LICENSE](https://github.com/joypixels/emoji-toolkit/blob/master/LICENSE.md), [Tossface LICENSE](https://github.com/toss/tossface/blob/main/LICENSE) |
| numeral.js, accounting.js, odometer; fitty, textFit | первые три заброшены с 2017 года, у двух последних коммитов нет с 2023 и 2021 годов; встроенных средств браузера и своих скриптов хватает | [numeral в npm](https://www.npmjs.com/package/numeral), [fitty на GitHub](https://github.com/rikschennink/fitty) |
| Golos Text и SN Pro для цифр; Wix Madefor Display, Commissioner | цифры разной ширины либо табличных цифр нет вовсе | замер, `lab_measurements.md`; [google/fonts](https://github.com/google/fonts/tree/main/ofl) |
| Шрифты без кириллицы или без ₽ (Google Sans Flex, Mona Sans, DM Sans, Figtree, Sofia Sans) и фирменные шрифты банков | не подходят для русского интерфейса с рублями; фирменные — закрыты | [google/fonts](https://github.com/google/fonts/tree/main/ofl) |

## 10. Рекомендация: вариант D — Hybrid как основа

В галерее пять вариантов; описания взяты со страницы лаборатории.

| Вариант | Суть | Шрифт текста и цифр | Значки и эмодзи |
|---|---|---|---|
| «Сейчас» | приложение как есть, точка отсчёта | Golos Text и для текста, и для цифр; копейки одного размера с рублями | эмодзи системы |
| A — Apple Native | системный шрифт, размеры и цвета из руководства Apple, цветные плитки значков как в «Настройках», сдержанные суммы | системный стек и для текста, и для цифр: SF Pro на iPhone, Inter на Windows и Android | Ionicons с заливкой |
| B — Premium Finance | крупный выразительный баланс, золотой акцент, приглушённые копейки и ₽ | текст Inter, цифры Manrope | тонкие контурные Phosphor |
| C — Modern iOS | крупные скругления, «стеклянная» панель вкладок, округлые цифры | текст — системный стек (SF Pro или Inter); цифры — SF Rounded на iPhone, SN Pro на Windows и Android | Phosphor и системные эмодзи в категориях |
| **D — Hybrid** | нынешний дизайн без перестройки: те же цвета, Golos Text, заголовки капсом; меняются цифры, копейки и значки | текст Golos Text; цифры — SF Pro на iPhone, Inter на Windows и Android | Lucide вместо эмодзи категорий |

**Рекомендуется D — Hybrid как основа.** Причин пять, и каждая опирается на проверенное.

Первая: он исправляет единственный доказанный дефект — неровные цифры Golos Text — и больше ничего не ломает. Цифры идут через системный стек Apple: на iPhone это SF Pro, полученный законным путём, который называет сама Apple ([Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md)); на Windows и Android — Inter, у которого все цифры одной ширины по замеру ([rsms.me/inter](https://rsms.me/inter/)).

Вторая: он отвечает условию «без переписывания». Цвета, шрифт текста и заголовки капсом остаются; HIG заголовки капсом не запрещает и отдельно не регулирует (в прочитанных разделах об этом ничего нет). Варианты A и C меняют палитру на системные цвета iOS, вариант B добавляет два новых шрифта и золотой акцент — это уже новый облик, а не подтяжка.

Третья: значки Lucide совпадают по стилю с нынешними значками нижней панели — сетка 24, линия около 1,9, скруглённые концы, — поэтому панель не нужно перерисовывать, а категории получают тот же язык ([Lucide](https://github.com/lucide-icons/lucide), лицензия ISC). Заодно уходит путаница, когда один эмодзи означает несколько вещей.

Четвёртая: системные эмодзи остаются только там, где они действительно нужны, и на iPhone это настоящие эмодзи Apple — без единого файла Apple в репозитории ([App Review Guidelines, п. 4.5.6](https://developer.apple.com/app-store/review/guidelines/)).

Пятая: он самый лёгкий и офлайновый. Добавляются файлы Inter (148,5 КБ в простой версии или 230,3 КБ с оптическим размером, как в лаборатории) и 12–18 КБ значков внутри `index.html`; ни CDN, ни фреймворков ([список файлов Inter](https://data.jsdelivr.com/v1/packages/npm/@fontsource-variable/inter@5.3.0?structure=flat)). У варианта C, для сравнения, запасной шрифт SN Pro на Windows и Android имеет тот же дефект неровных цифр, а скруглённый шрифт Apple доступен только на устройствах Apple.

**Возражения, которые стоит взвесить.** Вариант A — «самый Apple»: если нужна максимальная похожесть на системные приложения, он ближе к цели, но приложение перестаёт быть похожим на себя. В варианте D на одном экране живут две гарнитуры (Golos Text в тексте и SF Pro или Inter в цифрах), а HIG советует сводить число гарнитур к минимуму ([HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)) — в галерее нужно посмотреть, заметен ли шов. И цифры на компьютере (Inter) не будут точь-в-точь как на iPhone (SF Pro); если важнее полная одинаковость, запасной ход — Inter на всех устройствах, но тогда это уже не «родные» цифры Apple.

**Что вариант D означал бы на практике** (ничего из этого не сделано, приложение не менялось): шрифт цифр заменить на системный стек с Inter и положить файлы Inter в `fonts/` и в кэш `sw.js` со сменой версии кэша; копейки и знак ₽ сделать мельче и спокойнее единообразно на всех экранах; эмодзи категорий заменить 25–30 значками Lucide внутри `index.html`, сохранив текст лицензии; оставшиеся системные эмодзи писать с U+FE0F там, где это нужно. Если значки категорий записаны в сохранённых данных, замену нужно делать так, чтобы не трогать формат записей в localStorage, — в заметках это не выяснялось.

**Честно о статусе рекомендации.** Это рекомендация исследователя, а не решение: окончательный выбор делаешь ты, глядя на галерею `design-lab/apple-typography.html`. Страница проверена в Chrome на Windows 11 (ширина 440 px и 1500 px, все шесть вкладок, консоль без ошибок), но **на настоящем iPhone она ещё не открывалась**. Значит, самое главное в варианте D — как выглядят цифры SF Pro рядом с Golos Text, есть ли у SF Pro знак ₽ и ровны ли цифры в Safari — пока известно только по документации. Первый шаг после чтения отчёта — открыть лабораторию на своём iPhone и сравнить варианты там.

## Что осталось непроверенным и что проверить на настоящем iPhone

Проверить на iPhone (ничего из этого на устройстве не смотрели):

- сама страница лаборатории: как выглядят все пять вариантов, особенно цифры SF Pro рядом с текстом на Golos Text;
- есть ли знак ₽ в системном шрифте и совпадает ли он с цифрами по толщине во всех используемых весах;
- работают ли цифры одной ширины (`tabular-nums`) на системном шрифте в нынешнем Safari — встают ли суммы в списке ровно друг под другом;
- применяет ли Safari к системному шрифту трекинг Apple сам, без `letter-spacing`;
- что выдаёт `Intl.NumberFormat('ru-RU')` в Safari (пробелы, запятая, минус);
- как рисуются сумки, тарелка с приборами, самолёт, галочка и сердечко с добавочными знаками U+FE0F и U+FE0E и без них;
- как Safari применяет толщину линии значков, заданную через CSS;
- ширина строк и переносы сумм: SF Pro против Inter, работа подгонки длинных сумм;
- как VoiceOver читает сумму, разбитую на рубли, копейки и знак, и минус;
- ведёт ли себя системный шрифт так же в приложении, установленном на экран «Домой» (ожидается, что да; прямого источника нет);
- отступы безопасных зон на iPhone 18 Pro Max и официальный логический размер экрана (440×956 получено делением на три).

Не подтверждено документами:

- точный текст лицензий внутри сегодняшних установщиков шрифтов SF и приложения SF Symbols; есть ли редакция лицензии Apple Design Resources новее 2023 года; формулировка пункта о шрифтах в лицензии macOS;
- кириллица в SF Pro Rounded по первоисточнику; полный список дополнительных возможностей шрифта SF Pro;
- какой шрифт отдаёт `system-ui` в Chrome на Windows 11 и на Android именно в ноябре 2026 (источники 2022–2023 годов);
- официальные размеры Apple для переключателей, строк списков, панелей и радиусов в iOS 26 и 27 — в HIG их нет, числа в заметках взяты из открытых библиотек;
- в какой единице браузеры считают оптический размер шрифта; размер собственного подмножества Inter со знаком ₽;
- визуальная близость открытых шрифтов и наборов значков к SF Pro и SF Symbols — это оценки исследователя, сравнения в рамке iPhone не было;
- CSS-заготовки из заметок (суммы, переключатель, панель вкладок) не запускались в браузере;
- лицензия анимированных эмодзи Telegram, полный текст бесплатной лицензии JoyPixels, подключение Hugeicons без сборщика.

Отчёт не является юридической консультацией: спорные случаи с лицензиями Apple решает юрист или письменное разрешение Apple.
