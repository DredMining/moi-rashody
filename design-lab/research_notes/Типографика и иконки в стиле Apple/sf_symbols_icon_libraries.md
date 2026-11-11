# SF Symbols и открытые наборы SVG-иконок «в стиле SF Symbols» для веб-приложения без сборки (состояние на 11.11.2026)

Все цифры и статусы сняты 2026-11-11. Как проверялось:
- звёзды, признак архива, лицензия репозитория — со страниц репозиториев `https://github.com/{owner}/{repo}` (встроенные в HTML данные `stargazerCount`, `isArchived`, `license.spdxId`). REST API GitHub (`api.github.com/repos/...`) в момент проверки отдавал 403 «rate limit exceeded», поэтому использованы HTML-страницы и atom-ленты;
- дата последнего коммита — лента `https://github.com/{owner}/{repo}/commits/{branch}.atom`; последний релиз — `https://github.com/{owner}/{repo}/releases.atom`;
- версия, дата публикации, размер пакета — `https://registry.npmjs.org/{pkg}`;
- число файлов, размеры файлов, наличие иконки с точным именем — список файлов пакета `https://data.jsdelivr.com/v1/packages/npm/{pkg}@{version}?structure=flat`;
- тексты лицензий — файлы LICENSE из `raw.githubusercontent.com`.

Про цитаты: лицензионные тексты Apple и чужие статьи переданы близким пересказом на русском с точной ссылкой на пункт и страницу; дословно оставлена одна короткая фраза из пункта 2.10 соглашения Apple. Дословный текст читать по ссылкам.

## 1. Что такое SF Symbols: версия, возможности, что можно экспортировать

### Takeaway
SF Symbols — библиотека Apple из «более 7 000» символов под шрифт San Francisco: 9 толщин × 3 масштаба, 4 режима окраски, градиенты, переменный цвет, анимации; приложение работает только на macOS (Sonoma и новее). На WWDC26 (июнь 2026) версия называлась SF Symbols 8 (бета), а на 11.11.2026 кнопка загрузки на сайте Apple ведёт на файл `SF-Symbols-27.dmg` и подписана версией 27.

### Cited Findings
- На странице SF Symbols сказано: библиотека из более чем 7 000 символов; девять толщин и три масштаба; автоматическое выравнивание с текстом; символы можно экспортировать и править в векторных редакторах, чтобы делать собственные символы; локализованные варианты для 20+ письменностей — [developer.apple.com/sf-symbols](https://developer.apple.com/sf-symbols/)
- Требование к системе: macOS Sonoma или новее; приложение распространяется как `.dmg` (то есть только для Mac) — [developer.apple.com/sf-symbols](https://developer.apple.com/sf-symbols/)
- Ссылка загрузки на этой странице ведёт на `https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-27.dmg`; номер версии в тексте страницы не назван; в блоке видео по-прежнему стоят сессии «What's new in SF Symbols 7» (WWDC25) и «What's new in SF Symbols 6» (WWDC24) — [developer.apple.com/sf-symbols](https://developer.apple.com/sf-symbols/)
- На странице Apple Design Resources кнопка загрузки подписана версией «SF Symbols 27», пометки «beta» нет — [developer.apple.com/design/resources](https://developer.apple.com/design/resources/)
- В путеводителе WWDC26 по дизайну раздел озаглавлен «SF Symbols 8» и описывает ту же библиотеку из более чем 7 000 символов — [developer.apple.com/wwdc26/guides/design](https://developer.apple.com/wwdc26/guides/design/)
- Заголовки ответа сервера Apple (запрос HEAD, без скачивания): `SF-Symbols-27.dmg` — Last-Modified 04.11.2026, 445 151 232 байта; `SF-Symbols-8.dmg` — Last-Modified 05.08.2026, 443 397 894 байта; `SF-Symbols-7.dmg` — Last-Modified 10.02.2026, 485 033 044 байта — [devimages-cdn.apple.com/.../SF-Symbols-27.dmg](https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-27.dmg), [.../SF-Symbols-8.dmg](https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-8.dmg), [.../SF-Symbols-7.dmg](https://devimages-cdn.apple.com/design/resources/download/SF-Symbols-7.dmg)
- Сторонняя заметка от 15.06.2026: Apple выпустила бета-версию SF Symbols 8 вместе с Icon Composer 2; новые символы привязаны к iOS 27 / iPadOS 27 / macOS 27 / watchOS 27 / tvOS 27 / visionOS 27; среди новшеств — «Enhanced Search» (поиск по смыслу) — [iphonesoft.fr](https://iphonesoft.fr/2026/06/15/apple-sf-symbols-8-icon-composer-2-developpeurs)
- Новое на текущей странице Apple: Enhanced Search (семантический поиск); новые символы для систем версии 27; анимации Draw On / Draw Off с тремя вариантами воспроизведения (Whole Symbol, By Layer, Individually); инструменты аннотаций для собственных символов; Variable Rendering = Variable Color + Variable Draw; анимации Bounce, Wiggle, Rotate, Breathe и Magic Replace; четыре режима окраски плюс необязательный градиент — [developer.apple.com/sf-symbols](https://developer.apple.com/sf-symbols/)
- Режимы окраски по HIG: Monochrome, Hierarchical, Palette, Multicolor; для них контуры символа разложены по слоям (primary / secondary / tertiary) — [HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- Градиенты: начиная с SF Symbols 7, линейный градиент строится из одного исходного цвета и работает во всех режимах окраски — [HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- Толщины и масштабы: девять толщин от ultralight до black, каждая соответствует толщине системного шрифта; три масштаба — small, medium (по умолчанию), large — [HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- Варианты рисунка: outline (основной), fill, slash, enclosed (в круге, квадрате, прямоугольнике). HIG прямо говорит, что вариант fill подходит для панелей вкладок iOS и для обозначения выбранного состояния — [HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- Анимации по HIG: Appear, Disappear, Bounce, Scale, Pulse, Variable color, Replace, Magic Replace, Wiggle, Breathe, Rotate, Draw On / Draw Off (последняя — с SF Symbols 7) — [HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- Журнал изменений страницы HIG заканчивается записью от 28.07.2025 (SF Symbols 7); записи про версию 8 / 27 нет — [HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- Экспорт: шаблон символа выгружается командой File > Export Template в формате SVG, правится в векторном редакторе (Illustrator, Sketch), снова сохраняется в SVG с точностью не ниже 7 знаков и проверяется командой File > Validate Templates — [Apple: Creating custom symbols](https://developer.apple.com/documentation/technologyoverviews/custom-sf-symbols)
- Копирование картинкой: по расшифровке сессии WWDC21 о приложении SF Symbols 3, команда Edit > Copy Image As… копирует символ как PNG или SVG с заданным размером в пунктах и масштабом пикселей; докладчик называет её средством для дизайнерских макетов, а для Xcode советует команду Export Symbol. Команда Edit > Copy Symbol вставляет символ как текст шрифта SF — [WWDC21, session 10288](https://developer.apple.com/videos/play/wwdc2021/10288/)

### Inferences
- Судя по датам файлов и подписи кнопки, бета «SF Symbols 8» вышла в релиз под именем «SF Symbols 27» (номер выровнен с системами версии 27). Прямого объявления Apple о переименовании я не нашёл — это вывод из трёх страниц Apple, которые между собой расходятся.
- Число «более 7 000» относится к текущей версии (8 / 27). Точное число символов Apple на странице не называет.
- Технически дизайнер на Mac может получить SVG любого символа (шаблон). Техническая возможность экспорта не означает права использовать результат в вебе — см. раздел 2.

### Gaps
- Команды Copy Image As… и Export Symbol подтверждены только для SF Symbols 3 (2021); остались ли они под теми же именами в версии 27 — НЕ ПРОВЕРЕНО (нужен Mac с приложением).
- Сессия WWDC26 «What's new in SF Symbols 8» не найдена: на странице SF Symbols стоят только сессии 2025 и 2024 годов — НЕ ПРОВЕРЕНО, существует ли она.
- Точное число символов в версии 27 и число новых символов относительно версии 7 — не найдено.
- Имена символов SF Symbols в разделе 7 сверены со сторонним списком имён (версии 1.0–5.0), а не с самим приложением; подробности — в разделе 7.

## 2. Лицензия SF Symbols: можно ли использовать в сайте, веб-приложении, PWA

### Takeaway
Нет. Символы лицензированы только для разработки приложений под устройства Apple, работающих на системах Apple; PWA на GitHub Pages под это определение не подпадает, и выкладывать экспортированные SVG символов SF Symbols в публичный репозиторий нельзя. Отдельно запрещено использовать символы (и похожие до степени смешения изображения) в иконке приложения, логотипе и любом товарном знаке.

### Cited Findings
- Первичный источник — «Xcode and Apple SDKs Agreement», редакция EA2002 от 08.06.2026, пункт 2.10 «System-Provided Images». По нему системные ресурсы Apple (изображения, символы), описанные в HIG, лицензируются — дословно — "solely for the purpose of developing Applications for Apple-branded products" (Apple, п. 2.10), причём работающих на той системе, для которой ресурс предоставлен — [apple.com/legal/sla/docs/xcode.pdf](https://www.apple.com/legal/sla/docs/xcode.pdf)
- Тот же пункт 2.10: запрещено использовать системные изображения или существенно/до смешения похожие на них в иконках приложений, логотипах и в качестве товарного знака; действуют также ограничения из самого ПО Apple и из HIG; Apple вправе потребовать изменить или прекратить использование; после прекращения соглашения можно продолжать распространять эти изображения только в составе уже разработанных приложений — [apple.com/legal/sla/docs/xcode.pdf](https://www.apple.com/legal/sla/docs/xcode.pdf)
- Определение «Application» в том же соглашении: программа, разработанная по этому соглашению специально для устройств Apple под macOS, iOS, watchOS, iPadOS, tvOS или visionOS — [apple.com/legal/sla/docs/xcode.pdf](https://www.apple.com/legal/sla/docs/xcode.pdf)
- В том же соглашении (раздел об ограничениях): без письменного разрешения Apple нельзя загружать ПО Apple на сайт или сервер, перераспространять и сублицензировать его целиком или частями — [apple.com/legal/sla/docs/xcode.pdf](https://www.apple.com/legal/sla/docs/xcode.pdf)
- HIG отсылает к условиям использования SF Symbols и отдельно называет запрет: символы и изображения, похожие до смешения, нельзя использовать в иконках приложений, логотипах и любых товарных знаках — [HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- Ограниченные символы: в наборе есть защищённые авторским правом символы, изображающие продукты и функции Apple. Их можно показывать в приложении, но нельзя изменять; приложение SF Symbols помечает их значком Info, а инспектор описывает ограничения. Делать копии продуктов Apple в собственных символах нельзя — [HIG: SF Symbols, раздел Custom symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- На самой странице SF Symbols на 11.11.2026 лицензионного абзаца нет: только нижний колонтитул со ссылками на общие условия — [developer.apple.com/sf-symbols](https://developer.apple.com/sf-symbols/)
- Форум Apple, июль 2026: на вопрос, можно ли использовать SF Symbols на сайте-компаньоне iOS-приложения, участник Etresoft ответил «нет» — это противоречит лицензии, приложенной к загрузке SF Symbols. Ответа сотрудника Apple в ветке нет — [Apple Developer Forums, thread 837003](https://developer.apple.com/forums/thread/837003)
- Форум Apple, июнь 2020: участник hacknicity считает, что снимки экрана приложения с символами на веб-странице допустимы, а использование самих изображений символов «очень вряд ли разрешено»; он же приводит пример сайта-каталога символов, убравшего изображения из-за лицензионных ограничений. Ответа сотрудника Apple нет — [Apple Developer Forums, thread 650900](https://developer.apple.com/forums/thread/650900)
- Форум Apple, июнь 2024: дизайнер спросил, можно ли использовать SF Symbols в SaaS-приложении для macOS и Windows, ограничено ли использование платформами Apple и можно ли купить лицензию для других платформ. Единственный ответ (участник endecotp, не сотрудник Apple) — три слова: нет, да, нет — [Apple Developer Forums, thread 757407](https://developer.apple.com/forums/thread/757407)
- Форум Apple, январь 2023: вопрос о собственных символах, сделанных из шаблонов SF Symbols, для сайтов. Ответ, отмеченный как принятый (участник endecotp, не сотрудник Apple): всё зависит от того, является ли символ производной работой от рисунка Apple; небольшая переделка символа Apple (например, перечёркнутый знак доллара) — скорее производная и использовать её не стоит, а полностью собственный рисунок, лишь сочетающийся с символами Apple, — вероятно, можно; в спорных случаях автор советует юриста — [Apple Developer Forums, thread 723738](https://developer.apple.com/forums/thread/723738)
- Мнение (блог Streamline, обзор наборов иконок 2025): использование SF Symbols сильно ограничено — только нативные приложения Apple для мобильных и настольных систем — [blog.streamlinehq.com](https://blog.streamlinehq.com/best-free-icon-sets/)

### Inferences
- Вердикт для PWA на GitHub Pages: нельзя. Веб-приложение открывается в любом браузере на любой системе и не является «Application» в смысле соглашения, а публикация SVG в открытом репозитории — это ещё и раздача ресурсов Apple третьим лицам.
- То, что PWA можно «установить» на iPhone, статус не меняет: это по-прежнему веб-страница, а не приложение, собранное по соглашению Apple SDK.
- Допустимо (по тем же источникам): символы в нативном приложении для систем Apple; снимки экрана такого приложения. Макеты интерфейса: Apple сама называет копирование символа картинкой средством для дизайнерских макетов (сессия WWDC21, раздел 1), но отдельного лицензионного пункта про макеты я не нашёл (см. Gaps). Макет веб-приложения с символами Apple всё равно бессмысленен: в готовый продукт их перенести нельзя.
- Запрет на «похожие до смешения» изображения сформулирован для иконок приложений, логотипов и товарных знаков. Открытые наборы с собственным рисунком в интерфейсе под него не попадают, но перерисовывать символы Apple «один в один» и ставить такой знак на иконку приложения рискованно.
- Обходных путей (перерисовка по экспортированному шаблону, конвертация шрифта SF в SVG, «чужой репозиторий с MIT») нет: права на рисунок остаются у Apple, чужая пометка лицензии их не отменяет.

### Gaps
- Текст лицензии, вшитой в установщик приложения SF Symbols (`.dmg`), не прочитан: для этого нужно скачать 445 МБ и смонтировать образ на Mac. Форум ссылается именно на неё — НЕ ПРОВЕРЕНО.
- Официального ответа сотрудника Apple про веб на форумах не найдено: во всех четырёх просмотренных ветках отвечают обычные участники. Вердикт опирается на текст соглашения (п. 2.10), а форум его только подтверждает.
- Лицензионный пункт, прямо разрешающий символы в макетах интерфейса (Figma/Sketch), не найден: на странице Design Resources пометки про SF Symbols нет, в п. 2.10 макеты не упомянуты — НЕ ПРОВЕРЕНО.
- Архивная версия страницы SF Symbols с прежним лицензионным абзацем недоступна (web.archive.org не открылся).

## 3. Репозитории GitHub, которые раздают SF Symbols в SVG или шрифтом

### Takeaway
Такие репозитории существуют, но нарушают лицензию Apple — не рекомендуются и в проект не годятся, даже если в них стоит пометка MIT.

### Cited Findings
- Поиск GitHub по «sf symbols» даёт 445 репозиториев; почти все верхние — это Swift-обёртки для нативных приложений (например, SFSafeSymbols/SFSafeSymbols, 1 898 звёзд, MIT), а не наборы для веба — [GitHub search: sf symbols](https://github.com/search?q=sf+symbols&type=repositories&s=stars&o=desc)
- Поиск «sf symbols svg» (35 репозиториев) находит выгрузки символов Apple в SVG, например brendanballon/sfsymbols-svg (130 звёзд, файла лицензии нет, последний push 24.07.2026) и 001ProMax/SF-Symbol (4 звезды, без лицензии), а также утилиты-конвертеры, которым нужен Mac с установленным SF Symbols: MoOx/sf-symbols-svg (44 звезды), yapstudios/sfsym (83 звезды), davedelong/sfsymbols (472 звезды, в архиве) — [GitHub search: sf symbols svg](https://github.com/search?q=sf+symbols+svg&type=repositories&s=stars&o=desc)
- Поиск «sf symbols web» — всего 8 результатов, реальных наборов для веба с заметной поддержкой нет (1–2 звезды); запрос «sf symbols alternative» — 0 результатов — [GitHub search: sf symbols web](https://github.com/search?q=sf+symbols+web&type=repositories&s=stars&o=desc)
- В каталоге Iconify (276 наборов) набора SF Symbols нет; нет и наборов с «apple / ios / cupertino» в названии — [iconify/icon-sets: collections.json](https://raw.githubusercontent.com/iconify/icon-sets/master/collections.json)
- Обратное направление легально: OrchardKit/open-symbols (258 звёзд, MIT) конвертирует открытые наборы в формат SF Symbols для нативных приложений — [GitHub search: sf symbols](https://github.com/search?q=sf+symbols&type=repositories&s=stars&o=desc)

### Inferences
- Пометка MIT или отсутствие лицензии в таком репозитории ничего не даёт: права на рисунки принадлежат Apple (см. п. 2.10 в разделе 2).
- Сюда же по сути относится Framework7 Icons: автор сам пишет, что набор основан на SF Symbols (см. раздел 4) — юридически это серая зона, а не чистый открытый набор.

### Gaps
- Поиск по GitHub шёл через API поиска (сортировка по звёздам); запросы «ios icons svg» и «apple style icons» дали в основном мусор и ни одного набора «под Apple» с открытой лицензией.

## 4. Открытые библиотеки иконок: проверенная сводка

### Takeaway
Чистые по лицензии, живые и удобные без сборщика: Lucide (ISC), Tabler (MIT), Phosphor (MIT), Iconoir (MIT), Ionicons (MIT), Heroicons (MIT). Framework7 Icons формально MIT, но основан на SF Symbols и не обновлялся с 2021 года — брать не стоит. Ни один из проверенных репозиториев не помечен как архивный.

### Cited Findings

#### Шортлист (все значения сняты 2026-11-11)

| Библиотека | Лицензия | Звёзды | Последний релиз (версия, дата) | Последний коммит | Иконок | Стили и толщины | Сетка и линия | Размер пакета npm |
|---|---|---|---|---|---|---|---|---|
| Lucide | ISC; часть иконок, унаследованных от Feather, — MIT. Указания авторства в продукте не требуется, но в копиях исходников нужно сохранять текст лицензии | 25 703 | 1.72.0, 11.11.2026 | 10.11.2026 | 2 052 | Один контурный стиль; заливок нет; толщина линии задаётся атрибутом | 24×24, линия 2, скруглённые концы и стыки, `currentColor` | `lucide-static` 56,3 МБ (в нём папка icons — 1,1 МБ); `lucide` 24,2 МБ |
| Phosphor | MIT | 7 794 (homepage), 399 (core), 530 (web) | core 2.1.1 в npm, 29.03.2024; web 2.1.2, 31.03.2025 | core 06.01.2026; homepage 26.08.2026 | 1 512 × 6 = 9 072 файла | 6 «весов»: thin, light, regular, bold, fill, duotone | viewBox 256×256, контур нарисован заливкой (`fill="currentColor"`) | core 6,5 МБ; web 46,3 МБ |
| Iconoir | MIT | 4 632 | 7.12.2, 04.11.2026 | 04.11.2026 | 1 383 контурных + 288 заливок | Контур; заливка только у 288 иконок | 24×24, линия 1.5, скруглённые концы | 7,1 МБ |
| Tabler Icons | MIT | 22 601 | 3.51.0, 08.11.2026 | 10.11.2026 | 6 287 (5 233 контурных + 1 054 заливки) | Контур и заливка (заливка не у всех) | 24×24, линия 2, скруглённые концы | 11,5 МБ |
| Ionicons | MIT | 18 245 | 8.1.0, 28.07.2026 | 28.07.2026 | 1 357 SVG-файлов (README: «1 300 иконок») | У каждой иконки три варианта: заливка (имя без суффикса), `-outline`, `-sharp` | viewBox 512×512, контур линией 32 (это 1.5 в пересчёте на 24) | 6,2 МБ |
| Framework7 Icons | MIT (но см. ниже про происхождение) | 231 | 5.0.5, 12.10.2021 | 03.03.2025 | 1 252 | Контур и `_fill` у большинства; одна толщина | viewBox 56×56 (рассчитан на 28 px), фигуры заливкой | 13,3 МБ (шрифт woff2 — 107 КБ) |
| Heroicons | MIT | 23 907 | 2.2.0, 18.11.2024 | 12.05.2026 | 324 (в стиле 16 px — 316) | 24 outline, 24 solid, 20 solid, 16 solid | 24×24, линия 1.5 | 0,7 МБ |

Источники по строкам:
- Lucide — [репозиторий](https://github.com/lucide-icons/lucide), [LICENSE](https://raw.githubusercontent.com/lucide-icons/lucide/main/LICENSE), [npm lucide-static](https://registry.npmjs.org/lucide-static), [npm lucide](https://registry.npmjs.org/lucide), [список файлов](https://data.jsdelivr.com/v1/packages/npm/lucide-static@1.72.0?structure=flat), [tags.json — 2 052 ключа](https://unpkg.com/lucide-static@1.72.0/tags.json), [пример SVG](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shopping-bag.svg); сайт — [lucide.dev](https://lucide.dev)
- Phosphor — [homepage](https://github.com/phosphor-icons/homepage), [core](https://github.com/phosphor-icons/core), [web](https://github.com/phosphor-icons/web), [LICENSE](https://raw.githubusercontent.com/phosphor-icons/core/main/LICENSE), [npm core](https://registry.npmjs.org/@phosphor-icons%2Fcore), [npm web](https://registry.npmjs.org/@phosphor-icons%2Fweb), [список файлов core](https://data.jsdelivr.com/v1/packages/npm/@phosphor-icons/core@2.1.1?structure=flat); сайт — [phosphoricons.com](https://phosphoricons.com)
- Iconoir — [репозиторий](https://github.com/iconoir-icons/iconoir), [LICENSE](https://raw.githubusercontent.com/iconoir-icons/iconoir/main/LICENSE), [README с числами](https://raw.githubusercontent.com/iconoir-icons/iconoir/main/README.md), [npm](https://registry.npmjs.org/iconoir), [список файлов](https://data.jsdelivr.com/v1/packages/npm/iconoir@7.12.2?structure=flat); сайт — [iconoir.com](https://iconoir.com)
- Tabler — [репозиторий](https://github.com/tabler/tabler-icons), [LICENSE](https://raw.githubusercontent.com/tabler/tabler-icons/main/LICENSE), [README с числами](https://raw.githubusercontent.com/tabler/tabler-icons/main/README.md), [npm](https://registry.npmjs.org/@tabler%2Ficons), [список файлов](https://data.jsdelivr.com/v1/packages/npm/@tabler/icons@3.51.0?structure=flat); сайт — [tabler.io/icons](https://tabler.io/icons)
- Ionicons — [репозиторий](https://github.com/ionic-team/ionicons), [LICENSE](https://raw.githubusercontent.com/ionic-team/ionicons/main/LICENSE), [readme](https://raw.githubusercontent.com/ionic-team/ionicons/main/readme.md), [npm](https://registry.npmjs.org/ionicons), [список файлов](https://data.jsdelivr.com/v1/packages/npm/ionicons@8.1.0?structure=flat); сайт — [ionic.io/ionicons](https://ionic.io/ionicons)
- Framework7 Icons — [репозиторий](https://github.com/framework7io/framework7-icons), [LICENSE](https://raw.githubusercontent.com/framework7io/framework7-icons/master/LICENSE), [README](https://raw.githubusercontent.com/framework7io/framework7-icons/master/README.md), [npm](https://registry.npmjs.org/framework7-icons), [список файлов](https://data.jsdelivr.com/v1/packages/npm/framework7-icons@5.0.5?structure=flat); сайт — [framework7.io/icons](https://framework7.io/icons/)
- Heroicons — [репозиторий](https://github.com/tailwindlabs/heroicons), [LICENSE](https://raw.githubusercontent.com/tailwindlabs/heroicons/master/LICENSE), [npm](https://registry.npmjs.org/heroicons), [список файлов](https://data.jsdelivr.com/v1/packages/npm/heroicons@2.2.0?structure=flat), [пример SVG](https://unpkg.com/heroicons@2.2.0/24/outline/home.svg); сайт — [heroicons.com](https://heroicons.com)

Важные уточнения по шортлисту:
- Ссылка `github.com/phosphor-icons/phosphor` перенаправляет на `phosphor-icons/android` — старый набор значков для рабочего стола Android (34 звезды, последний коммит 05.01.2021). Настоящие репозитории Phosphor — `homepage`, `core`, `web` — [github.com/phosphor-icons/phosphor](https://github.com/phosphor-icons/phosphor)
- README Phosphor (homepage) до сих пор говорит «1 248 иконок»; фактически в пакете core 2.1.1 по 1 512 файлов на каждый из шести весов — [README homepage](https://raw.githubusercontent.com/phosphor-icons/homepage/master/README.md), [список файлов core](https://data.jsdelivr.com/v1/packages/npm/@phosphor-icons/core@2.1.1?structure=flat)
- На GitHub у репозитория core последний релиз — v2.0.8 от 01.02.2024, а в npm — 2.1.1 от 29.03.2024: релизы на GitHub отстают от npm — [releases core](https://github.com/phosphor-icons/core/releases), [npm core](https://registry.npmjs.org/@phosphor-icons%2Fcore)
- README Lucide говорит «1600+» иконок; в пакете 1.72.0 — 2 052 канонических имени, а в папке `icons` пакета `lucide-static` лежит 2 356 SVG, потому что туда добавлены устаревшие имена-псевдонимы (`home`, `pie-chart`, `trash-2`, `edit` и другие) — [README](https://raw.githubusercontent.com/lucide-icons/lucide/main/README.md), [tags.json](https://unpkg.com/lucide-static@1.72.0/tags.json), [house.json с псевдонимом home](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/house.json)
- Framework7 Icons: в блоге автора (пост о переходе на Framework7 v5, октябрь 2019) сказано, что шрифт версии 3 получил 800+ новых иконок и теперь основан на SF Symbols от Apple, из-за чего большинство имён переименовано — [blog.framework7.io](https://blog.framework7.io/migration-to-framework7-v5)
- Имена Framework7 Icons действительно повторяют схему имён SF Symbols с заменой точки на подчёркивание: `arrow_2_circlepath`, `gamecontroller_alt_fill`, `staroflife`, `waveform_path_ecg`, `goforward_10`, `square_pencil` — [список файлов framework7-icons 5.0.5](https://data.jsdelivr.com/v1/packages/npm/framework7-icons@5.0.5?structure=flat)
- Heroicons: README сообщает, что новые иконки от сообщества не принимаются, только исправления ошибок — [README Heroicons](https://raw.githubusercontent.com/tailwindlabs/heroicons/master/README.md)
- Ionicons: README описывает набор как сделанный для Ionic Framework, с версиями иконок под Material Design и под iOS — [readme Ionicons](https://raw.githubusercontent.com/ionic-team/ionicons/main/readme.md)

#### Остальные кандидаты

| Библиотека | Лицензия | Звёзды | Последний релиз | Последний коммит | Иконок | Стили | Замечания |
|---|---|---|---|---|---|---|---|
| Remix Icon | С января 2026 — собственная «Remix Icon License v1.0» (раньше Apache-2.0) | 8 460 | 4.9.1, 29.01.2026 | 28.04.2026 | 3 229 SVG (README: «3200+») | line и fill у каждой иконки, сетка 24×24 | Условия ниже |
| Material Symbols (Google) | Apache-2.0 | 54 277 | Тегов для Symbols нет; последний тег — «Material Icons 4.0.0», 31.08.2020 | 23.10.2026 | 15 777 в каталоге Iconify (с вариантами) | 3 стиля (Outlined, Rounded, Sharp); оси шрифта: заливка, толщина 100–700, grade −50…200, оптический размер 20–48 | Вариативный шрифт 3,5–5,4 МБ на стиль |
| Fluent UI System Icons (Microsoft) | MIT | 10 973 | 1.1.345, 30.10.2026 | 10.11.2026 | 19 945 в каталоге Iconify (с размерами и стилями) | regular, filled (есть light); размеры зашиты в имя файла | Пакет `@fluentui/svg-icons` 12,9 МБ |
| Feather | MIT | 26 038 | 4.29.2, 01.05.2024 | 11.03.2025 | 287 | Один контурный стиль, 24×24, линия 2 | Не в архиве, но развитие остановилось; преемник — Lucide |
| Bootstrap Icons | MIT | 8 176 | 1.13.2, 08.10.2026 | 29.10.2026 | 2 078 | Контур и `-fill`; viewBox 16×16, рисунок заливкой | Есть спрайт и шрифт |
| Solar (480 Design) | В репозитории файла лицензии нет; каталог Iconify указывает CC-BY-4.0; npm-пакет `solar-icon-set` (React) помечен GPL-3.0 | 390 | Единственный релиз на GitHub — 26.01.2023; npm 2.0.1, 16.09.2025 | 23.06.2025 | 7 479 по README (8 706 в Iconify) | 6 стилей: Linear, Line Duotone, Bold, Bold Duotone, Broken, Outline | Лицензия противоречива; при CC BY нужно указание автора |
| Hugeicons | Бесплатная часть — MIT; остальное — платная «Pro license» | 1 230 | npm `@hugeicons/core-free-icons` 4.4.0, 28.10.2026 | 11.11.2026 | «6 000+ бесплатных» из «60 000+» (6 065 в Iconify) | В бесплатной части один стиль; 10 стилей — в платной | Пакет 80,6 МБ, рассчитан на фреймворки |
| MynaUI Icons | MIT | 175 | 0.4.11, 15.07.2026 | 18.09.2026 | 1 310 контурных + 1 310 заливок | Контур (линия 1.5) и solid | Маленький проект одного автора |
| css.gg | С версии 2.1.2 — собственная лицензия: обязательное указание автора, коммерческое использование только с разрешения, запрет производных работ (до 2.1.2 — MIT) | 10 061 | npm 2.1.4, 26.08.2024 | 26.08.2024 | 704 | Иконки на чистом CSS и SVG | Не развивается с августа 2024; лицензия не подходит |
| Iconify (агрегатор) | Код — MIT; у каждого набора своя лицензия | 6 394 | npm `@iconify/json` 2.2.555, 10.11.2026 | 01.11.2026 | 276 наборов, «250 000+» иконок | — | Компоненты по умолчанию грузят иконки с API Iconify, то есть без сети не работают |

Источники по строкам:
- Remix Icon — [репозиторий](https://github.com/Remix-Design/RemixIcon), [License](https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/License), [README](https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/README.md), [npm](https://registry.npmjs.org/remixicon), [список файлов](https://data.jsdelivr.com/v1/packages/npm/remixicon@4.9.1?structure=flat)
- Material Symbols — [репозиторий](https://github.com/google/material-design-icons), [README](https://raw.githubusercontent.com/google/material-design-icons/master/README.md), [npm material-symbols (сторонняя упаковка marella)](https://registry.npmjs.org/material-symbols), [список файлов](https://data.jsdelivr.com/v1/packages/npm/material-symbols@0.48.3?structure=flat), [каталог Iconify](https://raw.githubusercontent.com/iconify/icon-sets/master/collections.json)
- Fluent — [репозиторий](https://github.com/microsoft/fluentui-system-icons), [README](https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/README.md), [npm](https://registry.npmjs.org/@fluentui%2Fsvg-icons)
- Feather — [репозиторий](https://github.com/feathericons/feather), [npm](https://registry.npmjs.org/feather-icons), [список файлов](https://data.jsdelivr.com/v1/packages/npm/feather-icons@4.29.2?structure=flat)
- Bootstrap Icons — [репозиторий](https://github.com/twbs/icons), [README](https://raw.githubusercontent.com/twbs/icons/main/README.md), [npm](https://registry.npmjs.org/bootstrap-icons), [список файлов](https://data.jsdelivr.com/v1/packages/npm/bootstrap-icons@1.13.2?structure=flat)
- Solar — [репозиторий](https://github.com/480-Design/Solar-Icon-Set), [README](https://raw.githubusercontent.com/480-Design/Solar-Icon-Set/main/README.md), [npm](https://registry.npmjs.org/solar-icon-set), [каталог Iconify](https://raw.githubusercontent.com/iconify/icon-sets/master/collections.json)
- Hugeicons — [репозиторий](https://github.com/hugeicons/hugeicons), [README](https://raw.githubusercontent.com/hugeicons/hugeicons/main/README.md), [LICENSE.md](https://raw.githubusercontent.com/hugeicons/hugeicons/main/LICENSE.md), [npm](https://registry.npmjs.org/@hugeicons%2Fcore-free-icons)
- MynaUI — [репозиторий](https://github.com/praveenjuge/mynaui-icons), [README](https://raw.githubusercontent.com/praveenjuge/mynaui-icons/main/README.md), [npm](https://registry.npmjs.org/@mynaui%2Ficons), [список файлов](https://data.jsdelivr.com/v1/packages/npm/@mynaui/icons@0.4.11?structure=flat)
- css.gg — [репозиторий](https://github.com/astrit/css.gg), [LICENSE.md](https://raw.githubusercontent.com/astrit/css.gg/main/LICENSE.md), [npm](https://registry.npmjs.org/css.gg)
- Iconify — [репозиторий](https://github.com/iconify/iconify), [README](https://raw.githubusercontent.com/iconify/iconify/main/README.md), [collections.json](https://raw.githubusercontent.com/iconify/icon-sets/master/collections.json), [npm @iconify/json](https://registry.npmjs.org/@iconify%2Fjson)

Условия Remix Icon License v1.0 (версия 1.0, январь 2026; пересказ):
- разрешено коммерческое и личное использование в сайтах, веб- и мобильных приложениях, изменение иконок и включение в состав большего продукта; указание авторства желательно, но не обязательно — [License](https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/License)
- запрещено продавать иконки как самостоятельный продукт, делать из них конкурирующий набор иконок, использовать иконку как логотип, товарный знак или иконку приложения, если она представляет бренд — [License](https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/License)
- при распространении всей библиотеки или существенной части нужно сохранять уведомления об авторских правах и приложить текст лицензии; для отдельных иконок внутри продукта уведомление не требуется — [License](https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/License)
- расхождение: опубликованный в npm пакет 4.9.1 в поле license всё ещё содержит Apache-2.0, а в репозитории поле уже исправлено коммитом от 28.04.2026 — [package.json в npm](https://unpkg.com/remixicon@4.9.1/package.json), [package.json в репозитории](https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/package.json)
- каталог Iconify до сих пор показывает Remix Icon как Apache-2.0 (версия 4.8.0) — [collections.json](https://raw.githubusercontent.com/iconify/icon-sets/master/collections.json)

Лицензионные оговорки Iconify:
- из 276 наборов: MIT — 144, CC-BY-4.0 — 53, Apache-2.0 — 31, OFL-1.1 — 13, CC0-1.0 — 10, CC-BY-SA-4.0 — 7, ISC — 4; есть наборы с GPL и с некоммерческими CC-BY-NC — [collections.json](https://raw.githubusercontent.com/iconify/icon-sets/master/collections.json)

### Inferences
- Оценка активности (мой вывод по датам): активно развиваются Lucide, Tabler, Iconoir, Fluent, Material Symbols, Bootstrap Icons, Hugeicons; умеренно — Ionicons, Remix Icon, MynaUI; медленно — Phosphor (иконки не обновлялись в npm с марта 2024, но репозитории живые) и Heroicons (набор «заморожен» по замыслу); фактически остановлены — Framework7 Icons, Feather, css.gg, репозиторий Solar.
- Framework7 Icons не подходит по двум причинам сразу: набор основан на рисунках Apple (лицензия MIT автора не может передать права, которых у него нет), и он не обновлялся пять лет. Это правовая оценка, а не установленный судом факт.
- Remix Icon после смены лицензии по-прежнему годится для интерфейса веб-приложения, но не для иконки самого приложения и не для логотипа. Для однофайлового PWA проще взять набор с обычной MIT/ISC.
- css.gg и Solar отпадают из-за лицензий: у первого — запрет коммерческого использования и производных работ, у второго — три разных указания лицензии в трёх местах.
- Иконку приложения (значок на главном экране) ни из одного набора «как есть» лучше не делать: у Remix это прямо запрещено, у Apple запрещены похожие на SF Symbols знаки.

### Gaps
- Число звёзд снято со страниц GitHub, а не из API (API отдавал 403) — значения совпадают с тем, что показывает страница в день проверки.
- Точное число уникальных иконок Material Symbols и Fluent не установлено: приведены числа каталога Iconify, где варианты посчитаны отдельно.
- Как подключать Hugeicons без сборщика — НЕ ПРОВЕРЕНО.
- Лицензия Solar в первоисточнике (страница набора в Figma Community) не проверена — НЕ ПРОВЕРЕНО.
- Для Framework7 Icons не установлено, перерисованы ли контуры вручную или получены из файлов Apple: известно только заявление автора «основан на SF Symbols» и совпадение имён.

## 5. Как подключить без сборщика и без CDN, что управляется через CSS

### Takeaway
Для одного файла `index.html`, работающего офлайн, самый простой и лёгкий путь — скопировать нужные SVG (20–40 штук по 0,3–0,6 КБ) и вставить их прямо в HTML как inline-SVG или один локальный спрайт `<symbol>`. Толщину линии через CSS можно менять только у «штриховых» наборов (Lucide, Tabler, Iconoir, Heroicons, контурные Ionicons); у Phosphor и Framework7 толщина «запечена» в форму.

### Cited Findings

| Библиотека | Отдельные SVG-файлы | Спрайт | Шрифт | Скрипт без сборщика | Цвет и толщина через CSS |
|---|---|---|---|---|---|
| Lucide | да: `lucide-static/icons/*.svg`, в среднем около 0,5 КБ | `sprite.svg`, 566 КБ (все иконки) | `font/lucide.woff2` 316 КБ + `lucide.css` 116 КБ | `lucide/dist/umd/lucide.min.js`, 486 КБ | `stroke="currentColor"`, `stroke-width="2"` на корневом `<svg>` — меняются и цвет, и толщина |
| Phosphor | да: `@phosphor-icons/core/assets/{weight}/*.svg` | нет в пакете | `@phosphor-icons/web`: на каждый вес `style.css` (78 КБ у regular) + `Phosphor.woff2` (147 КБ у regular, 132 КБ у fill, 150 КБ у bold) | `web/src/index.js` подключает все веса (около 3 МБ шрифтов и CSS по README) | `fill="currentColor"` — цвет да; толщина только выбором веса (thin / light / regular / bold) |
| Iconoir | да: `icons/regular/*.svg`, `icons/solid/*.svg` | нет в пакете | нет; есть `css/iconoir.css` на масках, 2,9 МБ | нет | `stroke="currentColor"` на путях, `stroke-width="1.5"` на корне — меняются цвет и толщина |
| Tabler | да: `icons/outline/*.svg`, `icons/filled/*.svg` | `tabler-sprite.svg` 1,95 МБ; `tabler-sprite-nostroke.svg` 1,86 МБ (без заданной толщины); `tabler-sprite-filled.svg` 0,66 МБ | пакет `@tabler/icons-webfont` (19,7 МБ целиком) | нет | `currentColor`, `stroke-width="2"` — меняются цвет и толщина |
| Ionicons | да: `dist/svg/*.svg` | `dist/ionicons.symbols.svg`, 737 КБ | нет | веб-компонент `<ion-icon>`: модульный скрипт, который сам догружает SVG по сети | У контурных: `stroke="currentColor"`, толщина 32; у компонента есть CSS-переменная `--ionicon-stroke-width`. У заливок атрибута fill нет |
| Framework7 Icons | да: `svg/*.svg` | нет | `fonts/Framework7Icons-Regular.woff2` 107 КБ + `css/framework7-icons.css` 0,9 КБ; иконка задаётся текстом-лигатурой | нет | Фигуры заливкой, атрибута fill нет; толщина не меняется |
| Heroicons | да: `24/outline`, `24/solid`, `20/solid`, `16/solid` | нет | нет | нет | outline: `stroke="currentColor"`, `stroke-width="1.5"`; solid: `fill="currentColor"` |

Источники: списки файлов пакетов — [lucide-static](https://data.jsdelivr.com/v1/packages/npm/lucide-static@1.72.0?structure=flat), [lucide](https://data.jsdelivr.com/v1/packages/npm/lucide@1.72.0?structure=flat), [@phosphor-icons/core](https://data.jsdelivr.com/v1/packages/npm/@phosphor-icons/core@2.1.1?structure=flat), [@phosphor-icons/web](https://data.jsdelivr.com/v1/packages/npm/@phosphor-icons/web@2.1.2?structure=flat), [iconoir](https://data.jsdelivr.com/v1/packages/npm/iconoir@7.12.2?structure=flat), [@tabler/icons](https://data.jsdelivr.com/v1/packages/npm/@tabler/icons@3.51.0?structure=flat), [@tabler/icons-sprite](https://data.jsdelivr.com/v1/packages/npm/@tabler/icons-sprite@3.51.0?structure=flat), [ionicons](https://data.jsdelivr.com/v1/packages/npm/ionicons@8.1.0?structure=flat), [framework7-icons](https://data.jsdelivr.com/v1/packages/npm/framework7-icons@5.0.5?structure=flat), [heroicons](https://data.jsdelivr.com/v1/packages/npm/heroicons@2.2.0?structure=flat).

Отдельные факты:
- README пакета `lucide-static` предупреждает: спрайт и шрифт не рекомендуются для боевых страниц, потому что грузят все иконки сразу; для прототипов — допустимо — [README lucide-static](https://unpkg.com/lucide-static@1.72.0/README.md)
- Пакет `lucide` можно подключить одним скриптом без сборщика: README даёт адрес UMD-сборки `dist/umd/lucide.js`; в самой сборке 1.72.0 есть функция `createIcons` и атрибут-метка по умолчанию `data-lucide` (скрипт заменяет помеченные элементы на SVG). Файл весит 486 КБ и содержит все иконки — [README lucide](https://unpkg.com/lucide@1.72.0/README.md), [lucide.min.js](https://unpkg.com/lucide@1.72.0/dist/umd/lucide.min.js)
- Tabler README: иконки — обычные SVG, их можно ставить через `<img>`, как фон в CSS или прямо в HTML; inline-иконки наследуют `currentColor`, размер, цвет и `stroke-width` меняются через CSS; пример в README задаёт `stroke-width: 1.5` — [README Tabler](https://raw.githubusercontent.com/tabler/tabler-icons/main/README.md)
- Tabler спрайт: иконка вызывается через `<use>` с именем `tabler-{имя}`; есть отдельный спрайт без заданной толщины, чтобы задавать её из CSS — [README @tabler/icons-sprite](https://unpkg.com/@tabler/icons-sprite@3.51.0/README.md)
- Phosphor web: иконки — веб-шрифт на символах частной области Юникода; подключается таблица стилей нужного веса, иконка ставится тегом `<i>` с классом веса и классом иконки; цвет и размер задаются как у текста (`color`, `font-size`) — [README @phosphor-icons/web](https://raw.githubusercontent.com/phosphor-icons/web/master/README.md)
- Ionicons: у контурного варианта толщину можно менять CSS-переменной `--ionicon-stroke-width` (по умолчанию 32px); веб-компонент загружает SVG каждой иконки отдельным запросом — [readme Ionicons](https://raw.githubusercontent.com/ionic-team/ionicons/main/readme.md)
- Ionicons: в исходниках репозитория у контуров стоит `stroke="#000"`, а в опубликованном пакете — `stroke="currentColor"`; брать файлы нужно из пакета — [исходник](https://raw.githubusercontent.com/ionic-team/ionicons/main/src/svg/bag-outline.svg), [файл из пакета](https://unpkg.com/ionicons@8.1.0/dist/svg/bag-outline.svg)
- Framework7 Icons: шрифт использует лигатуры — в тег `<i class="f7-icons">` пишется имя иконки текстом; рекомендованный размер 28 px — [README Framework7 Icons](https://raw.githubusercontent.com/framework7io/framework7-icons/master/README.md)
- Heroicons README: самый быстрый способ — скопировать исходник нужной иконки и вставить в HTML — [README Heroicons](https://raw.githubusercontent.com/tailwindlabs/heroicons/master/README.md)
- Bootstrap Icons README отмечает, что внешний спрайт с другого домена некоторые браузеры блокируют, поэтому спрайт нужно отдавать со своего же адреса — [README Bootstrap Icons](https://raw.githubusercontent.com/twbs/icons/main/README.md)
- Material Symbols: один вариативный шрифт управляет заливкой, толщиной, grade и оптическим размером; ось заливки можно анимировать для показа выбранного состояния — [README material-design-icons](https://raw.githubusercontent.com/google/material-design-icons/master/README.md)

### Inferences
- Для этого проекта (один `index.html`, офлайн, без CDN) подходят два способа: (а) inline-SVG прямо в разметке; (б) один скрытый блок `<svg>` с `<symbol id="...">` в начале `body` и вызовы `<svg><use href="#id"/></svg>`. Оба работают без сети и без дополнительных файлов в кэше service worker. 30 иконок Lucide или Tabler добавят примерно 12–18 КБ к файлу в 480 КБ.
- Шрифты иконок и полные спрайты для однофайлового приложения невыгодны: сотни килобайт ради трёх десятков иконок, плюс отдельные файлы, которые нужно добавлять в кэш `sw.js`.
- Веб-компонент Ionicons и компоненты Iconify без доработки не подходят для офлайна: они догружают иконки по сети. SVG-файлы Ionicons при этом можно вставлять вручную.
- У заливочных Ionicons и у Framework7 в SVG нет атрибута `fill`, поэтому при вставке в HTML нужно задать `fill: currentColor` в CSS, иначе иконки будут чёрными на тёмной теме (вывод из содержимого файлов).
- Чтобы получить «переменную толщину как у SF Symbols» в вебе, есть три пути: менять `stroke-width` у штриховых наборов (плавно, одна иконка); брать разные веса Phosphor (4 ступени + fill); вариативный шрифт Material Symbols (плавная ось, но 3,5–5,4 МБ на стиль).
- Требование лицензий MIT/ISC сохранять текст лицензии для однофайлового приложения проще всего закрыть комментарием в `index.html` или файлом `THIRD_PARTY_LICENSES` в репозитории (это практическая рекомендация, не юридическая консультация).

### Gaps
- Параметры `createIcons` в Lucide (как задать толщину и размер сразу для всех иконок) по документации не сверены — НЕ ПРОВЕРЕНО; наличие самой функции и атрибута `data-lucide` подтверждено по файлу сборки.
- Поведение CSS-свойства `stroke-width` поверх атрибута в конкретных браузерах iPhone не тестировалось.

## 6. Визуальная близость к SF Symbols

### Takeaway
Прямых сравнений «какой открытый набор ближе всего к SF Symbols» в авторитетных источниках не нашлось. По объективным признакам ближе всего Phosphor (несколько весов и заливка у каждой иконки) и Ionicons (делался в том числе под iOS, три варианта у каждой иконки); Lucide, Tabler и Iconoir близки формой штриха, но у них одна толщина и неполные заливки.

### Cited Findings
- HIG: в SF Symbols контурный вариант — основной, заливка используется в панели вкладок iOS и для выбранного состояния; девять толщин привязаны к толщинам шрифта — [HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)
- Ionicons сам описывает себя как набор с версиями иконок под Material Design и под iOS; у каждой иконки есть заливка, контур и «sharp» — [readme Ionicons](https://raw.githubusercontent.com/ionic-team/ionicons/main/readme.md)
- Framework7 Icons называет себя шрифтом iOS-иконок и, по словам автора, основан на SF Symbols — [README](https://raw.githubusercontent.com/framework7io/framework7-icons/master/README.md), [blog.framework7.io](https://blog.framework7.io/migration-to-framework7-v5)
- Phosphor: 6 весов (thin, light, regular, bold, fill, duotone) у каждой иконки — [README homepage](https://raw.githubusercontent.com/phosphor-icons/homepage/master/README.md)
- Мнение (allsvgicons, Amit Yadav, 01.03.2026, обновлено 25.10.2026): Ionicons — контур, заливка и sharp «с ощущением iOS и Material»; у Lucide строгая сетка 24 px и линия 2 px; у Phosphor каждая иконка в шести весах — [allsvgicons.com](https://allsvgicons.com/blog/best-free-svg-icon-libraries-2026/)
- Мнение (Johan Ronsse, Obra Studio, 29.06.2025): для приложения только под iOS выбор очевиден — SF Symbols, их вид полностью соответствует системе; Phosphor — красивый проект с шестью стилями; Lucide продолжает Feather в том же стиле — [obra.studio](https://obra-studio-sveltekit.pages.dev/blog/2025/06/29/choosing-the-right-icon-set-for-your-project)
- Мнение (блог Streamline, 2025): у SF Symbols отличная настраиваемость, но качество рисунка местами неровное, а использование жёстко ограничено нативными приложениями Apple — [blog.streamlinehq.com](https://blog.streamlinehq.com/best-free-icon-sets/)
- Измеримые признаки по файлам: Lucide и Tabler — линия 2 на сетке 24, скруглённые концы; Iconoir и Heroicons — линия 1.5; Ionicons (контур) — 32 на сетке 512, то есть 1.5 в пересчёте на 24 — [Lucide SVG](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shopping-bag.svg), [Tabler SVG](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/shopping-bag.svg), [Iconoir SVG](https://raw.githubusercontent.com/iconoir-icons/iconoir/main/icons/regular/shopping-bag.svg), [Heroicons SVG](https://unpkg.com/heroicons@2.2.0/24/outline/home.svg), [Ionicons SVG](https://unpkg.com/ionicons@8.1.0/dist/svg/bag-outline.svg)

### Inferences
- Мой рейтинг близости «по ощущению» (вывод, не факт; глазами в рамке iPhone не сверялось):
  1. Phosphor — ближе всех по системе: одинаковые имена во всех весах, заливка у каждой иконки (для выбранной вкладки), мягкие скругления. Минус — рисунок чуть «игрушечнее», чем у Apple.
  2. Ionicons — ближе всех по рисунку отдельных иконок под iOS; заливка есть у всего набора. Минус — одна толщина и меньше иконок.
  3. Lucide и Tabler — аккуратный штрих со скруглёнными концами, толщина регулируется (линия 1.5–1.75 на 24 px ближе к весу Regular у SF Symbols, чем стандартные 2). Минус — у Lucide нет заливок вообще, у Tabler заливка есть не у всех.
  4. Iconoir и Heroicons — тонкая линия 1.5 из коробки, спокойный рисунок; заливок мало (Iconoir) или набор небольшой (Heroicons, 324 иконки).
  5. Material Symbols Rounded — единственный набор с плавной осью толщины и заливки, но рисунок узнаваемо «гугловский».
- Framework7 Icons выглядит как SF Symbols именно потому, что на них основан, — и по той же причине в рейтинг не включён.
- Для панели вкладок в духе iOS (контур в обычном состоянии, заливка в выбранном) полные пары дают только Phosphor, Ionicons, Heroicons, Remix и Bootstrap; у Tabler и Iconoir придётся проверять каждую иконку.

### Gaps
- Не найдено ни одного дизайнерского разбора, который прямо сравнивает открытые наборы с SF Symbols; обсуждений на Reddit и Hacker News поиск не вернул.
- Визуальное сравнение в рамке iPhone не проводилось: оценка сделана по атрибутам SVG и описаниям.

## 7. Точные имена иконок для 12 категорий и общего интерфейса

### Takeaway
Полное покрытие всех 12 категорий и служебных значков есть у Lucide, Phosphor, Tabler и Ionicons. У Iconoir нет такси, корзинки, билета и круговой диаграммы; у Framework7 Icons нет автобуса, чашки, вилки с ножом и академической шапочки.

### Cited Findings
Проверка: каждое имя из таблиц (кроме столбца SF Symbols) найдено как файл в указанной версии пакета. Источники: [lucide-static 1.72.0](https://data.jsdelivr.com/v1/packages/npm/lucide-static@1.72.0?structure=flat) плюс проверка канонических имён в [репозитории Lucide](https://github.com/lucide-icons/lucide/tree/main/icons); [@phosphor-icons/core 2.1.1](https://data.jsdelivr.com/v1/packages/npm/@phosphor-icons/core@2.1.1?structure=flat); [iconoir 7.12.2](https://data.jsdelivr.com/v1/packages/npm/iconoir@7.12.2?structure=flat); [@tabler/icons 3.51.0](https://data.jsdelivr.com/v1/packages/npm/@tabler/icons@3.51.0?structure=flat); [ionicons 8.1.0](https://data.jsdelivr.com/v1/packages/npm/ionicons@8.1.0?structure=flat); [framework7-icons 5.0.5](https://data.jsdelivr.com/v1/packages/npm/framework7-icons@5.0.5?structure=flat).

Правила имён файлов:
- Lucide: `icons/{имя}.svg`.
- Phosphor: `assets/regular/{имя}.svg`, для других весов — суффикс: `assets/fill/{имя}-fill.svg`, `assets/bold/{имя}-bold.svg`, `-light`, `-thin`, `-duotone`. Все имена из таблицы проверены в regular; в fill проверены `shopping-bag`, `shopping-cart`, `basket`, `bus`, `car`, `taxi`, `coffee`, `fork-knife`, `house`, `heartbeat`, `game-controller`, `graduation-cap`, `airplane`, `repeat`, `wallet`, `gear`, `chart-pie-slice`.
- Iconoir: `icons/regular/{имя}.svg`; заливка `icons/solid/{имя}.svg` есть только там, где отмечено «(solid)».
- Tabler: `icons/outline/{имя}.svg`; заливка `icons/filled/{имя}.svg` — там, где отмечено «(filled)».
- Ionicons: `dist/svg/{имя}.svg` — заливка, `{имя}-outline.svg` — контур, `{имя}-sharp.svg`; все имена из таблицы проверены во всех трёх вариантах.
- Framework7: `svg/{имя}.svg`, заливка — `{имя}_fill.svg`.
- Столбец SF Symbols — только для справки (использовать сами символы в вебе нельзя, см. раздел 2). Имена сверены не с приложением Apple, а с открытым списком имён символов в Swift-библиотеке SFSafeSymbols (MIT), файлы версий 1.0, 2.0, 3.0, 4.0 и 5.0: все имена из столбца там найдены — [SFSafeSymbols, папка Symbols](https://github.com/SFSafeSymbols/SFSafeSymbols/tree/stable/Sources/SFSafeSymbols/Symbols). В каких версиях появились: `bus`, `cross.case`, `pills`, `ticket`, `graduationcap`, `arrow.triangle.2.circlepath`, `gearshape`, `banknote`, `building.columns`, `wallet.pass` — 2.0; `cup.and.saucer`, `fork.knife` — 3.0; `basket`, `rublesign`, `popcorn` — 4.0; остальные — 1.0.

#### 12 категорий

| Категория | SF Symbols (для справки) | Lucide | Phosphor | Iconoir | Tabler | Ionicons | Framework7 |
|---|---|---|---|---|---|---|---|
| Покупки | `bag.fill` | `shopping-bag` | `shopping-bag`; ещё `bag`, `handbag` | `shopping-bag`; ещё `bag`, `handbag` | `shopping-bag` (заливки нет); `paper-bag` | `bag`, `bag-handle` | `bag`, `bag_fill` |
| Продукты | `cart.fill`, `basket.fill` | `shopping-cart`, `shopping-basket` | `shopping-cart`, `basket` | `cart`, `simple-cart` (корзинки нет) | `shopping-cart` (filled), `basket` (filled) | `cart`, `basket` | `cart`, `cart_fill` |
| Транспорт | `bus.fill` | `bus`, `bus-front` | `bus` | `bus`, `bus-stop`; ещё `tram`, `train` | `bus` (filled) | `bus`; ещё `subway`, `train` | автобуса нет; есть только `tram_fill` |
| Такси | `car.fill` | `car-taxi-front`, `car` | `taxi`, `car` | `car` (такси нет) | `car` (filled); такси нет; ещё `car-suv`, `steering-wheel` | `car`, `car-sport` | `car_fill` (контурного нет) |
| Кафе | `cup.and.saucer.fill` | `coffee` | `coffee` | `coffee-cup` | `coffee`, `cup`, `mug` (filled только у `mug`) | `cafe` | нет |
| Рестораны | `fork.knife` | `utensils`, `utensils-crossed` | `fork-knife` | `cutlery` | `tools-kitchen-2` (filled), `tools-kitchen` | `restaurant`; ещё `fast-food`, `pizza` | нет |
| Дом | `house.fill` | `house` | `house`, `house-simple` | `home`, `home-simple` | `home` (filled) | `home` | `house`, `house_fill` |
| Здоровье | `heart.fill`, `cross.case.fill`, `pills.fill` | `heart-pulse`, `pill`, `cross`, `stethoscope`, `briefcase-medical` | `heartbeat`, `pill`, `first-aid`, `first-aid-kit` | `health-shield`, `healthcare`, `pharmacy-cross-tag`, `heart` (solid) | `heartbeat`, `pill` (filled), `first-aid-kit`, `medical-cross`, `stethoscope`, `heart` (filled) | `medkit`, `pulse`, `fitness`, `medical`, `bandage` | `heart_fill`, `waveform_path_ecg`, `bandage_fill`, `staroflife_fill`, `capsule_fill` |
| Развлечения | `gamecontroller.fill`, `film.fill`, `ticket.fill` | `gamepad-2`, `film`, `ticket`, `clapperboard`, `popcorn` | `game-controller`, `film-slate`, `film-strip`, `ticket`, `popcorn` | `gamepad`, `movie`, `cinema-old` (билета нет) | `device-gamepad-2` (filled), `movie`, `ticket` (filled), `masks-theater` | `game-controller`, `film`, `ticket` | `gamecontroller_fill`, `film_fill`, `ticket_fill` |
| Образование | `graduationcap.fill`, `book.fill` | `graduation-cap`, `book-open`, `book` | `graduation-cap`, `book-open`, `book` | `graduation-cap` (solid), `book` (solid), `open-book`, `learning` | `school` (filled), `book` (filled), `book-2` | `school`, `book`, `library` | `book`, `book_fill` (шапочки нет) |
| Путешествия | `airplane` | `plane`, `plane-takeoff` | `airplane`, `airplane-tilt`, `airplane-takeoff` | `airplane`, `airplane-helix`, `suitcase` | `plane` (filled), `plane-departure`, `plane-tilt` | `airplane` | `airplane` |
| Подписки | `repeat`, `arrow.triangle.2.circlepath`, `creditcard.fill` | `repeat`, `calendar-sync`, `refresh-cw`, `credit-card` | `repeat`, `arrows-clockwise`, `credit-card` | `repeat`, `refresh-double`, `calendar-rotate` (solid), `credit-card` (solid) | `repeat`, `refresh`, `calendar-repeat`, `credit-card` (filled) | `repeat`, `sync`, `refresh`, `card` | `arrow_2_circlepath`, `repeat`, `creditcard_fill` |

#### Общий интерфейс

| Назначение | SF Symbols (для справки) | Lucide | Phosphor | Iconoir | Tabler | Ionicons | Framework7 |
|---|---|---|---|---|---|---|---|
| Кошелёк | `creditcard.fill`, `wallet.pass.fill` | `wallet` | `wallet` | `wallet` (solid) | `wallet` (заливки нет) | `wallet` | `wallet`, `wallet_fill` |
| Плюс | `plus` | `plus` | `plus` | `plus` | `plus` | `add` | `plus` |
| Минус | `minus` | `minus` | `minus` | `minus` | `minus` | `remove` | `minus` |
| Стрелка вверх-вправо (расход) | `arrow.up.right` | `arrow-up-right` | `arrow-up-right` | `arrow-up-right` | `arrow-up-right` | простой нет; `arrow-up-right-box`, `trending-up`, `arrow-up` | `arrow_up_right` |
| Стрелка вниз-влево (доход) | `arrow.down.left` | `arrow-down-left` | `arrow-down-left` | `arrow-down-left` | `arrow-down-left` | простой нет; `arrow-down-left-box`, `trending-down`, `arrow-down` | `arrow_down_left` |
| Диаграмма | `chart.pie.fill`, `chart.bar.fill` | `chart-pie`, `chart-column` | `chart-pie-slice`, `chart-pie`, `chart-bar`, `chart-donut` | круговой нет; `reports` (solid), `stat-up`, `graph-up` | `chart-pie` (filled), `chart-bar`, `chart-donut` | `pie-chart`, `stats-chart`, `bar-chart` | `chart_pie`, `chart_pie_fill`, `chart_bar`, `chart_bar_fill` |
| Настройки | `gearshape.fill` | `settings` | `gear`, `gear-six` | `settings` | `settings` (filled) | `settings`, `cog` | `gear`, `gear_alt`, `gear_alt_fill` |
| Календарь | `calendar` | `calendar`, `calendar-days` | `calendar`, `calendar-blank`, `calendar-dots` | `calendar` | `calendar` (filled), `calendar-month` | `calendar` | `calendar`, `calendar_today` |
| Поиск | `magnifyingglass` | `search` | `magnifying-glass` | `search` | `search` | `search` | `search` |
| Шеврон вправо | `chevron.right` | `chevron-right` | `caret-right` | `nav-arrow-right` (solid) | `chevron-right` | `chevron-forward` | `chevron_right` |
| Корзина (удалить) | `trash` | `trash` | `trash`, `trash-simple` | `trash` (solid) | `trash` (filled) | `trash` | `trash`, `trash_fill` |
| Карандаш | `pencil`, `square.and.pencil` | `pencil`, `square-pen` | `pencil-simple`, `pencil`, `pencil-simple-line` | `edit-pencil`, `edit` | `pencil` (filled), `edit` | `pencil`, `create` | `pencil`, `square_pencil` |
| Галочка | `checkmark` | `check` | `check` | `check` | `check` | `checkmark` | `checkmark`, `checkmark_alt` |
| Закрыть | `xmark` | `x` | `x` | `xmark` | `x` | `close` | `xmark`, `multiply` |
| Рубль | `rublesign`, `rublesign.circle.fill` | `russian-ruble` | `currency-rub` | не найден | `currency-ruble` | не проверялось | `money_rubl`, `money_rubl_circle` |
| Копилка, наличные, банк | `banknote.fill`, `building.columns.fill` | `piggy-bank`, `banknote`, `landmark`, `receipt`, `hand-coins` | `piggy-bank`, `money`, `bank`, `receipt`, `coins`, `hand-coins` | `piggy-bank`, `coins`, `hand-cash` | `pig-money`, `cash`, `building-bank`, `receipt`, `coins` | `cash`, `receipt` | `money_dollar`, `money_dollar_circle` |

Подводные камни имён (проверено):
- Lucide: `home`, `pie-chart`, `trash-2`, `edit` — устаревшие псевдонимы. В репозитории таких файлов уже нет (ответ 404), канонические имена — `house`, `chart-pie`, `trash`, `square-pen`. В пакете `lucide-static` файлы-псевдонимы ещё лежат — [house.json](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/house.json), [chart-pie.json](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/chart-pie.json), [trash.json](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/trash.json), [square-pen.json](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/square-pen.json)
- Lucide: иконки `taxi` нет, такси — это `car-taxi-front` — [репозиторий Lucide, папка icons](https://github.com/lucide-icons/lucide/tree/main/icons)
- Iconoir: в папке solid нет `home`, `cart`, `bus`, `car`, `coffee-cup`, `cutlery`, `gamepad`, `airplane`, `calendar`, `settings`, `search` — заливочная пара для панели вкладок из Iconoir не собирается — [список файлов iconoir](https://data.jsdelivr.com/v1/packages/npm/iconoir@7.12.2?structure=flat)
- Tabler: в папке filled нет `shopping-bag`, `coffee`, `cup`, `heartbeat`, `first-aid-kit`, `movie`, `repeat`, `wallet` — [список файлов @tabler/icons](https://data.jsdelivr.com/v1/packages/npm/@tabler/icons@3.51.0?structure=flat)
- Ionicons: у всех перечисленных имён есть три файла (без суффикса, `-outline`, `-sharp`); диагональные стрелки есть только «в рамке» (`arrow-up-right-box`) — [список файлов ionicons](https://data.jsdelivr.com/v1/packages/npm/ionicons@8.1.0?structure=flat)
- Framework7: нет `bus`, `car` (без `_fill`), `graduationcap`, `cup_and_saucer`, `fork_knife`, `tram` (без `_fill`) — [список файлов framework7-icons](https://data.jsdelivr.com/v1/packages/npm/framework7-icons@5.0.5?structure=flat)
- Iconoir: файл `x.svg` — это знак соцсети X (перечёркнутый параллелограмм), а не крестик закрытия; для «закрыть» нужен `xmark` — [x.svg](https://unpkg.com/iconoir@7.12.2/icons/regular/x.svg)

### Inferences
- Если нужны все 12 категорий одним набором и с заливками для выбранного состояния — это Phosphor (все имена есть и в regular, и в fill) или Ionicons (три варианта у каждого имени).
- Lucide закрывает все категории, но только контуром; «выбранное» состояние придётся показывать цветом или подложкой.
- Tabler закрывает всё, кроме такси (годится `car`), но заливки неполные.
- Iconoir потребует замен: такси → `car`, корзинка → `cart`, билет → `movie` или `gamepad`, круговая диаграмма → `reports`.

### Gaps
- Столбец SF Symbols сверен со сторонним списком имён, а не с приложением SF Symbols 27; внешний вид символов и их наличие именно в версии 27 — НЕ ПРОВЕРЕНО. Контурный `car` (без `.fill`) и `wallet.bifold` в проверенных файлах списка (версии x.0 с 1.0 по 5.0) не найдены и в таблицу не включены.
- Рубль в Ionicons и Iconoir не искался отдельно по всем возможным именам.
- Внешний вид иконок глазами не сравнивался: проверено только существование файлов.

## 8. Шаблоны адресов для получения одного SVG

### Takeaway
У всех шести библиотек шортлиста один SVG можно получить по предсказуемому адресу; по одному адресу на библиотеку проверено — возвращается SVG. Адреса нужны только чтобы один раз скачать файл и положить его в проект, а не чтобы подключать CDN в приложении.

### Cited Findings
Все адреса ниже вернули код 200 и содержимое SVG (проверено 2026-11-11):
- Lucide: `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/{имя}.svg` — [пример](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shopping-bag.svg); `https://unpkg.com/lucide-static@1.72.0/icons/{имя}.svg` — [пример](https://unpkg.com/lucide-static@1.72.0/icons/shopping-bag.svg); `https://cdn.jsdelivr.net/npm/lucide-static@1.72.0/icons/{имя}.svg` — [пример](https://cdn.jsdelivr.net/npm/lucide-static@1.72.0/icons/shopping-bag.svg)
- Phosphor: `https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/{имя}.svg` — [пример](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/shopping-bag.svg); заливка `.../assets/fill/{имя}-fill.svg` — [пример](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/fill/shopping-bag-fill.svg); жирный `.../assets/bold/{имя}-bold.svg` — [пример](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/bold/shopping-bag-bold.svg); `https://unpkg.com/@phosphor-icons/core@2.1.1/assets/regular/{имя}.svg` — [пример](https://unpkg.com/@phosphor-icons/core@2.1.1/assets/regular/shopping-bag.svg)
- Iconoir: `https://raw.githubusercontent.com/iconoir-icons/iconoir/main/icons/regular/{имя}.svg` — [пример](https://raw.githubusercontent.com/iconoir-icons/iconoir/main/icons/regular/shopping-bag.svg); заливка `.../icons/solid/{имя}.svg` — [пример](https://raw.githubusercontent.com/iconoir-icons/iconoir/main/icons/solid/wallet.svg); `https://unpkg.com/iconoir@7.12.2/icons/regular/{имя}.svg` — [пример](https://unpkg.com/iconoir@7.12.2/icons/regular/shopping-bag.svg)
- Tabler: `https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/{имя}.svg` — [пример](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/shopping-bag.svg); заливка `.../icons/filled/{имя}.svg` — [пример](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/filled/shopping-cart.svg); `https://unpkg.com/@tabler/icons@3.51.0/icons/outline/{имя}.svg` — [пример](https://unpkg.com/@tabler/icons@3.51.0/icons/outline/shopping-bag.svg)
- Ionicons: `https://unpkg.com/ionicons@8.1.0/dist/svg/{имя}-outline.svg` — [пример](https://unpkg.com/ionicons@8.1.0/dist/svg/bag-outline.svg); заливка `.../dist/svg/{имя}.svg` — [пример](https://unpkg.com/ionicons@8.1.0/dist/svg/home.svg); исходники `https://raw.githubusercontent.com/ionic-team/ionicons/main/src/svg/{имя}.svg` — [пример](https://raw.githubusercontent.com/ionic-team/ionicons/main/src/svg/bag-outline.svg)
- Framework7 Icons: `https://unpkg.com/framework7-icons@5.0.5/svg/{имя}.svg` — [пример](https://unpkg.com/framework7-icons@5.0.5/svg/bag_fill.svg)
- Heroicons: `https://unpkg.com/heroicons@2.2.0/24/outline/{имя}.svg` — [пример](https://unpkg.com/heroicons@2.2.0/24/outline/home.svg); `.../24/solid/{имя}.svg` — [пример](https://unpkg.com/heroicons@2.2.0/24/solid/home.svg)
- Те же файлы на jsDelivr (код 200, тип `image/svg+xml`): [Phosphor](https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/assets/regular/shopping-bag.svg), [Iconoir](https://cdn.jsdelivr.net/npm/iconoir@7.12.2/icons/regular/shopping-bag.svg), [Heroicons](https://cdn.jsdelivr.net/npm/heroicons@2.2.0/24/outline/home.svg)

Различия между источниками одного и того же файла:
- Lucide: файл из `lucide-static` начинается с комментария о лицензии и содержит `class="lucide lucide-{имя}"`; файл из репозитория — без них — [из пакета](https://unpkg.com/lucide-static@1.72.0/icons/shopping-bag.svg), [из репозитория](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shopping-bag.svg)
- Tabler: файл из репозитория начинается с комментария с тегами и категорией; файл из пакета — с классами `icon icon-tabler ...` и пустым прозрачным путём-подложкой — [из репозитория](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/shopping-bag.svg), [из пакета](https://unpkg.com/@tabler/icons@3.51.0/icons/outline/shopping-bag.svg)
- Ionicons: в репозитории `stroke="#000"`, в пакете `stroke="currentColor"` — [из репозитория](https://raw.githubusercontent.com/ionic-team/ionicons/main/src/svg/bag-outline.svg), [из пакета](https://unpkg.com/ionicons@8.1.0/dist/svg/bag-outline.svg)

### Inferences
- Для воспроизводимости лучше брать файлы с unpkg/jsDelivr с точной версией в адресе, а не из ветки `main` на GitHub: содержимое ветки меняется, а у Lucide из репозитория исчезают устаревшие имена.
- Скачанные файлы нужно положить в проект (или вставить в `index.html`); ссылаться на эти адреса из приложения нельзя — пропадёт работа офлайн.

### Gaps
- Путь к SVG в самом репозитории Framework7 Icons не найден: `src/svg/`, `svg/`, `src/` в ветке master вернули 404; проверен только адрес пакета на unpkg — НЕ ПРОВЕРЕНО.
- Адреса Tabler, Ionicons и Framework7 Icons на jsDelivr (`cdn.jsdelivr.net/npm/...`) отдельно не открывались — НЕ ПРОВЕРЕНО; для Lucide, Phosphor, Iconoir и Heroicons они проверены (код 200, SVG).
