# Emoji в веб-приложении: Apple Color Emoji и открытые наборы (состояние на 11.11.2026)

Условные обозначения. Все ссылки и цифры проверены 11.11.2026, если не указано иное. «API» = ответ `https://api.github.com/repos/{owner}/{repo}` (и `/releases/latest`, `/commits`, `/git/trees`). «npm» = `https://registry.npmjs.org/{pkg}`. «Локальный замер» = проверка, выполненная на машине разработки (Windows 11 Pro, сборка 26300; Chrome 157.0.8103.39 в режиме headless; встроенный Chromium 156) — это первичное наблюдение, а не пересказ. «НЕ ПРОВЕРЕНО» = источник недоступен или не разобран. Размеры одиночных SVG — длина текста ответа (≈ байты).

Артефакты локальных замеров (тестовая страница и снимок экрана) были временными и в проект не входят.

---

## 1. Apple Color Emoji: что это технически и юридически

### Takeaway
Apple Color Emoji — проприетарный растровый шрифт (PNG в таблице `sbix`), входящий в iOS/macOS. Веб-страница вправе просто выводить символы Unicode, и на устройствах Apple они сами нарисуются этим шрифтом; а вот вкладывать сам шрифт или картинки Apple в приложение и показывать их на других платформах Apple прямо запрещает.

### Cited Findings
- Формат: глифы хранятся как PNG в таблице `sbix` (позже стандартизована в OpenType 1.8); размеры растров (strikes) — 20, 32, 40, 48, 64, 96 и 160 px. — [Wikipedia: Apple Color Emoji](https://en.wikipedia.org/wiki/Apple_Color_Emoji)
- Первый выпуск — ноябрь 2008, iPhone OS 2.2, 471 глиф; крупный редизайн — iOS 10.2 (декабрь 2016), многие рисунки стали выглядеть как 3D-рендер. — [Wikipedia: Apple Color Emoji](https://en.wikipedia.org/wiki/Apple_Color_Emoji)
- Путь к файлу на macOS: `/System/Library/Fonts/Apple Color Emoji.ttc` (указан как путь по умолчанию в README стороннего конвертера). — [samuelngs/apple-emoji-ttf README](https://github.com/samuelngs/apple-emoji-ttf/blob/v2/README.md)
- Версия Emoji: iOS 26.4 вышла 24.03.2026 и добавила Emoji 17.0 — 163 новых emoji, из них 8 новых понятий (остальное — варианты тона кожи). — [Emojipedia: iOS 26.4 Emoji Changelog](https://blog.emojipedia.org/apple-ios-26-4-emoji-changelog/)
- Emoji 18.0: по сообщениям прессы (январь 2026), черновик содержит 9 новых понятий + 10 вариантов тона кожи; на iPhone ожидался «в конце 2026 или начале 2027 в составе iOS 27» — это прогноз, не объявление Apple. — [MacRumors](https://www.macrumors.com/2026/01/09/new-unicode-emoji-18-coming-to-ios/), [9to5Mac](https://9to5mac.com/2026/01/09/new-emojis-coming-to-iphone-ios-27/)
- Косвенное подтверждение, что Unicode 18.0 уже вышел: релиз `googlefonts/noto-emoji` с названием «Unicode 18.0» опубликован 24.09.2026. — [API: noto-emoji releases/latest](https://api.github.com/repos/googlefonts/noto-emoji/releases/latest)
- Прямая цитата Apple (App Review Guidelines, п. 4.5.6, текст страницы получен напрямую 11.11.2026): "Apps may use Unicode characters that render as Apple emoji in their app and app metadata. Apple emoji may not be used on other platforms or embedded directly in your app binary." — [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Там же, п. 5.2.5: "Apps and extensions, including third-party keyboards and Sticker packs, may not include Apple emoji." — [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Unicode Consortium о картинках в своих таблицах: изображения "are for illustration only", "are the property of their respective owners"; "Inquiries for permission to use vendor images should be directed to those vendors, not to the Unicode Consortium." — [unicode.org/emoji/images.html](https://www.unicode.org/emoji/images.html)
- README набора `iamcal/emoji-data` (строка 158): "Apple images, Copyright © Apple Inc., are not licensed for commercial usage." — [iamcal/emoji-data README](https://github.com/iamcal/emoji-data/blob/master/README.md)
- Практика: в 2018 г. Apple отклоняла приложения по п. 5.2.5 за Apple-emoji в интерфейсе, причём применение правила было непоследовательным. — [TechCrunch, 08.02.2018](https://techcrunch.com/2018/02/08/theres-no-app-store-emoji-apocalypse-just-inconsistent-policy-enforcement/)
- Практика: в 2022 г. обновление Telegram задержали, пока из него не убрали анимированные emoji, повторявшие дизайн Apple. — [9to5Mac, 12.08.2022](https://9to5mac.com/2022/08/12/telegram-app-store-apple-complained-emoji/)

### Inferences
- Вердикт: PWA на GitHub Pages может свободно писать в HTML символы Unicode — на iPhone их нарисует системный Apple Color Emoji, это штатное поведение ОС и ничьих прав не затрагивает. Класть в репозиторий шрифт Apple, его PNG или их производные (спрайты, конвертированные TTF) нельзя: разрешения на распространение нет, а Apple прямо пишет «may not be used on other platforms».
- Правила App Review формально относятся к приложениям App Store, а не к сайтам; но это самое ясное публичное заявление Apple о своих emoji, и оно совпадает с общим авторским правом (рисунки — собственность Apple).
- На 11.11.2026 iPhone с актуальной iOS покрывает Emoji 17.0 (минимум). Для набора из 18 «финансовых» emoji это неважно: все они из Emoji 0.6–11.0 и есть на любой живой iOS.

### Gaps
- Точная формулировка пункта «Fonts» в лицензии macOS 26 — НЕ ПРОВЕРЕНО: [PDF Apple](https://www.apple.com/legal/sla/docs/macOSTahoe.pdf) скачивается, но текст в нём сжат и не извлёкся. Поисковая выдача показывает, что в лицензии macOS 10.12 есть фраза «you may use the fonts included with the Apple Software to display and print content while running the Apple Software» ([PDF](https://www.apple.com/legal/sla/docs/macOS1012.pdf)) — сам документ прочитать не удалось.
- Какая версия Emoji в iOS 27.x (вышла ли поддержка Emoji 18.0) — НЕ ПРОВЕРЕНО: найдены только прогнозы от января 2026.
- Путь к шрифту на iOS и точное число глифов в текущей версии — не найдено в первичных источниках.

---

## 2. Проекты на GitHub вокруг Apple emoji (существуют; использовать НЕЛЬЗЯ)

### Takeaway
Такие проекты есть и популярны, но все они лишь перепаковывают рисунки Apple; лицензия MIT в них относится к скриптам, а не к картинкам. Для приложения это юридически небезопасно — не рекомендовать и не использовать.

### Cited Findings
- `samuelngs/apple-emoji-linux` переименован в `samuelngs/apple-emoji-ttf`: 1 633 звезды, последний релиз «macOS 26 (20260722)» от 22.07.2026, лицензия репозитория MIT. — [API](https://api.github.com/repos/samuelngs/apple-emoji-linux), [releases/latest](https://api.github.com/repos/samuelngs/apple-emoji-ttf/releases/latest)
- Его собственный дисклеймер: "This project is for educational purposes only. All Apple Color Emoji assets and designs belong to Apple Inc. ... Using a font from a different operating system may have licensing implications; that responsibility is on you." — [README](https://github.com/samuelngs/apple-emoji-ttf/blob/v2/README.md)
- `iamcal/emoji-data`: 2 801 звезда, последний коммит 31.10.2026, последний тег v16.0.0; README заявляет Emoji 17.0 (Sep 2025). Содержит спрайты Apple, Google, Twitter, Facebook. — [API](https://api.github.com/repos/iamcal/emoji-data), [README](https://github.com/iamcal/emoji-data/blob/master/README.md)
- npm `emoji-datasource-apple`: 16.0.0 от 24.09.2025, 102,9 МБ, 3 816 файлов; в поле license стоит «MIT», хотя README того же проекта говорит, что картинки Apple не лицензированы для коммерческого использования. — [npm](https://registry.npmjs.org/emoji-datasource-apple), [README](https://github.com/iamcal/emoji-data/blob/master/README.md)
- Поиск GitHub «apple emoji» (277 репозиториев) показывает и другие извлекатели: `tmm1/emoji-extractor` (557 звёзд, без лицензии, последний push 26.01.2023), `PoomSmart/EmojiFonts` (184), `GORAlexComp/AppleColorEmojiFont` (76, без лицензии). — [GitHub search API](https://api.github.com/search/repositories?q=apple+emoji+in:name,description&sort=stars&order=desc)

### Inferences
- Поле «MIT» в npm-пакете или в репозитории не даёт прав на рисунки Apple: автор скрипта не может лицензировать чужое произведение. Это ловушка — пакет выглядит «открытым», а содержимое нет.
- Картинки emoji на Emojipedia — те же рисунки вендоров; к ним относится то же ограничение (см. цитату Unicode в разделе 1).

### Gaps
- Условия использования изображений на самом Emojipedia не проверялись.

---

## 3. Кто рисует emoji на какой платформе и чем они отличаются на вид

### Takeaway
Один и тот же символ выглядит по-разному: iPhone — Apple Color Emoji, Windows 11 — Segoe UI Emoji (Fluent), Android — Noto Color Emoji. Важная поправка к исходной посылке: на машине разработки Chrome рисует НЕ плоские, а объёмные Fluent-emoji с градиентами (шрифт Segoe UI Emoji там уже COLRv1); а Google в 2026 г. перевёл Noto на 3D-стиль.

### Cited Findings
- Apple: стиль описывается как насыщенные цвета с плавными переходами и лёгким глянцем; после iOS 10.2 многие рисунки похожи на 3D-рендер. — [Wikipedia: Apple Color Emoji](https://en.wikipedia.org/wiki/Apple_Color_Emoji)
- Windows 11: плоский Fluent — вариант Segoe UI Emoji по умолчанию с ноября 2021; объёмный «3D Fluent» реализован через цветной шрифт COLRv1, дебютировал в Teams (февраль 2022), после 23H2 (31.10.2023) — в Word и PowerPoint, а с 2025 г. «more broadly available across Windows 11». — [Emojipedia: Microsoft 3D Fluent](https://emojipedia.org/microsoft-3D-fluent)
- На момент выхода 23H2 Edge и Chrome ещё показывали плоские рисунки. — [Emojipedia: Windows 11 23H2 Emoji Changelog](https://blog.emojipedia.org/microsoft-windows-11-23h2-emoji-changelog/)
- Segoe UI Emoji в 23H2 — «гибрид»: COLRv1 (3D), COLRv0 (2D) и монохром; программа с поддержкой COLRv1 берёт 3D-вариант. — [Impress Watch (яп.)](https://forest.watch.impress.co.jp/docs/news/1572154.html)
- Microsoft: Emoji 17.0 показан в World Emoji Day 2026 и «began rolling out in late August 2026». — [Emojipedia: Microsoft 3D Fluent](https://emojipedia.org/microsoft-3D-fluent)
- Локальный замер (файл шрифта): `C:\Windows\Fonts\seguiemj.ttf` — 12 934 920 байт, изменён 09.09.2026, таблицы `COLR` (версия 1) + `CPAL` + `glyf`; таблиц `sbix`, `CBDT`, `SVG` нет. Справка о формате — [Chrome: COLRv1 fonts](https://developer.chrome.com/blog/colrv1-fonts)
- Локальный замер (снимок): Chrome 157 на этой Windows 11 рисует системные 🛒💰🏠☕😀🚕 объёмными, с градиентами и бликами — визуально совпадает со стилем «Color» из `microsoft/fluentui-emoji`, а не с «Flat». Сравнивалось с файлами [shopping_cart_color.svg](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shopping%20cart/Color/shopping_cart_color.svg) и [shopping_cart_flat.svg](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shopping%20cart/Flat/shopping_cart_flat.svg).
- Windows не рисует флаги стран: "Recent Windows versions (finally) support emojis natively, but they still do not support pretty country flags. By extension, all Chromium-based browsers can't display country flag emojis natively." — [talkjs/country-flag-emoji-polyfill README](https://github.com/talkjs/country-flag-emoji-polyfill)
- Android/Google: шрифт NotoColorEmoji (формат CBDT/CBLC) «is supported by Android and Chrome/Chromium OS». — [googlefonts/noto-emoji README](https://github.com/googlefonts/noto-emoji/blob/main/README.md)
- Noto 3D: полный 3D-редизайн Noto Color Emoji; показан в мае 2026, вышел на Pixel 11 20.08.2026, с 17.09.2026 раскатывается по приложениям Google, Android и устройствам партнёров. Рисунки описаны как «volumetric objects with lighting and shadow treatment throughout»; по оценке Emojipedia, многие рисунки при этом приблизились к версиям Apple. — [Emojipedia: Google Debuts Noto 3D](https://blog.emojipedia.org/google-debuts-noto-3d-emoji-overhaul-on-pixel-11/)

### Inferences
- Предпросмотр на Windows + Chrome не показывает, как emoji будут выглядеть на iPhone: формы, цвета и даже степень «объёмности» другие. Чтобы видеть одно и то же, emoji нужно поставлять самим приложением (SVG/шрифт), а не брать у системы.
- «Плоский Fluent в Windows 11» верно для 2021–2023 гг. и, возможно, для старых сборок; для сборки 26300 с Chrome 157 — уже неверно.

### Gaps
- На каких именно сборках Windows 11 и версиях Chrome включился COLRv1-вариант Segoe UI Emoji — первичного источника не найдено; подтверждено только наблюдением на одной машине.
- Как выглядит Android 17 с Noto 3D на устройствах не Pixel — не проверялось.
- Сравнение с настоящим рендером на iPhone в этом исследовании не делалось (нет устройства в контуре проверки).

---

## 4. Форматы цветных шрифтов и поддержка в браузерах

### Takeaway
Единого формата нет. Safari (включая iOS) до сих пор не умеет COLRv1; Chromium не умеет OpenType-SVG. Общие для обоих — COLRv0 и sbix. Chrome на Windows sbix поддерживает.

### Cited Findings
- COLRv1: Chrome 98+, Edge 98+, Firefox 107+, Samsung Internet 18+; Safari на macOS — «Not supported» во всех версиях вплоть до Technology Preview; Safari на iOS — «Not supported» вплоть до 27.2. — [caniuse: colr-v1](https://caniuse.com/colr-v1)
- Запрос на COLRv1 в WebKit (bug 233496) открыт с 2021 г. — [WebKit Bugzilla 233496](https://bugs.webkit.org/show_bug.cgi?id=233496)
- COLRv1 добавлен в Chrome 98; полный набор Noto «is reduced from 9MB for the bitmap version to 1.85MB in COLRv1+woff2 form». — [Chrome for Developers: COLRv1](https://developer.chrome.com/blog/colrv1-fonts)
- Локальный замер во встроенном Chromium 156 на Windows 11 (страница-тестер загружает веб-шрифты каждого формата): «SBIX is supported, COLR is supported, COLRv1 is supported, OpenType-SVG is not supported, CBDT/CBLC is supported». — [ChromaCheck](https://pixelambacht.nl/chromacheck/)
- Safari: поддерживает SVG-in-OpenType, sbix и COLR (v0) начиная с версии 12 (macOS 10.14 / iOS 12) — данные сайта 2018–2019 гг. — [colorfonts.wtf](https://www.colorfonts.wtf/)
- CBDT/CBLC в Safari не работает: «On macOS, only Chrome supports it». — [googlefonts/noto-emoji README](https://github.com/googlefonts/noto-emoji/blob/main/README.md)
- Сводная таблица OpenMoji по своим сборкам шрифта: COLRv0 — «Almost all modern webbrowsers»; COLRv1 — «Most modern browsers (not Safari)»; SVG-in-OT — «Firefox and Safari»; SBIX — «Safari, Chrome-based browsers»; CBDT — «Android applications, Old Chrome browsers». — [OpenMoji font/README](https://github.com/hfg-gmuend/openmoji/blob/master/font/README.md)
- Google Fonts сам подтверждает раскол форматов: одному и тому же запросу CSS он отдаёт Chrome и Firefox файлы с таблицами `COLR`+`CPAL`+`glyf`, а Safari iOS — файлы с таблицей `SVG ` (локальный разбор заголовков WOFF2). — [fonts.googleapis.com/css2?family=Noto+Color+Emoji](https://fonts.googleapis.com/css2?family=Noto+Color+Emoji)

### Inferences
- Сводка «работает ли»: 

| Формат | Safari iOS | Chrome/Edge (Windows) | Firefox |
|---|---|---|---|
| sbix (растр, Apple) | да | да (замер) | по таблице OpenMoji не заявлен |
| CBDT/CBLC (растр, Google) | нет | да (замер) | не заявлен |
| COLRv0 (вектор, плоские слои) | да | да (замер) | да |
| COLRv1 (вектор, градиенты) | нет | да (замер) | да, с 107 |
| OpenType-SVG | да | нет (замер) | да |

- Единственный векторный формат, который один файл шрифта донесёт и до Safari, и до Chrome, — COLRv0 (без градиентов). Для градиентных рисунков нужны два файла (COLRv1 + OT-SVG) или отказ от шрифта в пользу SVG-картинок.

### Gaps
- Поддержка sbix и CBDT в Firefox — прямого источника нет.
- Данные colorfonts.wtf старые (2018–2019); актуальный статус Safari по sbix/OT-SVG отдельно не перепроверялся, но раздача Google Fonts формата SVG для Safari это косвенно подтверждает.

---

## 5. Управление из CSS: стеки шрифтов, font-variant-emoji, селекторы FE0F/FE0E, unicode-range

### Takeaway
Надёжнее всего управлять видом символа прямо в тексте: добавлять U+FE0F (цветной emoji) или U+FE0E (текстовый знак). Свойство `font-variant-emoji` на iPhone не работает (в Safari выключено по умолчанию). Знаки ₽ и ✓ вообще не являются emoji — цветными они не станут никогда.

### Cited Findings
- `font-variant-emoji`: Chrome 131+, Edge 131+, Firefox 141+, Samsung Internet 29+; Safari macOS — только Technology Preview; Safari iOS 17.5–27.2 — «Disabled by default». — [caniuse: font-variant-emoji](https://caniuse.com/mdn-css_properties_font-variant-emoji)
- Значения: `normal` — браузер решает сам; `text` — как с селектором U+FE0E; `emoji` — как с U+FE0F; `unicode` — по свойствам Unicode, а селектор в тексте имеет приоритет. Статус MDN: «Limited availability… not Baseline». Пример MDN использует стек `"Noto Color Emoji", "Segoe UI Emoji", "Apple Color Emoji", sans-serif`. — [MDN: font-variant-emoji](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-emoji)
- Свойства Unicode (файл от 30.01.2026): U+2615 ☕, U+1F6D2 🛒, U+1F501 🔁 имеют `Emoji_Presentation` (по умолчанию цветные); U+2708 ✈, U+2665 ♥, U+2714 ✔, U+1F6CD 🛍, U+1F37D 🍽 — `Emoji` без `Emoji_Presentation` (по умолчанию текстовые); U+20BD ₽ и U+2713 ✓ в файле отсутствуют, то есть это не emoji. — [emoji-data.txt](https://www.unicode.org/Public/UCD/latest/ucd/emoji/emoji-data.txt)
- Локальный замер, Chrome 157 / Windows 11 (снимок `emoji-test.png`, тестовая страница перечислена в шапке): «голые» ✈ ♥ ✔ 🛍 🍽 рисуются чёрным текстовым знаком; с U+FE0F — цветным emoji; ☕ «голый» — цветной, с U+FE0E — чёрный; ✓ и ₽ остаются текстом даже с U+FE0F; `font-variant-emoji: text` делает чёрными все пять знаков (включая ☕), `font-variant-emoji: emoji` — все пять цветными. Справка о свойстве — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-emoji)
- Приём `unicode-range`: шрифт подключается так, что браузер берёт его только для заданных кодов — "the browser will only use it for country flag emojis and not for any other characters (using `unicode-range`)". — [talkjs/country-flag-emoji-polyfill README](https://github.com/talkjs/country-flag-emoji-polyfill)
- Google Fonts режет Noto Color Emoji на 11 блоков `@font-face` с `unicode-range` (первый — `U+1f1e6-1f1ff`, флаги). — [fonts.googleapis.com/css2?family=Noto+Color+Emoji](https://fonts.googleapis.com/css2?family=Noto+Color+Emoji)
- iOS: селектор U+FE0E работает ненадёжно. На форуме разработчиков Apple есть отчёт «Unicode characters with "Variation Selector-15" (U+FE0E) are not rendered as text in iOS 18.1.1»; в другом отчёте — VS15 убирает emoji-вид в Safari на Mac, но не в Safari на iPad. — [Apple Developer Forums 774794](https://developer.apple.com/forums/thread/774794), [Apple Developer Forums 746406](https://developer.apple.com/forums/thread/746406)
- Правило размещения селектора: он ставится сразу после символа, без пробела. — [Jeff Kreeftmeijer: Unicode variation selectors](https://jeffkreeftmeijer.com/unicode-variation-selectors/)

### Inferences
- Почему «скачет» вид символов между Windows и iPhone: у знаков без `Emoji_Presentation` вид по умолчанию текстовый, и результат зависит от того, в каком шрифте система первой найдёт глиф. На Windows это чёрный знак из Segoe UI Symbol/Segoe UI Emoji (замер выше); на iOS, судя по отчётам на форуме Apple, часть таких знаков рисуется как emoji, и даже U+FE0E это не всегда отменяет.
- Отсюда асимметрия: «сделать цветным» (U+FE0F) надёжно на обеих платформах, а «сделать текстовым» (U+FE0E) на iPhone может не сработать. Если знак обязан быть одноцветным и в цвете текста (галочка, стрелка, сердечко) — надёжнее SVG, чем символ.
- Практическое правило для разметки: 🛍 и 🍽 и ✈ всегда писать с U+FE0F (`&#x1F6CD;&#xFE0F;`), иначе на Windows они чёрно-белые. Если нужен именно текстовый знак (например ✔ или ♥ в цвете текста) — писать с U+FE0E и задавать шрифт явно, но проверять на iPhone.
- Для ₽ и ✓ вопрос «emoji или текст» не стоит: это обычные символы, их вид определяется только текстовым шрифтом; если нужна цветная «галочка» — брать ✔ U+2714 + FE0F или ✅ U+2705, либо SVG.
- Стек `font-family: …, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"` не делает emoji одинаковыми — он лишь гарантирует, что на каждой ОС возьмётся её собственный цветной шрифт.

### Gaps
- Поведение Safari на актуальной iOS 26/27 именно для ✈ ♥ ✔ 🛍 🍽 (текст или emoji, с селектором и без) — НЕ ПРОВЕРЕНО на устройстве: найдены только отчёты разработчиков про iOS 18 и про другие символы. Нужна ручная проверка на iPhone той же тестовой страницей.
- Исправила ли Apple обработку U+FE0E после iOS 18.1.1 — источника нет.

---

## 6. Emoji как веб-шрифт (чтобы на Windows и iPhone было одинаково)

### Takeaway
Технически возможно, но тяжело: Noto Color Emoji — это 2–4 МБ даже в нарезке, причём Safari и Chrome получают разные файлы. Готовые нумерованные файлы из `@fontsource/noto-color-emoji` — формата OpenType-SVG, то есть в Chrome цветных глифов не дадут. Для двух десятков значков шрифт избыточен.

### Cited Findings
- Google Fonts, Noto Color Emoji (v50): 11 файлов-срезов WOFF2. Для Chrome/Firefox суммарно 2 084 740 байт (от 10 124 до 708 608 на срез, таблицы COLR/CPAL); для Safari iOS — 3 954 376 байт (от 19 764 до 1 179 088, таблица SVG). Локальный замер запросами с разными User-Agent. — [fonts.googleapis.com/css2?family=Noto+Color+Emoji](https://fonts.googleapis.com/css2?family=Noto+Color+Emoji)
- `@fontsource/noto-color-emoji` 5.3.2 (20.09.2026, OFL-1.1, 24,7 МБ, 37 файлов): срезы `noto-color-emoji-{0..10}-400-normal.woff2` суммарно ≈3,95 МБ, плюс цельный `noto-color-emoji-emoji-400-normal.woff2` — 5 783 840 байт. — [npm](https://registry.npmjs.org/@fontsource%2fnoto-color-emoji), [список файлов jsDelivr](https://data.jsdelivr.com/v1/packages/npm/@fontsource/noto-color-emoji@5.3.2?structure=flat)
- Локальный разбор заголовков WOFF2: срезы 0 и 10 из fontsource содержат таблицу `SVG ` и пустой `glyf` (44 байта), таблицы `COLR` нет; цельный файл `…-emoji-400-normal.woff2` содержит и `COLR`+`CPAL`, и `SVG `. — [файл среза на jsDelivr](https://cdn.jsdelivr.net/npm/@fontsource/noto-color-emoji@5.3.2/files/noto-color-emoji-10-400-normal.woff2)
- Файлы шрифта в репозитории Noto (`2D/fonts/`): `NotoColorEmoji.ttf` 10 730 124 байт (CBDT), `Noto-COLRv1.ttf` 5 038 236, `NotoColorEmoji_WindowsCompatible.ttf` 10 739 048, `NotoColorEmoji-flagsonly.ttf` 872 100, а также варианты `-noflags` и `-emojicompat`. — [API: дерево репозитория](https://api.github.com/repos/googlefonts/noto-emoji/git/trees/main)
- Монохромный Noto Emoji — вариативный шрифт на Google Fonts; npm `@fontsource/noto-emoji` 5.3.2 (OFL-1.1, 11,1 МБ). — [noto-emoji README](https://github.com/googlefonts/noto-emoji/blob/main/README.md), [npm](https://registry.npmjs.org/@fontsource%2fnoto-emoji)
- OpenMoji даёт шрифт в семи сборках; для веба рекомендует COLRv0: `OpenMoji-color-glyf_colr_0.woff2` — 1 010 172 байта (таблицы COLR/CPAL/glyf подтверждены разбором заголовка). — [OpenMoji font/README](https://github.com/hfg-gmuend/openmoji/blob/master/font/README.md), [файл](https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/font/OpenMoji-color-glyf_colr_0/OpenMoji-color-glyf_colr_0.woff2)
- `mozilla/twemoji-colr` («Twemoji Mozilla», COLR/CPAL): 408 звёзд, последний релиз v0.7.0 от 28.10.2022; код Apache 2.0, рисунки CC-BY-4.0. — [API](https://api.github.com/repos/mozilla/twemoji-colr), [LICENSE.md](https://github.com/mozilla/twemoji-colr/blob/master/LICENSE.md)
- `13rac1/twemoji-color-font` (SVG-in-OpenType): 1 940 звёзд, релиз v15.1.0 от 04.10.2024 (Unicode 15.1); README прямо отсылает к вопросу «Why doesn't it work on Chrome?»; рисунки CC-BY-4.0, код MIT. — [API](https://api.github.com/repos/13rac1/twemoji-color-font), [README](https://github.com/13rac1/twemoji-color-font), [LICENSE.md](https://github.com/13rac1/twemoji-color-font/blob/main/LICENSE.md)
- Полифил флагов TalkJS: npm `country-flag-emoji-polyfill` 0.1.10 (02.08.2026, MIT), 233 звезды; шрифт «Twemoji Country Flags» — подмножество Twemoji Mozilla, 77–78 КБ, грузится только там, где флагов нет. — [npm](https://registry.npmjs.org/country-flag-emoji-polyfill), [README](https://github.com/talkjs/country-flag-emoji-polyfill)

### Inferences
- Самостоятельный хостинг Noto Color Emoji для обоих браузеров означает держать в кэше PWA и COLRv1-набор (≈2,1 МБ), и SVG-набор (≈4 МБ) — либо один цельный файл 5,8 МБ. Для личного приложения с офлайном это много ради десятков значков.
- Шрифт-emoji выгоден, только если emoji встречаются в произвольном пользовательском тексте (заметки, названия). Для фиксированных значков категорий выгоднее SVG.
- Если всё же нужен единый шрифт: OpenMoji COLRv0 (1 МБ, один файл, работает и в Safari, и в Chrome) — технически самый простой вариант, но стиль у него контурный и лицензия CC BY-SA.
- Если в приложении появятся флаги стран (валюты), на Windows они без полифила покажутся буквами; это вопрос предпросмотра, на iPhone флаги есть.

### Gaps
- Отрисовка файлов fontsource в Chrome и Safari вживую не тестировалась — вывод сделан по таблицам в заголовке и по тому, что Chromium не поддерживает OT-SVG.
- Версия таблицы COLR (v0 или v1) внутри сжатых WOFF2 Google Fonts напрямую не прочитана; на v1 указывают размер и статья Chrome.

---

## 7. Замена символов картинками (twemoji.parse) против нескольких встроенных SVG

### Takeaway
Библиотека-заменитель нужна, когда emoji приходят в произвольном тексте. Для фиксированного набора значков категорий проще и надёжнее вставить нужные SVG прямо в HTML: никакого CDN, полный офлайн, одинаковый вид везде.

### Cited Findings
- `twemoji.parse()` заменяет символы на `<img class="emoji" draggable="false" alt="…">`; по умолчанию адрес картинок — jsDelivr (`https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/2764.png`), формат по умолчанию PNG 72x72; параметры `base`, `ext`, `size`, `className` меняются; с `folder: 'svg', ext: '.svg'` получаются адреса `…/assets/svg/2764.svg`. — [jdecked/twemoji README](https://github.com/jdecked/twemoji/blob/main/README.md)
- npm `@twemoji/api` 17.0.3 содержит только скрипт (197 789 байт, 11 файлов) — картинок в пакете нет. — [npm](https://registry.npmjs.org/@twemoji%2fapi)
- У оригинальной библиотеки Twitter CDN по умолчанию не работает: "MaxCDN is shut down right now, so in the meanwhile use a different CDN or download the assets." — [twitter/twemoji README](https://github.com/twitter/twemoji/blob/master/README.md)
- Размеры 18 нужных файлов суммарно (локальный замер): Twemoji SVG ≈16,7 КБ; Fluent Flat SVG ≈30,8 КБ; OpenMoji SVG ≈51,4 КБ; Noto 2D SVG ≈178,6 КБ; Noto 3D PNG 128 px ≈266,4 КБ; Fluent Color SVG ≈319,8 КБ. Источники файлов — в таблице раздела 10, например [Twemoji 1f6d2.svg](https://raw.githubusercontent.com/jdecked/twemoji/main/assets/svg/1f6d2.svg).
- Набор `iconify` (6 394 звезды, MIT) перепаковывает эти же наборы в JSON: `@iconify-json/twemoji` 1.2.5 (CC-BY-4.0), `@iconify-json/noto` 1.2.10 (Apache-2.0), `@iconify-json/openmoji` 1.2.31 (CC-BY-SA-4.0), `@iconify-json/fluent-emoji-flat` 1.2.6 (MIT), `@iconify-json/fluent-emoji` 1.2.7 (MIT). — [API](https://api.github.com/repos/iconify/iconify), [npm](https://registry.npmjs.org/@iconify-json%2ftwemoji)

### Inferences
- Плюсы замены картинками: одинаковый вид на всех ОС; минусы: выравнивание по базовой линии надо задавать вручную (обычно `height:1em; vertical-align:-0.1em`), каждая картинка — отдельный запрос (если не встроена), по умолчанию нужен интернет и CDN, в `alt` остаётся символ.
- Встроенный SVG (inline или `<symbol>` + `<use>`) попадает в сам `index.html`, значит автоматически покрыт офлайн-кэшем и не требует сети. Цена — рост файла: от ~17 КБ (Twemoji) до ~320 КБ (Fluent Color) на 18 значков.
- Отдельные файлы `.svg` рядом с `index.html` тоже годятся, но их нужно добавить в список кэша service worker, иначе офлайн их не будет.
- SVG из Fluent Color и часть Noto содержат градиенты с `id`; при вставке нескольких таких SVG в одну страницу `id` могут совпасть — их нужно сделать уникальными (предположение по устройству формата, на файлах не проверялось).

### Gaps
- Конфликты `id` градиентов при инлайне нескольких Fluent/Noto SVG на практике не проверялись.

---

## 8. Открытые наборы: Twemoji, OpenMoji, Noto Emoji, Fluent Emoji

### Takeaway
Все четыре можно легально положить в приложение. Самые живые — OpenMoji, Noto и форк Twemoji от jdecked; оригинальный `twitter/twemoji` фактически застрял на Emoji 14.0; Fluent не получал новых рисунков с января 2025. Лицензии различаются по обязанностям: Fluent (MIT) и Noto (Apache/OFL) — самые лёгкие, Twemoji требует указать авторство, OpenMoji — авторство плюс «share-alike».

### Cited Findings

**Twemoji — оригинал `twitter/twemoji`**
- 17 814 звёзд, 1 891 форк, не в архиве; последний релиз v14.0.2 от 31.03.2022; npm `twemoji` 14.0.2 от 31.03.2022. — [API](https://api.github.com/repos/twitter/twemoji), [releases/latest](https://api.github.com/repos/twitter/twemoji/releases/latest), [npm](https://registry.npmjs.org/twemoji)
- В ветке master между 10.01.2023 и 09.01.2026 коммитов нет; в 2026 г. — несколько: «Change Iran's flag to the original Sun & Lion (#1440)», «v14.0.3 (no lock files changes) (#1445)», «update emojis (#1454)» (09–10.01.2026) и правка ссылки в README (07.07.2026). README по-прежнему заявляет «Twemoji v14.0 … Emoji 14.0». — [API: commits](https://api.github.com/repos/twitter/twemoji/commits?per_page=8), [README](https://github.com/twitter/twemoji/blob/master/README.md)

**Twemoji — форк сообщества `jdecked/twemoji`**
- 1 918 звёзд, 120 форков; релиз v17.0.3 от 01.06.2026; README: «Twemoji v17.0 adheres to the Unicode 17.0 spec and supports the Emoji 17.0 spec». — [API](https://api.github.com/repos/jdecked/twemoji), [releases/latest](https://api.github.com/repos/jdecked/twemoji/releases/latest), [README](https://github.com/jdecked/twemoji/blob/main/README.md)
- npm `@twemoji/api` 17.0.3 (01.06.2026), лицензия «MIT AND CC-BY-4.0». Пакет `@twemoji/svg` — НЕ от jdecked: его репозиторий `boywithkeyboard/twemoji_svg`, версия 15.0.0 от 10.12.2023 (8,1 МБ, 3 723 файла). — [npm @twemoji/api](https://registry.npmjs.org/@twemoji%2fapi), [npm @twemoji/svg](https://registry.npmjs.org/@twemoji%2fsvg)
- Лицензии: «Code licensed under the MIT License», «Graphics licensed under CC-BY 4.0». — [README](https://github.com/jdecked/twemoji/blob/main/README.md), [LICENSE-GRAPHICS](https://github.com/jdecked/twemoji/blob/main/LICENSE-GRAPHICS)
- Требование об авторстве, дословно: "…will accept a mention in a project README or an 'About' section or footer on a website. In mobile applications, a common place would be in the Settings/About section… We would consider a mention in the HTML/JS source sufficient also." — [README, раздел Attribution Requirements](https://github.com/jdecked/twemoji/blob/main/README.md)
- Объём (тег 17.0.3): `assets/svg` — 4 009 файлов, 10,1 МБ, в среднем 2,5 КБ; `assets/72x72` — 4 009 PNG, 4,2 МБ. — [jsDelivr data API](https://data.jsdelivr.com/v1/packages/gh/jdecked/twemoji@17.0.3?structure=flat)

**OpenMoji — `hfg-gmuend/openmoji`**
- 4 585 звёзд, 275 форков; релиз 17.0.0 «OpenMoji 17.0» от 23.04.2026; последний коммит 04.11.2026; лицензия CC-BY-SA-4.0. — [API](https://api.github.com/repos/hfg-gmuend/openmoji), [releases/latest](https://api.github.com/repos/hfg-gmuend/openmoji/releases/latest)
- npm `openmoji` 17.0.0 (23.04.2026): 43,4 МБ, 11 539 файлов; `color/svg` — 4 495 файлов, 14,2 МБ, в среднем 3,2 КБ; `black/svg` (контурные, чёрные) — 4 495 файлов, 8,6 МБ. — [npm](https://registry.npmjs.org/openmoji), [jsDelivr data API](https://data.jsdelivr.com/v1/packages/npm/openmoji@17.0.0?structure=flat)
- Форматы: SVG цветные и чёрные, PNG 618x618 и 72x72 (в релизах), шрифты OpenMoji-Color и OpenMoji-Black («experimental»). — [README](https://github.com/hfg-gmuend/openmoji/blob/master/README.md)
- Авторство, предложенный текст: "All emojis designed by OpenMoji – the open-source emoji and icon project. License: CC BY-SA 4.0". — [README](https://github.com/hfg-gmuend/openmoji/blob/master/README.md)
- Сайт и документация: [openmoji.org](https://openmoji.org/).

**Noto Emoji — `googlefonts/noto-emoji`**
- 5 126 звёзд, 575 форков; релиз `v2026-09-24-unicode18_0` «Unicode 18.0» от 24.09.2026; последний коммит 26.10.2026. — [API](https://api.github.com/repos/googlefonts/noto-emoji), [releases/latest](https://api.github.com/repos/googlefonts/noto-emoji/releases/latest)
- Структура репозитория изменилась: теперь есть папки `2D/` (`fonts`, `png`, `svg`) и `3D/` (`fonts`, `png`). Старый путь `svg/emoji_u1f6d2.svg` в ветке main отдаёт 404; рабочий — `2D/svg/emoji_u1f6d2.svg`. На старых тегах (v2.047, v2.048) прежний путь ещё жив. — [API: дерево](https://api.github.com/repos/googlefonts/noto-emoji/git/trees/main), [пример файла](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/2D/svg/emoji_u1f6d2.svg)
- `2D/svg`: 3 750 SVG + LICENSE, 41,7 МБ, в среднем 11,1 КБ. — [API: дерево](https://api.github.com/repos/googlefonts/noto-emoji/git/trees/main)
- Лицензии: шрифты — SIL OFL 1.1; «Tools and most image resources are under the Apache license, version 2.0»; флаги в `third_party/region-flags` — общественное достояние. В папке `2D/svg` лежит собственный файл LICENSE с текстом Apache 2.0. — [README](https://github.com/googlefonts/noto-emoji/blob/main/README.md), [2D/svg/LICENSE](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/2D/svg/LICENSE)
- Флаги в виде SVG с «волной» отсутствуют: "We do not have SVG versions that reflect these transforms." — [README](https://github.com/googlefonts/noto-emoji/blob/main/README.md)
- Noto 3D в репозитории: PNG по пути `3D/png/{32,72,128,512}/emoji_u{код}.png` (проверено: `…/128/emoji_u1f6d2.png` — 17 296 байт; `…/512/emoji_u1f4b0.png` — 320 730 байт; `…/72/emoji_u1f4b0.png` — 7 087 байт); SVG-версии 3D нет (404); шрифты `3D/fonts/Noto-3D-*.ttf` лежат через Git LFS, `Noto-3D-128.ttf` — 147 882 884 байта. — [пример PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/3D/png/128/emoji_u1f6d2.png), [указатель LFS](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/3D/fonts/Noto-3D-128.ttf)
- Метаданные (шорткоды, порядок): `googlefonts/emoji-metadata`, 94 звезды, Apache-2.0, push 25.09.2026. — [API](https://api.github.com/repos/googlefonts/emoji-metadata)

**Fluent Emoji — `microsoft/fluentui-emoji`**
- 10 209 звёзд, 570 форков, MIT, релизов нет (404). Последний коммит 24.08.2026 — служебный («Pin GitHub Actions…»); последний коммит, менявший рисунки, — 30.01.2025; до него — слияние «emoji_15_1» 02.10.2024. — [API](https://api.github.com/repos/microsoft/fluentui-emoji), [commits по assets](https://api.github.com/repos/microsoft/fluentui-emoji/commits?path=assets&per_page=2), [LICENSE](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE)
- Состав (дерево ветки main): 1 595 папок emoji, 12 637 файлов, 266,6 МБ. Стили: `Color` — 3 145 SVG, 131,9 МБ, в среднем 41,9 КБ; `Flat` — 3 145 SVG, 17,2 МБ, в среднем 5,5 КБ; `High Contrast` — 1 595 SVG, 6,4 МБ; `3D` — 3 145 PNG, 109,7 МБ, в среднем 34,9 КБ. — [API: дерево](https://api.github.com/repos/microsoft/fluentui-emoji/git/trees/main?recursive=1)
- Именование: `assets/{Название CLDR с заглавной}/{Стиль}/{snake_case}_{color|flat|high_contrast|3d}.{svg|png}`; у emoji с тоном кожи добавляется уровень `Default/`, `Light/`, `Dark/`… и суффикс (`thumbs_up_color_default.svg`); в каждой папке `metadata.json` с полями `glyph`, `unicode` (например `"unicode": "1f6d2"`), `keywords`. — [пример metadata.json](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shopping%20cart/metadata.json)
- npm-пакета от Microsoft нет; есть сторонние: `fluentui-emoji` 1.3.0 (репозиторий `MKAbuMattar/fluentui-emoji`, 119,8 МБ), `@lobehub/fluent-emoji` 5.0.1. — [npm](https://registry.npmjs.org/fluentui-emoji), [npm](https://registry.npmjs.org/@lobehub%2ffluent-emoji)

**Обязательства по лицензиям — дословно**
- CC BY (Twemoji) и CC BY-SA (OpenMoji), условие Attribution: "You must give appropriate credit, provide a link to the license, and indicate if changes were made." — [CC BY-SA 4.0 deed](https://creativecommons.org/licenses/by-sa/4.0/deed.en)
- CC BY-SA (OpenMoji), условие ShareAlike: "If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original." — [CC BY-SA 4.0 deed](https://creativecommons.org/licenses/by-sa/4.0/deed.en)
- Разъяснение Creative Commons о сборниках: "CC licenses do not require the collection or the compilation itself to be made available under an SA license"; условие «only applies if a work is modified and if the work is shared publicly». — [Creative Commons FAQ](https://creativecommons.org/faq/)
- Там же: "If the combination does not create an adaptation, then you may combine any CC-licensed content so long as you provide attribution…"; "When remixing ShareAlike content, your adapter's license must be the same license as the license on the material you are adapting." — [Creative Commons FAQ](https://creativecommons.org/faq/)
- MIT (Fluent), единственное условие: "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software." (уведомление: «Copyright (c) Microsoft Corporation.»). — [fluentui-emoji LICENSE](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE)
- Apache 2.0 (SVG Noto): в папке лежит уведомление «Copyright 2013 Google, Inc. All Rights Reserved. Licensed under the Apache License, Version 2.0». — [noto-emoji 2D/svg/LICENSE](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/2D/svg/LICENSE)

**Сводная таблица**

| Набор | Репозиторий | Звёзды | Свежесть | Покрытие | Лицензия рисунков | Обязанности | Один SVG | Весь набор SVG |
|---|---|---|---|---|---|---|---|---|
| Twemoji (форк) | [jdecked/twemoji](https://github.com/jdecked/twemoji) | 1 918 | релиз 01.06.2026 | Emoji 17.0 | CC-BY 4.0 | указать авторство (достаточно в «О приложении» или в исходнике) | ≈2,5 КБ | 10,1 МБ |
| Twemoji (оригинал) | [twitter/twemoji](https://github.com/twitter/twemoji) | 17 814 | релиз 2022; редкие коммиты в 2026 | Emoji 14.0 (по README) | CC-BY 4.0 | то же | — | — |
| OpenMoji | [hfg-gmuend/openmoji](https://github.com/hfg-gmuend/openmoji) | 4 585 | релиз 23.04.2026, коммит 04.11.2026 | 17.0 (по названию релиза) | CC BY-SA 4.0 | авторство + share-alike | ≈3,2 КБ | 14,2 МБ |
| Noto Emoji | [googlefonts/noto-emoji](https://github.com/googlefonts/noto-emoji) | 5 126 | релиз 24.09.2026 | Unicode 18.0 | Apache 2.0 (картинки), OFL 1.1 (шрифты) | сохранить текст лицензии | ≈11 КБ | 41,7 МБ |
| Fluent Emoji | [microsoft/fluentui-emoji](https://github.com/microsoft/fluentui-emoji) | 10 209 | рисунки не менялись с 30.01.2025 | до Emoji 15.1 (вывод по коммитам) | MIT | сохранить уведомление об авторском праве | Color ≈42 КБ, Flat ≈5,5 КБ | 131,9 МБ / 17,2 МБ |

Источники цифр таблицы — пункты выше ([API GitHub](https://api.github.com/repos/jdecked/twemoji), [jsDelivr data API](https://data.jsdelivr.com/v1/packages/gh/jdecked/twemoji@17.0.3?structure=flat)).

### Inferences
- Локальное использование без CDN одинаково для всех четырёх: взять нужные `.svg` из репозитория, положить в проект (или вставить содержимое в HTML), подключать через `<img src="…svg">` либо inline. Все четыре набора — статические файлы, с офлайн-PWA совместимы полностью.
- CC BY-SA у OpenMoji: если значки изменять (перекрашивать, дорисовывать), изменённые версии надо распространять под той же лицензией и это надо указать. Использование неизменённых значков с указанием авторства — обычный случай; по разъяснению Creative Commons, сборник с неизменённой SA-работой сам под SA переходить не обязан, то есть код приложения лицензия не «заражает». Это пересказ FAQ, а не юридическое заключение. Для личного приложения это всё равно самая «обязывающая» лицензия из четырёх: перекрашенные под тёмную тему значки — уже изменённая работа.
- Минимальный набор действий по каждой лицензии (вывод из цитат): Twemoji — строка «Emoji graphics: Twemoji, CC-BY 4.0» со ссылкой, в «О приложении» или комментарием в HTML; OpenMoji — строка авторства со ссылкой на лицензию плюс пометка, если значки изменены; Fluent — сохранить текст MIT с «Copyright (c) Microsoft Corporation» (файлом рядом или комментарием); Noto — сохранить уведомление Apache 2.0 и ссылку на лицензию.
- Для Twemoji достаточно одной строки в разделе «О приложении» или комментария в HTML — это прямо разрешено проектом.
- Fluent: репозиторий отстаёт от Windows (Microsoft, по Emojipedia, выкатил Emoji 17.0 в августе 2026, а в GitHub новых рисунков нет с января 2025). Для 18 старых emoji это не мешает.
- Для ссылок на Noto нельзя полагаться на ветку `main`: путь уже менялся. Надёжнее скопировать файлы в проект один раз.

### Gaps
- Точная версия Emoji, покрытая OpenMoji 17.0 и Fluent, по первичному документу не подтверждена (взято из названия релиза и из истории коммитов).
- Лицензия именно PNG из `3D/png` у Noto: отдельного файла LICENSE в папке нет (404); действует только общая фраза README про Apache 2.0 для «most image resources» — формально не уточнено.
- Корневой файл `LICENSE` в noto-emoji сейчас содержит текст OFL, хотя README ссылается на него как на Apache 2.0 — расхождение в самом репозитории; для SVG опираться на `2D/svg/LICENSE`.
- Размер PNG-наборов OpenMoji и шрифтов в релизе не измерялся.

---

## 9. Прочие наборы и анимированные emoji

### Takeaway
Из «прочих» безопасных и живых вариантов нет: JoyPixels платный для реального использования, Tossface с нестандартной лицензией, остальные заброшены. Анимированные наборы есть (Google — CC BY 4.0, Microsoft — MIT), но они тяжёлые и для значков категорий не нужны.

### Cited Findings
- JoyPixels (`joypixels/emoji-toolkit`): 472 звезды, релиз 11.0.0 от 03.08.2026. Рисунки — по собственной «free license» JoyPixels со ссылкой на платные планы («to purchase a less restrictive license»); код — MIT. — [API](https://api.github.com/repos/joypixels/emoji-toolkit), [LICENSE.md](https://github.com/joypixels/emoji-toolkit/blob/master/LICENSE.md)
- EmojiTwo (`EmojiTwo/emojitwo`, продолжение EmojiOne 2.x): 362 звезды, последний коммит 06.03.2025; рисунки CC-BY 4.0, прочее MIT. — [API](https://api.github.com/repos/EmojiTwo/emojitwo), [LICENSE.md](https://github.com/EmojiTwo/emojitwo/blob/master/LICENSE.md)
- `adobe-fonts/emojione-color` — OT-SVG шрифт EmojiOne 2.3, 163 звезды, последний push 27.07.2022. — [GitHub search API](https://api.github.com/search/repositories?q=topic:emoji+svg+in:name,description,topics&sort=stars&order=desc)
- `mozilla/fxemoji`: 334 звезды, последний коммит 29.03.2019 (флага «archived» нет); дизайн CC BY 4.0, код Apache 2.0. — [API](https://api.github.com/repos/mozilla/fxemoji), [LICENSE.md](https://github.com/mozilla/fxemoji/blob/gh-pages/LICENSE.md)
- `toss/tossface`: 380 звёзд, последний коммит 12.01.2024; лицензия своя (на корейском): свободное использование и распространение разрешены, если не продавать сам набор, не использовать «в ненадлежащих целях» и не делать «неразрешённые изменённые версии»; распространять оригинал можно только вместе с уведомлением об авторских правах и полным текстом лицензии. — [API](https://api.github.com/repos/toss/tossface), [LICENSE](https://github.com/toss/tossface/blob/main/LICENSE)
- `C1710/blobmoji` («блобы» Google): 554 звезды, в архиве, последний push 06.03.2024, Apache-2.0. — [API](https://api.github.com/repos/C1710/blobmoji)
- `svgmoji/svgmoji` (спрайты из открытых наборов): 140 звёзд; npm `@svgmoji/noto` 3.2.0 — от 15.06.2021. — [GitHub search API](https://api.github.com/search/repositories?q=topic:emoji+svg+in:name,description,topics&sort=stars&order=desc), [npm](https://registry.npmjs.org/@svgmoji%2fnoto)
- Noto Animated Emoji (Google): по сообщению блога Google, рисунки доступны под CC BY 4.0; форматы — Lottie, WebP, GIF. Рабочий шаблон адреса (проверен): `https://fonts.gstatic.com/s/e/notoemoji/latest/{код}/lottie.json` и `…/512.gif` — для 1f600 ответ 200 (37 328 байт JSON; GIF 836 130 байт), для 1f4b8 — 200; для 1f4b0 — 404 (анимированы не все emoji). — [Google Developers Blog](https://developers.googleblog.com/en/updates-to-emoji-new-characters-new-animation-new-color-customization-and-more/), [сайт набора](https://googlefonts.github.io/noto-emoji-animation/), [пример](https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/lottie.json)
- Fluent Emoji Animated (`microsoft/fluentui-emoji-animated`): 171 звезда, MIT, последний push 17.10.2024; анимированные PNG 256x256, репозиторий «approximately ~5GB» через Git LFS. — [API](https://api.github.com/repos/microsoft/fluentui-emoji-animated), [README](https://github.com/microsoft/fluentui-emoji-animated/blob/main/README.md)

### Inferences
- JoyPixels: без покупки лицензии в приложение не класть. Вторичные источники описывают бесплатную лицензию как «личное/учебное использование с указанием авторства», но первичный текст условий не прочитан.
- Tossface: запрет на «неразрешённые изменения» делает набор непригодным, если значки придётся перекрашивать под тёмную тему.
- Анимированные наборы: один Lottie-файл весит 37–97 КБ и требует плеера; GIF — сотни килобайт. Для учёта расходов неоправданно.

### Gaps
- Лицензия анимированных emoji Telegram — открытой лицензии не найдено; НЕ ПРОВЕРЕНО, использовать нельзя, пока не доказано обратное.
- Полный текст JoyPixels Free License (`https://app.joypixels.com/terms/free`) не прочитан.
- Лицензия Noto Animated на самом сайте набора не прочитана (страница отдаёт только заголовок); формулировка взята из блога Google через поисковую выдачу.

---

## 10. Точные имена файлов для «финансовых» emoji

### Takeaway
Все 18 emoji есть во всех четырёх наборах; каждый из 72 адресов проверен запросом и вернул `image/svg+xml` с тегом `<svg`. Правила имён: Twemoji и Noto — нижний регистр, без FE0F; OpenMoji — верхний регистр, без FE0F; Fluent — папка по английскому названию.

### Cited Findings

Шаблоны адресов (все проверены, ответ 200):
- Twemoji: `https://raw.githubusercontent.com/jdecked/twemoji/main/assets/svg/{код}.svg`; jsDelivr с фиксацией версии: `https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/svg/{код}.svg`; unpkg — нет официального пакета с картинками. — [пример](https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/svg/1f6d2.svg)
- OpenMoji: `https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg/{КОД}.svg` (чёрный контур — `black/svg/`); unpkg: `https://unpkg.com/openmoji@17.0.0/color/svg/{КОД}.svg`; jsDelivr: `https://cdn.jsdelivr.net/npm/openmoji@17.0.0/color/svg/{КОД}.svg`. — [пример](https://unpkg.com/openmoji@17.0.0/color/svg/1F6D2.svg)
- Noto: `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/2D/svg/emoji_u{код}.svg`; jsDelivr: `https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/2D/svg/emoji_u{код}.svg`. — [пример](https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/2D/svg/emoji_u1f6d2.svg)
- Fluent: `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/{Папка}/Color/{имя}_color.svg` (пробел в адресе — `%20`); плоский вариант — `/Flat/{имя}_flat.svg`; контрастный — `/High%20Contrast/{имя}_high_contrast.svg`; объёмный PNG — `/3D/{имя}_3d.png`; jsDelivr: `https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/…`. — [пример](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shopping%20cart/Color/shopping_cart_color.svg)

Таблица файлов (в скобках — размер, ≈байт):

| Emoji | Код | Twemoji `assets/svg/` | OpenMoji `color/svg/` | Noto `2D/svg/` | Fluent `assets/…/Color/` |
|---|---|---|---|---|---|
| 🛍️ shopping bags | U+1F6CD | `1f6cd.svg` (476) | `1F6CD.svg` (1 555) | `emoji_u1f6cd.svg` (3 263) | `Shopping bags/Color/shopping_bags_color.svg` (18 260) |
| 🛒 shopping cart | U+1F6D2 | `1f6d2.svg` (1 305) | `1F6D2.svg` (8 300) | `emoji_u1f6d2.svg` (4 652) | `Shopping cart/Color/shopping_cart_color.svg` (28 927) |
| 🚌 bus | U+1F68C | `1f68c.svg` (1 072) | `1F68C.svg` (3 429) | `emoji_u1f68c.svg` (4 896) | `Bus/Color/bus_color.svg` (24 428) |
| 🚕 taxi | U+1F695 | `1f695.svg` (999) | `1F695.svg` (2 801) | `emoji_u1f695.svg` (3 718) | `Taxi/Color/taxi_color.svg` (32 095) |
| ☕ hot beverage | U+2615 | `2615.svg` (1 294) | `2615.svg` (2 540) | `emoji_u2615.svg` (3 662) | `Hot beverage/Color/hot_beverage_color.svg` (10 527) |
| 🍽️ fork and knife with plate | U+1F37D | `1f37d.svg` (938) | `1F37D.svg` (2 468) | `emoji_u1f37d.svg` (56 539) | `Fork and knife with plate/Color/fork_and_knife_with_plate_color.svg` (23 879) |
| 🏠 house | U+1F3E0 | `1f3e0.svg` (935) | `1F3E0.svg` (1 759) | `emoji_u1f3e0.svg` (3 956) | `House/Color/house_color.svg` (19 042) |
| 💊 pill | U+1F48A | `1f48a.svg` (411) | `1F48A.svg` (2 693) | `emoji_u1f48a.svg` (1 117) | `Pill/Color/pill_color.svg` (5 305) |
| 🎮 video game | U+1F3AE | `1f3ae.svg` (1 382) | `1F3AE.svg` (2 765) | `emoji_u1f3ae.svg` (2 494) | `Video game/Color/video_game_color.svg` (15 646) |
| 🎓 graduation cap | U+1F393 | `1f393.svg` (958) | `1F393.svg` (1 155) | `emoji_u1f393.svg` (3 886) | `Graduation cap/Color/graduation_cap_color.svg` (12 958) |
| ✈️ airplane | U+2708 | `2708.svg` (909) | `2708.svg` (1 883) | `emoji_u2708.svg` (5 963) | `Airplane/Color/airplane_color.svg` (16 255) |
| 🔁 repeat | U+1F501 | `1f501.svg` (499) | `1F501.svg` (1 364) | `emoji_u1f501.svg` (44 677) | `Repeat button/Color/repeat_button_color.svg` (7 498) |
| 💰 money bag | U+1F4B0 | `1f4b0.svg` (1 314) | `1F4B0.svg` (5 923) | `emoji_u1f4b0.svg` (22 985) | `Money bag/Color/money_bag_color.svg` (12 574) |
| 💳 credit card | U+1F4B3 | `1f4b3.svg` (1 017) | `1F4B3.svg` (1 754) | `emoji_u1f4b3.svg` (1 584) | `Credit card/Color/credit_card_color.svg` (8 961) |
| 📈 chart increasing | U+1F4C8 | `1f4c8.svg` (993) | `1F4C8.svg` (3 107) | `emoji_u1f4c8.svg` (1 974) | `Chart increasing/Color/chart_increasing_color.svg` (26 336) |
| 🏦 bank | U+1F3E6 | `1f3e6.svg` (878) | `1F3E6.svg` (3 878) | `emoji_u1f3e6.svg` (3 944) | `Bank/Color/bank_color.svg` (37 530) |
| 💼 briefcase | U+1F4BC | `1f4bc.svg` (651) | `1F4BC.svg` (1 849) | `emoji_u1f4bc.svg` (5 924) | `Briefcase/Color/briefcase_color.svg` (11 477) |
| 🧾 receipt | U+1F9FE | `1f9fe.svg` (704) | `1F9FE.svg` (2 212) | `emoji_u1f9fe.svg` (3 403) | `Receipt/Color/receipt_color.svg` (8 058) |
| **Итого 18 файлов** | | **≈16,7 КБ** | **≈51,4 КБ** | **≈178,6 КБ** | **≈319,8 КБ** |

Источники строк таблицы — прямые запросы к адресам по шаблонам выше, например [Twemoji 2615.svg](https://raw.githubusercontent.com/jdecked/twemoji/main/assets/svg/2615.svg), [OpenMoji 1F4B0.svg](https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg/1F4B0.svg), [Noto emoji_u1f9fe.svg](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/2D/svg/emoji_u1f9fe.svg), [Fluent receipt_color.svg](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Receipt/Color/receipt_color.svg).

Дополнительно проверено:
- Fluent Flat — все 18 адресов `assets/{Папка}/Flat/{имя}_flat.svg` вернули 200 и `image/svg+xml`; размеры (≈байт): shopping_bags 1 424, shopping_cart 1 994, bus 1 866, taxi 1 964, hot_beverage 1 702, fork_and_knife_with_plate 1 507, house 1 591, pill 601, video_game 2 874, graduation_cap 1 653, airplane 1 862, repeat_button 1 362, money_bag 1 887, credit_card 934, chart_increasing 887, bank 3 575, briefcase 722, receipt 2 426; итого ≈30,8 КБ. — [пример](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shopping%20cart/Flat/shopping_cart_flat.svg)
- Noto 3D PNG 128 px — все 18 адресов `3D/png/128/emoji_u{код}.png` вернули 200 и `image/png`; размеры от 8 100 (1f4b3) до 18 408 байт (2615); итого 266 445 байт. — [пример](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/3D/png/128/emoji_u1f4b3.png)
- Fluent High Contrast: `Shopping cart/High Contrast/shopping_cart_high_contrast.svg` — 1 661. — [пример](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shopping%20cart/High%20Contrast/shopping_cart_high_contrast.svg)
- Fluent 3D: `Shopping cart/3D/shopping_cart_3d.png` — 29 839 байт, `image/png`. — [пример](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shopping%20cart/3D/shopping_cart_3d.png)
- OpenMoji чёрный контур: `black/svg/1F6D2.svg` — 4 452. — [пример](https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/black/svg/1F6D2.svg)
- Все семь вариантов для 🛒 и 💰 (Twemoji, OpenMoji, Noto 2D, Noto 3D PNG, Fluent Color, Fluent Flat, Fluent 3D PNG) загрузились и отрисовались в Chrome 157 на тестовой странице (снимок `emoji-test.png`). — [Noto 3D PNG](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/3D/png/512/emoji_u1f6d2.png)

### Inferences
- Имя папки Fluent нельзя вывести из кода символа автоматически: 🔁 — это «Repeat button», 📈 — «Chart increasing», ☕ — «Hot beverage». Надёжный способ — поле `unicode` в `metadata.json` каждой папки.
- У Noto три файла заметно тяжелее остальных (🍽 56,5 КБ, 🔁 44,7 КБ, 💰 23 КБ) — вероятно, сложные градиенты/контуры; перед вставкой их стоит прогнать через оптимизатор SVG.
- Суффикс FE0F в именах не нужен ни в одном наборе для этих 18 emoji, хотя в тексте HTML для 🛍, 🍽 и ✈ он нужен (раздел 5).

### Gaps
- Fluent High Contrast и Fluent 3D PNG проверены только для 🛒 (и 3D — ещё для 💰); остальные адреса построены по тому же правилу, но запросом не подтверждены.
- Noto 3D PNG в размерах 32, 72 и 512 px проверен выборочно (🛒, 💰), полностью — только 128 px.
- Содержимое SVG (корректность рисунка, наличие `viewBox`, внешних ссылок) глазами проверено только для 🛒 и 💰 на снимке; остальные 16 проверены лишь на ответ 200 и наличие тега `<svg`.

---

## 11. Что легально и ближе всего к Apple; что одинаково на Windows и iPhone

### Takeaway
(Мнение, с опорой на снимок сравнения.) Ближе всего к «глянцевому объёмному» стилю Apple из легальных — Fluent Color/3D (MIT) и новый Noto 3D; из плоских — Noto 2D. Одинаково на Windows и iPhone выглядит только то, что приложение привозит с собой (SVG, PNG или веб-шрифт) — системные emoji одинаковыми не бывают.

### Cited Findings
- Локальное сравнение на одной странице (Chrome 157, 96 px, снимок `emoji-test.png`): Twemoji — плоские заливки без теней и градиентов; OpenMoji — чёрный контур с плоской заливкой, «иконочный» вид; Noto 2D — мягкие градиенты, без выраженного объёма; Noto 3D (PNG) — объём, блики, металлический блеск; Fluent Color (SVG) — объём и градиенты, мягкие «пластилиновые» формы; Fluent Flat — те же формы без градиентов; Fluent 3D (PNG) — как Color, но с более плотными тенями. Файлы для сравнения: [Twemoji](https://raw.githubusercontent.com/jdecked/twemoji/main/assets/svg/1f4b0.svg), [OpenMoji](https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg/1F4B0.svg), [Noto 2D](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/2D/svg/emoji_u1f4b0.svg), [Noto 3D](https://raw.githubusercontent.com/googlefonts/noto-emoji/main/3D/png/512/emoji_u1f4b0.png), [Fluent Color](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Money%20bag/Color/money_bag_color.svg), [Fluent Flat](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Money%20bag/Flat/money_bag_flat.svg), [Fluent 3D](https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Money%20bag/3D/money_bag_3d.png).
- Стиль Apple по описанию: насыщенные цвета, плавные переходы, лёгкий глянец, часть рисунков как 3D-рендер. — [Wikipedia: Apple Color Emoji](https://en.wikipedia.org/wiki/Apple_Color_Emoji)
- Emojipedia о Noto 3D: редизайн продолжает сближение с Apple как с ориентиром, многие рисунки стали ближе к версиям Apple. — [Emojipedia](https://blog.emojipedia.org/google-debuts-noto-3d-emoji-overhaul-on-pixel-11/)
- Лицензии кандидатов: Fluent — MIT; Noto — Apache 2.0 (картинки) / OFL 1.1 (шрифты); Twemoji — CC-BY 4.0; OpenMoji — CC BY-SA 4.0. — [Fluent LICENSE](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE), [Noto README](https://github.com/googlefonts/noto-emoji/blob/main/README.md), [Twemoji README](https://github.com/jdecked/twemoji/blob/main/README.md), [OpenMoji README](https://github.com/hfg-gmuend/openmoji/blob/master/README.md)

### Inferences
- Рейтинг «похожести на Apple» среди легальных (мнение): 1) Fluent Color SVG или Fluent 3D PNG — объём и глянец, но формы более «мультяшные»; 2) Noto 3D PNG — объём и пропорции ближе к Apple, но только растр и лицензия PNG не уточнена отдельно; 3) Noto 2D SVG — пропорции и сюжеты ближе всего к Apple, но без объёма; 4) Twemoji — плоско; 5) OpenMoji — совсем другой, контурный язык.
- Цена «похожести»: Fluent Color — самый тяжёлый (≈320 КБ на 18 значков против ≈17 КБ у Twemoji); Noto 3D PNG 128 px — ≈266 КБ и это растр. Fluent Flat — компромисс по размеру (≈31 КБ на 18 значков), но теряет объём, ради которого его брали.
- Варианты, дающие одинаковую картинку на Windows и iPhone: (а) встроенные SVG/PNG из любого открытого набора — самый надёжный; (б) веб-шрифт emoji — работает, но требует двух форматов или 1–6 МБ; (в) системные emoji — одинаковыми не будут никогда, зато на iPhone это настоящие Apple-emoji бесплатно и легально.
- Если цель — именно вид Apple на iPhone, то самый точный и законный способ — ничего не привозить и писать символы Unicode: на iPhone будет Apple Color Emoji. Тогда на Windows в предпросмотре будет Fluent, и это только вопрос удобства разработки, а не того, что видит владелец приложения на телефоне.
- Смешанный вариант: на iPhone — системные emoji, для предпросмотра на Windows — ничего не менять и смириться с отличием. Привозить набор стоит, только если значки должны быть частью фирменного стиля и выглядеть одинаково везде.

### Gaps
- Сравнение с настоящим Apple Color Emoji бок о бок не делалось: рисунки Apple нельзя ни скачивать, ни встраивать, а устройства в контуре проверки нет. Оценка «ближе/дальше» — по описаниям стиля и общему знанию вида Apple-emoji.
- Как выбранные SVG смотрятся на тёмном фоне приложения (контраст, читаемость на 20–28 px) — не проверялось; тест делался на белом фоне при 96 px.
