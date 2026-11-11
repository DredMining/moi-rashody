# Шрифты Apple (San Francisco, New York) и типографика HIG: что можно использовать в веб-приложении

Состояние на 11.11.2026. Все факты ниже взяты со страниц, открытых в этот день; рядом с каждым стоит ссылка. Пометки:
- **[первоисточник]** — страница Apple / WebKit / Microsoft / W3C / MDN прочитана напрямую;
- **[вторичный]** — блог, форум, каталог, Википедия;
- **НЕ ПРОВЕРЕНО** — подтверждения найти не удалось, это предположение или пробел.

Оговорка о цитатах: тексты лицензий Apple и HIG защищены авторским правом, поэтому условия пересказаны по-русски близко к тексту с номерами пунктов (§2A, §2B…) и ссылкой на оригинал; дословно приведена одна короткая фраза лицензии. Числовые таблицы (кегли, интерлиньяж, трекинг) — фактические данные, даны полностью. Файлы шрифтов (.dmg) не скачивались и не вскрывались.

---

## 1. Какие шрифты лежат на developer.apple.com/fonts, какие у них веса / ширины / оптические размеры, переменный ли SF Pro, чем Display отличается от Text

### Takeaway
На странице Apple Fonts сегодня восемь загрузок: SF Pro, SF Compact, SF Mono, New York и четыре «script extensions» (SF Arabic, SF Armenian, SF Georgian, SF Hebrew). SF Pro — переменный шрифт с осями веса, ширины и оптического размера; жёсткой границы «Text до 20 pt / Display от 20 pt» больше нет — рисунок плавно переходит от Text к Display между 17 и 28 pt, и система делает это сама.

### Cited Findings
- **Состав страницы и описания (пересказ) [первоисточник]:**
  - **SF Pro** — системный шрифт платформ Apple: девять весов, переменные оптические размеры, четыре ширины, есть скруглённый вариант (Rounded); заявлена поддержка 150+ языков на латинице, греческом и кириллице. Файл: `SF-Pro.dmg`.
  - **SF Compact** — более узкий, для мелких кеглей и узких колонок; системный шрифт watchOS; есть Rounded. Число весов и поддерживаемые письменности на странице **не указаны**.
  - **SF Mono** — моноширинный вариант (Xcode): шесть весов; латиница, греческий, кириллица.
  - **New York** — антиква-компаньон: шесть весов; латиница, греческий, кириллица; переменные оптические размеры.
  - **SF Arabic / SF Armenian / SF Georgian / SF Hebrew** — расширения системного шрифта для других письменностей: девять весов, Rounded-вариант, переменные оптические размеры.
  — [Apple Fonts](https://developer.apple.com/fonts/)
- Слова «variable font» на странице Apple Fonts нет — там только «variable optical sizes» [первоисточник] — [Apple Fonts](https://developer.apple.com/fonts/). Но HIG прямо говорит, что система поставляет SF и NY в формате variable font, который объединяет стили в одном файле и интерполирует промежуточные [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- HIG: в системных шрифтах работают «dynamic optical sizes» — дискретные оптические размеры (Text и Display) и веса слиты в один непрерывный дизайн, система подбирает начертание под кегль; выбирать Text/Display вручную нужно только в дизайн-инструменте, который не умеет все возможности variable-формата [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- WWDC 2020 «The details of UI typography»: изначально SF Text делался для кеглей ниже 20 pt, SF Display — для 20 pt и выше; с превращением SF Pro в переменный шрифт жёсткой границы у 20 pt нет, переход от Text к Display идёт между 17 и 28 pt; в коде синхронизация оптического размера с кеглем полностью автоматическая [первоисточник] — [WWDC20, session 10175](https://developer.apple.com/videos/play/wwdc2020/10175/)
- WWDC 2022 «Meet the expanded San Francisco font family»: к осям веса и оптического размера добавлена ось ширины; три новых ширины — Condensed, Compressed, Expanded; большинство семейств SF имеют веса от Ultralight до Black; анонсирован SF Arabic Rounded [первоисточник] — [WWDC22, session 110381](https://developer.apple.com/videos/play/wwdc2022/110381/)
- HIG: веса системных шрифтов — от Ultralight до Black; у SF несколько ширин, включая Condensed и Expanded; веса SF Symbols совпадают с весами текста [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- Какой шрифт на какой платформе: SF Pro — системный шрифт iOS и iPadOS; приложения iOS могут использовать и New York [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography). Соответствие дизайнов SwiftUI: `default` → SF Pro (Display и Text), в watchOS — SF Compact; `monospaced` → SF Mono; `rounded` → SF Pro Rounded; `serif` → New York [первоисточник] — [Apple Developer: Fonts (Technology Overviews)](https://developer.apple.com/documentation/technologyoverviews/fonts.md)
- Википедия (в основном без сносок): SF Pro Text/Display — по девять весов с курсивами; SF Pro Rounded — девять весов (2018); SF Mono — шесть весов с курсивами (WWDC 2016); New York — оптические размеры Small/Medium/Large/Extra Large, шесть весов с курсивами, опубликован 3 июня 2019 [вторичный] — [Wikipedia: San Francisco (sans-serif typeface)](https://en.wikipedia.org/wiki/San_Francisco_(sans-serif_typeface))

### Inferences
- «Четыре ширины» SF Pro на странице Apple Fonts = обычная + Condensed + Compressed + Expanded (страница их не перечисляет; три дополнительные названы в докладе WWDC22).
- Для веб-страницы всё это означает одно: на iPhone оптический размер и ширина рисунка подбираются системой сами, когда текст набран системным шрифтом (см. раздел 5); управлять осью `opsz` вручную не нужно.

### Gaps
- Не проверено, какие именно файлы лежат внутри `.dmg` (переменные и/или статические, сколько начертаний, курсивы): образы не скачивались.
- Число весов SF Compact и наличие курсива у каждого семейства — только по Википедии без сносок.
- Доклад WWDC 2015 (session 804) и WWDC 2016 (session 803) на сайте Apple не открылись — расшифровки получить не удалось.

---

## 2. Кириллица и знак рубля ₽ (U+20BD) по семействам

### Takeaway
Кириллицу Apple прямо заявляет для SF Pro, SF Mono и New York (страница шрифтов) и для SF Pro + SF Compact (документация); для SF Pro Rounded подтверждение есть только косвенное и из стороннего каталога. Наличие глифа ₽ ни в одном семействе по открытым источникам подтвердить не удалось — **НЕ ПРОВЕРЕНО**, нужна проверка на устройстве.

### Cited Findings
| Семейство | Кириллица | Чем подтверждено |
|---|---|---|
| SF Pro | да | Страница Apple: 150+ языков на латинице, греческом, кириллице — [Apple Fonts](https://developer.apple.com/fonts/); WWDC22: все шрифты SF Pro (включая новые ширины) покрывают латиницу, греческий и кириллицу — [WWDC22](https://developer.apple.com/videos/play/wwdc2022/110381/) |
| SF Pro Rounded | вероятно да | На странице Apple Rounded упомянут как вариант SF Pro внутри того же описания — [Apple Fonts](https://developer.apple.com/fonts/); сторонний каталог указывает набор «Latin, Greek, Cyrillic, Vietnamese» [вторичный] — [v-fonts: SF Rounded](https://v-fonts.com/fonts/sf-rounded) |
| SF Compact | да (по документации) | На странице шрифтов письменности не названы — [Apple Fonts](https://developer.apple.com/fonts/); документация Apple: SF Pro и SF Compact обслуживают латиницу, кириллицу и греческий — [Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md) |
| SF Mono | да | Страница Apple: шесть весов; латиница, греческий, кириллица — [Apple Fonts](https://developer.apple.com/fonts/) |
| New York | да | Страница Apple: латиница, греческий, кириллица — [Apple Fonts](https://developer.apple.com/fonts/) |
| SF Arabic / Armenian / Georgian / Hebrew | нет (это расширения под свои письменности) | [Apple Fonts](https://developer.apple.com/fonts/) |

- Знак рубля: кодовая позиция U+20BD RUBLE SIGN появилась в Unicode 7.0 (16 июня 2014) [вторичный] — [Wikipedia: Ruble sign](https://en.wikipedia.org/wiki/Ruble_sign)
- Единственные найденные упоминания про Apple: комментарий на Stack Overflow, что символ рубля поддерживается с iOS 8 [вторичный, слабый] — [зеркало вопроса Stack Overflow](https://kiwix.lema.org/stackoverflow.com_en_all_2023-11/questions/29146576/ruble-symbol-not-showing-on-ios); блог Livetyping о том, что для валютных символов на iOS стоит использовать системные шрифты (San Francisco, Helvetica Neue) [вторичный] — [Livetyping](https://livetyping.com/en/blog/ios-currency-character-display)
- Для сравнения, Windows: Microsoft называет Segoe UI Variable шрифтом для английского, европейских языков, греческого и русского; покрытие — Latin, Greek, Cyrillic [первоисточник] — [Microsoft Learn: Typography in Windows](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/typography)

### Inferences
- Раз приложение на iPhone будет набрано системным шрифтом (а не файлом SF Pro), вопрос «есть ли ₽ в SF Pro» практически сводится к вопросу «рисует ли iOS знак ₽ в системном шрифте». Если глифа нет в основном шрифте, браузер подставит его из другого системного — знак всё равно появится, но может отличаться по рисунку и толщине.
- Самый надёжный способ закрыть вопрос — открыть на iPhone тестовую страницу со строкой вида «1 234,56 ₽» в `system-ui`, `ui-rounded`, `ui-monospace`, `ui-serif` и сравнить толщину и рисунок ₽ с цифрами во всех используемых весах.

### Gaps
- **НЕ ПРОВЕРЕНО:** наличие ₽ (U+20BD) в SF Pro, SF Pro Rounded, SF Mono, SF Compact, New York. Официального списка глифов Apple не публикует; независимых таблиц глифов найти не удалось.
- **НЕ ПРОВЕРЕНО:** кириллица именно в SF Pro Rounded и SF Compact Rounded по первоисточнику.
- В поиске попалась ветка «Safari monospaced font doesn't support Cyrillic?» ([macpowerusers](https://talk.macpowerusers.com/t/safari-monospaced-font-doesnt-support-cyrillic/35530)) — не читалась; сигнал, что `ui-monospace` с русским текстом стоит проверить на устройстве.

---

## 3. Цифры в SF: пропорциональные или табличные, какие OpenType-функции, как Apple делает моноширинные цифры и работает ли это из CSS

### Takeaway
По умолчанию цифры в San Francisco пропорциональные (с iOS 9); моноширинные включаются отдельно — в SwiftUI через `monospacedDigit()`. В CSS тот же эффект запрашивается через `font-variant-numeric: tabular-nums`; WebKit тестирует эту функцию на системном шрифте, но есть старый отчёт о сбое — на iPhone обязательно проверить глазами.

### Cited Findings
- С iOS 9 цифры системного шрифта стали пропорциональными (в iOS 8 были моноширинными); формулировка из доклада WWDC 2015 (session 804) в пересказе блога: пропорциональные по умолчанию, моноширинные — по запросу [вторичный] — [Use Your Loaf: iOS 9 Proportional Numbers](https://useyourloaf.com/blog/ios-9-proportional-numbers) (опубликовано 29.06.2015, обновлено 09.05.2022); то же на форуме Apple — [Apple Developer Forums, thread 6241](https://developer.apple.com/forums/thread/6241)
- SwiftUI `Font.monospacedDigit()`: возвращает шрифт с цифрами фиксированной ширины, остальные знаки остаются пропорциональными; если шрифт не умеет моноширинные цифры, он не меняется; доступно с iOS 13 [первоисточник] — [Apple Developer: Font.monospacedDigit()](https://developer.apple.com/documentation/swiftui/font/monospaceddigit())
- На уровне Core Text моноширинные цифры включаются функцией `kNumberSpacingType` / `kMonospacedNumbersSelector`; альтернативные 6 и 9 — `kStylisticAlternativesType` + `kStylisticAltOneOnSelector`; альтернативная 4 — `kStylisticAltTwoOnSelector` [вторичный] — [Use Your Loaf](https://useyourloaf.com/blog/ios-9-proportional-numbers)
- CSS: значение `tabular-nums` соответствует OpenType-функции `tnum`; свойство `font-variant-numeric` поддерживается в Safari на iOS с версии 9.3 [вторичный, сводка MDN/caniuse] — [caniuse: tabular-nums](https://caniuse.com/mdn-css_properties_font-variant-numeric_tabular-nums), [MDN: font-variant-numeric](https://developer.mozilla.org/docs/Web/CSS/font-variant-numeric)
- В репозитории WebKit есть тест, который проверяет применение font features (включая `font-variant-numeric: tabular-nums`) к `-apple-system` и `system-ui` [первоисточник, по описанию теста] — [WebKit LayoutTests: system-font-features.html](https://webkit.googlesource.com/WebKit/+/49e061d8a3dbe8c30f3935dcdd27d7b6b9ae2882/LayoutTests/fast/text/system-font-features.html)
- Противоречие: отчёт в Bugzilla Mozilla (user agent Safari 12) — `tabular-nums` не действовал на `-apple-system` (в демо шрифт определялся как `.SFNS Text`), а на Fira Sans работал; исправление не подтверждено [вторичный] — [Mozilla bug 1540143](https://bugzilla.mozilla.org/show_bug.cgi?id=1540143)
- Для сравнения, открытый Inter: `tnum` (табличные цифры), `zero` (перечёркнутый ноль), `ss01` (открытые цифры), `cv01`–`cv04` (альтернативные 1, 4, 6, 9), `frac`, `case`, `sups`/`subs` [первоисточник] — [Inter](https://rsms.me/inter/)

### Inferences
- Для финансового приложения практический рецепт такой: суммы в столбцах и всё, что «тикает» или пересчитывается на глазах, набирать с `font-variant-numeric: tabular-nums`; одиночные суммы в тексте оставлять пропорциональными. Это не зависит от того, SF это или запасной шрифт на Windows.
- Соответствие «stylistic alternative one → `ss01`» (6 и 9) и «two → `ss02`» (4) — стандартное отображение наборов AAT на OpenType, но для SF оно **НЕ ПРОВЕРЕНО**; в CSS его можно попробовать через `font-feature-settings: "ss01"` и смотреть на устройстве.
- Набор SF Mono / `ui-monospace` для сумм — запасной путь, если `tabular-nums` на системном шрифте не сработает; но моноширинный шрифт меняет облик всех знаков, а не только цифр.

### Gaps
- **НЕ ПРОВЕРЕНО:** полный список OpenType-функций SF Pro (`tnum`, `pnum`, `case`, `frac`, `ss01…`, центрированное двоеточие и т. п.). Первоисточник (доклад WWDC 2015 № 804) не открылся; Википедия деталей не даёт.
- **НЕ ПРОВЕРЕНО:** работает ли `tabular-nums` на системном шрифте в текущем Safari (iOS 26 / iOS 27) — есть тест WebKit «за» и старый отчёт «против».

---

## 4. Лицензия: что разрешено, можно ли @font-face / самохостинг / WOFF2 в публичном репозитории

### Takeaway
Вердикт: **нельзя**. Лицензия Apple разрешает шрифты SF только для макетов интерфейсов программ под операционные системы Apple и только зарегистрированным разработчикам Apple; встраивание в продукты, использование для содержимого сайтов, раздача по сети, копирование, изменение и передача запрещены. Значит, подключать SF Pro через `@font-face`, хостить его файлы, конвертировать в WOFF2 и класть в публичный репозиторий GitHub нельзя.

### Cited Findings
- На странице Apple Fonts встроены тексты двух лицензий: для шрифта San Francisco (заголовок ограничивает применение приложениями iOS, OS X и tvOS; код документа EA1370, дата 2/24/2016) и для San Francisco Compact (только watchOS; EA1371, 2/24/2016). Названий SF Pro, SF Mono, New York в этих текстах нет; к какой кнопке загрузки какой текст привязан, страница не говорит [первоисточник] — [Apple Fonts](https://developer.apple.com/fonts/); тот же текст EA1370 в базе лицензий — [ScanCode LicenseDB: san-francisco-font](https://scancode-licensedb.aboutcode.org/san-francisco-font.html)
- Содержание EA1370 по пунктам (пересказ) [первоисточник] — [Apple Fonts](https://developer.apple.com/fonts/):
  - **Важное примечание и §2A:** шрифт предназначен исключительно для создания макетов (mock-ups) пользовательских интерфейсов программ, работающих на iOS, OS X или tvOS. В это право входит показ шрифта на снимках экрана, изображениях и макетах таких программ, цифровых и печатных.
  - **§2A:** пользоваться шрифтом можно только в этих целях и только зарегистрированному Apple Developer (или с письменного разрешения Apple).
  - **§2B:** нельзя устанавливать и использовать шрифт для макетов интерфейсов программ под не-Apple операционные системы. Дословно: "You may not embed the Apple Font in any software programs or other products." Кроме прямо разрешённого, шрифтом нельзя создавать, показывать или распространять документацию, иллюстрации, **содержимое веб-сайтов** и любые иные результаты работы.
  - **§2B:** одновременно шрифтом может пользоваться один пользователь; нельзя делать шрифт доступным по сети, где им могут пользоваться несколько компьютеров сразу.
  - **§2C:** нельзя копировать (кроме разрешённого), декомпилировать, изменять шрифт и создавать производные работы.
  - **§3:** передавать шрифт без письменного согласия Apple нельзя.
  - **§4:** права прекращаются автоматически при нарушении условий, при утрате статуса Apple Developer или при выходе несовместимой версии шрифта.
- Версия лицензии из установщика, процитированная на форуме Apple в декабре 2019, называет уже iOS, iPadOS, macOS и tvOS, но смысл тот же: только макеты интерфейсов для систем Apple, только для зарегистрированных разработчиков [вторичный] — [Apple Developer Forums, thread 127350](https://developer.apple.com/forums/thread/127350)
- В той же ветке на вопрос «можно ли конвертировать SF Mono в WOFF/WOFF2 и отдавать со своего сайта» участник сообщества ответил «нет» со ссылкой на лицензию; инженер Apple (Frameworks Engineer, июнь 2020, принятый ответ) прямо на вопрос о встраивании не ответил, а указал стандартный путь — семейство `system-ui` и ключевые слова Safari 13.1 для антиквы, моноширинного и скруглённого начертаний [первоисточник/форум] — [Apple Developer Forums, thread 127350](https://developer.apple.com/forums/thread/127350)
- Документация Apple (2026): не включать в приложение шрифты, которые Apple поставляет с системой или раздаёт через Apple Fonts (SF Pro, SF Compact, SF Mono, New York); эти семейства зарезервированы для системного использования, а скачивание с Apple Fonts — отдельный рабочий процесс для дизайнеров, чтобы видеть шрифт в макетах [первоисточник] — [Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md)
- HIG: системные шрифты нужно получать через системные API, встраивать их в приложение или игру не следует [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- Репозитории на GitHub, раздающие извлечённые из `.dmg` файлы SF, существуют, но **это нарушение лицензии и не легальный источник**: Apple направляла GitHub уведомление DMCA по такому репозиторию в июне 2020 [вторичный, зеркало архива github/dmca] — [DMCA notice 2020-06-05, Apple](https://git.randommeaninglesscharacters.com/github/dmca/src/branch/master/2020/06/2020-06-05-apple.md)

### Inferences
- Конвертация OTF/TTF → WOFF2 подпадает сразу под несколько запретов: копирование и изменение (§2C), встраивание в продукт и использование для содержимого сайта (§2B), доступность по сети (§2B), передача третьим лицам (§3). Публичный репозиторий GitHub Pages — это и распространение, и сетевой доступ.
- Даже установка SF Pro на компьютер с Windows, чтобы «видеть как на iPhone» при разработке веб-приложения, — спорная зона: лицензия покрывает макеты программ для систем Apple и требует статуса Apple Developer; веб-приложение, открываемое на любых платформах, в эту формулировку явно не укладывается. Безопасное решение — не ставить шрифт вообще, а проверять вид на самом iPhone.
- Легальный способ получить SF в веб-приложении один: не поставлять шрифт, а попросить у устройства Apple его собственный системный шрифт (раздел 5).

### Gaps
- **НЕ ПРОВЕРЕНО:** точный текст лицензии внутри сегодняшних `.dmg` (SF Pro, SF Mono, New York) — образы не скачивались. Проверен текст, встроенный в страницу Apple Fonts (EA1370/EA1371 от 2016), и пересказ более новой версии на форуме (2019).
- Это не юридическая консультация; спорные случаи решает юрист или письменное разрешение Apple.

---

## 5. Легальная альтернатива: системный стек шрифтов. Во что он превращается в Safari на iOS, в Chrome на Windows 11 и на Android. Dynamic Type и PWA

### Takeaway
Писать `font-family: system-ui, -apple-system, …` — официальный путь Apple: в WebKit системный шрифт запрашивается родовыми именами `system-ui`, `ui-sans-serif`, `ui-serif`, `ui-monospace`, `ui-rounded`. На iPhone это SF Pro / New York / SF Mono / SF Rounded; на Windows `system-ui` даёт Segoe UI (не Segoe UI Variable), на Android — Roboto; ключевые слова `ui-*` вне Safari не работают вообще.

### Cited Findings
- Apple: в WebKit системный шрифт задаётся через CSS `font-family` одним из родовых идентификаторов `system-ui`, `ui-sans-serif`, `ui-serif`, `ui-monospace`, `ui-rounded`; системный шрифт нужно получать через такие API, а не по имени — иначе теряются динамические свойства (языки, интервалы, переносы) [первоисточник] — [Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md)
- Во что они разрешаются на iOS / iPadOS / macOS: `system-ui` и `ui-sans-serif` → SF Pro; `ui-serif` → New York; `ui-rounded` → SF Rounded; `ui-monospace` → SF Mono [вторичный] — [Ollie Williams: System font deep dive (01.07.2023)](https://blog-236.pages.dev/blog/system-font-deep-dive); согласуется с таблицей дизайнов SwiftUI [первоисточник] — [Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md)
- История: `-apple-system` введён WebKit в 2015 (автор поста — Myles Maxfield, 27.07.2015); там же предупреждение, что обходные пути вроде имён семейств с точкой в начале не гарантированно работают [первоисточник] — [WebKit blog: Using the System Font in Web Content](https://webkit.org/blog/3709/using-the-system-font-in-web-content/). Ключевые слова `ui-serif`, `ui-sans-serif`, `ui-monospace`, `ui-rounded` появились в Safari 13.1 (пост от 03.04.2020) [первоисточник] — [WebKit blog: New WebKit Features in Safari 13.1](https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/)
- Поддержка в браузерах (данные MDN browser-compat-data, ветка main на 11.11.2026) [первоисточник] — [mdn/browser-compat-data: font-family.json](https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/font-family.json):

  | Ключевое слово | Chrome / Edge / Android Chrome | Firefox | Safari / iOS Safari |
  |---|---|---|---|
  | `system-ui` | 56 | 92 (`-apple-system` с 43, только macOS) | 11 (`-apple-system` с 9) |
  | `ui-serif` | нет (crbug 40194142) | нет (bug 1461302) | 13.1 |
  | `ui-sans-serif` | нет | нет | 13.1 |
  | `ui-monospace` | нет | нет | 13.1 |
  | `ui-rounded` | нет | нет | 13.1 |

- Определения в спецификации: `system-ui` — шрифт интерфейса платформы по умолчанию, конкретный шрифт зависит от платформы, языка, настроек; про каждое `ui-*` сказано, что на платформах без подходящего системного шрифта оно не обязано соответствовать какому-либо шрифту [первоисточник] — [CSS Fonts Module Level 4](https://drafts.csswg.org/css-fonts-4/)
- MDN: `system-ui` задуман для элементов интерфейса, а не для длинных текстов; пользователь часто не может его переопределить; для больших абзацев советуют `sans-serif` [первоисточник] — [MDN: font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)
- **Windows 11:** системный шрифт — Segoe UI Variable (оси: вес `wght` от 100 до 700, оптический размер `opsz` — автоматический, 8–36 pt; покрытие Latin, Greek, Cyrillic). Microsoft отдельно оговаривает: в HTML оптическое масштабирование автоматическое, но Segoe UI Variable нужно указать в CSS явно [первоисточник] — [Microsoft Learn: Typography in Windows](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/typography) (страница обновлена 14.07.2026)
- По `system-ui` в браузерах на Windows Segoe UI Variable **не** выбирается — используется обычный Segoe UI; чтобы получить Variable, его называют явно, причём рабочими именами были `'Segoe UI Variable Text'`, `'Segoe UI Variable Small'`, `'Segoe UI Variable Display'` (простое имя `'Segoe UI Variable'` на май 2022 не работало ни в одном браузере) [вторичный] — [Tiger Oakes: Why use Segoe UI Variable? (25.05.2022)](https://tigeroakes.com/posts/segoe-ui-variable), [Ollie Williams (01.07.2023)](https://blog-236.pages.dev/blog/system-font-deep-dive)
- **Android:** `system-ui` даёт Roboto; Roboto Flex по `system-ui` не выбирается; ни один браузер на Android и на Windows не поддерживает `ui-monospace`, `ui-rounded`, `ui-sans-serif`, `ui-serif` [вторичный] — [Ollie Williams (01.07.2023)](https://blog-236.pages.dev/blog/system-font-deep-dive)
- **Dynamic Type из CSS:** WebKit поддерживает значения свойства `font`: `-apple-system-body`, `-apple-system-headline`, `-apple-system-subheadline`, `-apple-system-caption1`, `-apple-system-caption2`, `-apple-system-footnote`, `-apple-system-short-body`, `-apple-system-short-headline`, `-apple-system-short-subheadline`, `-apple-system-short-caption1`, `-apple-system-short-footnote`, `-apple-system-tall-body` [первоисточник] — [WebKit blog (2015)](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)
- Практика 2024 года: `font: -apple-system-body` на `html` привязывает базовый размер страницы к системной настройке «Размер текста» в iOS и iPadOS; то же работает в WKWebView и SFSafariViewController; побочный эффект — сокращённое свойство `font` заодно ставит системный шрифт, поэтому `font-family` переопределяют следующей строкой; на macOS настройки Dynamic Type нет и размер получается мелким [вторичный] — [Craig Hockenberry: Dynamic Type on the Web (04.07.2024)](https://furbo.org/?p=2791)
- Известные ограничения: единицы `rem` не следуют системному размеру текста сами по себе — [WebKit bug 260880](https://bugs.webkit.org/show_bug.cgi?id=260880); в Safari на macOS это значение даёт 13px вместо 16px — [WebKit bug 230348](https://bugs.webkit.org/show_bug.cgi?id=230348); приём с обёрткой `@supports (font: -apple-system-body)` описан в [dev.to: Colin Gourlay](https://dev.to/colingourlay/how-to-support-apple-s-dynamic-text-in-your-web-content-with-css-40c0) [вторичные]
- HIG про масштабирование текста: в идеале давать увеличение текста минимум на 200 % — через свой интерфейс или через Dynamic Type [первоисточник] — [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

### Inferences
- Рабочий стек для этого проекта (собственная формулировка, не цитата):
  ```css
  /* основной текст */
  font-family: system-ui, -apple-system, "Segoe UI Variable Text", "Segoe UI", Roboto, sans-serif;
  /* скруглённый акцент: на iPhone — SF Rounded, в остальных местах — следующий в списке */
  font-family: ui-rounded, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  /* моноширинный */
  font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
  ```
  Имена после `system-ui` — запас для сред, где ключевое слово не сработает. `BlinkMacSystemFont` — устаревшее имя для старого Chrome на macOS; для iPhone и Windows оно ничего не даёт, держать его в стеке не обязательно (**НЕ ПРОВЕРЕНО** по первоисточнику; встречается в типовых стеках, см. [Tiger Oakes](https://tigeroakes.com/posts/segoe-ui-variable)).
- Разработка идёт в Chrome на Windows 11, а цель — iPhone. Следствие: на рабочем компьютере приложение **никогда** не покажет SF — там будет Segoe UI (или Segoe UI Variable, если назвать его явно). Ширина строк, переносы и высота блоков на Windows и на iPhone будут различаться; окончательную вёрстку нужно смотреть на реальном iPhone, а не в рамке-симуляторе.
- `ui-rounded` на Windows и Android просто пропускается (ключевое слово не поддерживается), поэтому скруглённый облик будет только на устройствах Apple — если нужна одинаковая «округлость» везде, понадобится открытый шрифт (тема другого исследователя).
- Домашний экран iPhone (PWA в режиме standalone) использует тот же движок WebKit, что и Safari, поэтому системный шрифт и ключевые слова должны вести себя так же — это вывод, прямого источника нет.
- Если включать Dynamic Type (`font: -apple-system-body`), все размеры в приложении нужно задавать в `em`/`rem` от базового и проверить вёрстку на крупных размерах: при фиксированных `px` настройка не подействует.

### Gaps
- **НЕ ПРОВЕРЕНО:** что именно выдаёт `system-ui` в актуальном Chrome на Windows 11 в ноябре 2026 (источники — 2022 и 2023 годы). Проверяется за минуту на рабочем компьютере: DevTools → Elements → Computed → Rendered Fonts.
- **НЕ ПРОВЕРЕНО:** Android в 2026 (Roboto / Roboto Flex / Google Sans, подмена шрифта оболочками производителей).
- **НЕ ПРОВЕРЕНО:** работает ли `font: -apple-system-body` в PWA, установленном на экран «Домой», и какой размер он даёт по умолчанию (ожидаемо 17px — по таблице HIG, но источник это число для веба не называет); существуют ли ключевые слова для заголовков (`-apple-system-title1` и т. п.) — в посте WebKit 2015 года их нет.
- Не найдено опубликованных Apple сведений об изменениях этих ключевых слов в Safari 26 / Safari 27.

---

## 6. Можно ли сослаться на установленный «SF Pro» по имени (`local("SF Pro Text")`)

### Takeaway
Нет, как рабочий способ это не годится. На iPhone системный шрифт под именем «SF Pro» не доступен веб-страницам — он запрашивается только родовыми ключевыми словами; а шрифты, которые пользователь установил сам, Safari веб-содержимому не показывает вовсе.

### Cited Findings
- WebKit (защита от отпечатков): веб-содержимому доступны только веб-шрифты и шрифты, поставляемые с операционной системой; шрифты, установленные пользователем локально, недоступны [первоисточник] — [WebKit: Tracking Prevention](https://webkit.org/tracking-prevention/)
- Apple: системный шрифт — не один файл, а семейство, из которого система выбирает гарнитуру по платформе, языку и роли текста; получать его нужно системными API, а не по имени; при обращении по имени теряются динамические свойства [первоисточник] — [Apple Developer: Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts.md)
- WebKit ещё в 2015 предупреждал, что приёмы, опирающиеся на детали реализации вроде имён семейств с точкой в начале, не гарантированно работают [первоисточник] — [WebKit blog (2015)](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)
- Внутренние имена: в отчёте Mozilla системный шрифт Safari определялся как `.SFNS Text` — [Mozilla bug 1540143](https://bugzilla.mozilla.org/show_bug.cgi?id=1540143); Википедия (без сноски) называет кодовые имена SFNS (macOS) и SFUI (iOS) — [Wikipedia](https://en.wikipedia.org/wiki/San_Francisco_(sans-serif_typeface)); на форуме Apple встречается самодельный приём `local(".SFNSText-Light")` — это не рекомендация Apple [вторичные] — [Apple Developer Forums, thread 127350](https://developer.apple.com/forums/thread/127350)

### Inferences
- `local("SF Pro Text")` может сработать только на компьютере, где пользователь сам поставил шрифт с сайта Apple, и только в браузере, который показывает страницам пользовательские шрифты (Safari — нет). На iPhone владельца приложения это не сработает; полагаться на это нельзя.
- Имена `.SF NS` / `.AppleSystemUIFont` — закрытые детали реализации; писать их в CSS бессмысленно и ненадёжно.

### Gaps
- **НЕ ПРОВЕРЕНО:** точное текущее внутреннее имя системного шрифта в iOS 26 / 27 (`.AppleSystemUIFont`, `.SF NS` и т. д.) — первоисточника нет, и для задачи оно не нужно.

---

## 7. Открытые шрифты, ближайшие к SF Pro, для Windows и Android (кратко; подробно — у другого исследователя)

### Takeaway
Главный кандидат — Inter: открытая лицензия OFL, кириллица, переменные оси веса и оптического размера, табличные цифры. Остальные перечислены только как список для проверки.

### Cited Findings
- **Inter** — SIL Open Font License 1.1; 147 языков, в наборе есть кириллица; более 2000 глифов; оси: вес 100–900 и оптический размер (text → display), есть настоящий курсив; функции `tnum`, `zero`, `ss01`, `cv01`–`cv04`, `frac`, `case`; ссылка на лицензию ведёт на версию 4.1 [первоисточник] — [rsms.me/inter](https://rsms.me/inter/)
- **Roboto** — открытый шрифт, системный на Android [вторичный] — [Ollie Williams](https://blog-236.pages.dev/blog/system-font-deep-dive)
- **Segoe UI Variable** — не открытый, но предустановлен в Windows 11 и легально вызывается по имени; Latin, Greek, Cyrillic [первоисточник] — [Microsoft Learn](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/typography)
- **Selawik** — открытый шрифт Microsoft, метрически совместимый с Segoe UI [первоисточник] — [Microsoft Learn](https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/typography), [GitHub: Microsoft/Selawik](https://github.com/Microsoft/Selawik)

### Inferences
- Кандидаты без проверки в этом исследовании (**НЕ ПРОВЕРЕНО**: лицензия, кириллица, ₽, табличные цифры — всё это должен подтвердить исследователь открытых шрифтов): Roboto Flex, Noto Sans, IBM Plex Sans, Manrope, Golos Text, Onest, Geist, Figtree.
- Для скруглённого облика (аналог SF Rounded) открытые кандидаты в этом исследовании не искались.

### Gaps
- Наличие ₽ в Inter не подтверждено: список глифов на странице обрезался до раздела валют.
- Сравнение метрик (ширина строк, x-высота) Inter и SF Pro не проводилось.

---

## 8. Типографика HIG: таблица стилей iOS, трекинг, минимальные размеры, веса, иерархия

### Takeaway
Все числа из задания подтверждены по текущей странице HIG: Large Title 34, Title 1 28, Title 2 22, Title 3 20, Headline 17 Semibold, Body 17, Callout 16, Subhead 15, Footnote 13, Caption 1 12, Caption 2 11; размер по умолчанию 17 pt, минимум 11 pt. HIG публикует и таблицу трекинга SF Pro по кеглям, и «усиленные» (emphasized) веса для каждого стиля (добавлены 16.12.2025).

### Cited Findings
- **Стили iOS / iPadOS, размер Dynamic Type «Large» (по умолчанию)** [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography) (данные прочитаны из JSON этой же страницы: `developer.apple.com/tutorials/data/design/human-interface-guidelines/typography.json`):

  | Стиль | Вес | Кегль, pt | Интерлиньяж, pt | Усиленный вес |
  |---|---|---|---|---|
  | Large Title | Regular | 34 | 41 | Bold |
  | Title 1 | Regular | 28 | 34 | Bold |
  | Title 2 | Regular | 22 | 28 | Bold |
  | Title 3 | Regular | 20 | 25 | Semibold |
  | Headline | Semibold | 17 | 22 | Semibold |
  | Body | Regular | 17 | 22 | Semibold |
  | Callout | Regular | 16 | 21 | Semibold |
  | Subhead | Regular | 15 | 20 | Semibold |
  | Footnote | Regular | 13 | 18 | Semibold |
  | Caption 1 | Regular | 12 | 16 | Semibold |
  | Caption 2 | Regular | 11 | 13 | Semibold |

  Примечание HIG к таблицам: кегль в пунктах соответствует разрешению 144 ppi для @2x и 216 ppi для @3x.
- **Размеры по умолчанию и минимальные** [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography), [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): iOS / iPadOS — 17 pt и 11 pt; macOS — 13 и 10; tvOS — 29 и 23; visionOS — 17 и 12; watchOS — 16 и 12.
- **Трекинг SF Pro (iOS, iPadOS, visionOS)**, кегль → трекинг в 1/1000 em → в pt [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography):

  | pt | 1/1000 em | pt | | pt | 1/1000 em | pt | | pt | 1/1000 em | pt |
  |---|---|---|---|---|---|---|---|---|---|---|
  | 6 | +41 | +0.24 | | 20 | −23 | −0.45 | | 34 | +12 | +0.40 |
  | 7 | +34 | +0.23 | | 21 | −18 | −0.36 | | 35 | +11 | +0.38 |
  | 8 | +26 | +0.21 | | 22 | −12 | −0.26 | | 36 | +10 | +0.37 |
  | 9 | +19 | +0.17 | | 23 | −4 | −0.10 | | 40 | +10 | +0.37 |
  | 10 | +12 | +0.12 | | 24 | +3 | +0.07 | | 44 | +8 | +0.37 |
  | 11 | +6 | +0.06 | | 25 | +6 | +0.15 | | 48 | +8 | +0.35 |
  | 12 | 0 | 0 | | 26 | +8 | +0.22 | | 52 | +6 | +0.33 |
  | 13 | −6 | −0.08 | | 27 | +11 | +0.29 | | 56 | +6 | +0.30 |
  | 14 | −11 | −0.15 | | 28 | +14 | +0.38 | | 60 | +4 | +0.26 |
  | 15 | −16 | −0.23 | | 29 | +14 | +0.40 | | 64 | +4 | +0.22 |
  | 16 | −20 | −0.31 | | 30 | +14 | +0.40 | | 72 | +2 | +0.14 |
  | 17 | −26 | −0.43 | | 31 | +13 | +0.39 | | 76 | +1 | +0.07 |
  | 18 | −25 | −0.44 | | 32 | +13 | +0.41 | | 80–96 | 0 | 0 |
  | 19 | −24 | −0.45 | | 33 | +12 | +0.40 | | | | |

  (В оригинале есть все кегли 6–54 подряд и далее с шагом 2–4; здесь после 36 pt оставлены опорные строки.) На странице есть отдельные таблицы трекинга для SF Pro Rounded (например, 17 pt: +22 / +0.37; 20 pt: +18 / +0.36), New York (17 pt: −4 / −0.07; 20 pt: −10 / −0.20), SF Compact и SF Compact Rounded (watchOS). Сноска HIG: не все программы выражают трекинг в 1/1000 em.
- HIG о трекинге: в работающем приложении системный шрифт сам меняет трекинг на каждом кегле; в макетах его, возможно, придётся выставлять вручную [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography). WWDC20: таблицы трекинга — существенная часть поведения системных шрифтов, поэтому Apple их публикует; для подгонки строки предпочтительно автоматическое «tight tracking», а не ручной кернинг [первоисточник] — [WWDC20, session 10175](https://developer.apple.com/videos/play/wwdc2020/10175/)
- Интерлиньяж: tight leading уменьшает высоту строки на 2 pt, loose — увеличивает на 2 pt (в watchOS — на 1 pt); пример для Body: 22 → 20 или 24 pt [первоисточник] — [WWDC20, session 10175](https://developer.apple.com/videos/play/wwdc2020/10175/). HIG: плотный интерлиньяж уместен в стеснённых по высоте местах (строка списка), но для трёх и более строк его избегать; свободный — для широких колонок и длинных текстов [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- Усиленные варианты: «bold»-признак даёт вес, зависящий от стиля, — medium, semibold, bold или heavy; пример: emphasized Title 1 → SF Pro Bold 28 pt, emphasized Footnote → 13 pt Semibold [первоисточник] — [WWDC20, session 10175](https://developer.apple.com/videos/play/wwdc2020/10175/), [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- **Рекомендации HIG (пересказ)** [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography):
  - Веса: в целом избегать лёгких начертаний; с системными шрифтами предпочитать Regular, Medium, Semibold, Bold и не использовать Ultralight, Thin, Light — их трудно читать, особенно мелко. Если свой шрифт тонкий — брать кегль крупнее рекомендованного.
  - Иерархия: выделять важное весом, кеглем и цветом; сохранять относительную иерархию при изменении размера текста пользователем.
  - Гарнитуры: сводить число гарнитур к минимуму даже в сильно кастомизированном интерфейсе.
  - При увеличении текста — приоритет важному содержимому: не всё обязано расти (например, подписи вкладок); значимые иконки увеличивать вместе с текстом.
  - Dynamic Type: вёрстка должна выдерживать все размеры; усечение текста сводить к минимуму; при очень крупном тексте переходить к «стопочной» раскладке (текст над второстепенными элементами), сокращать число колонок; главные элементы держать вверху экрана.
  - Свои шрифты: должны быть читаемы и повторять поведение системных (Dynamic Type, «Жирный шрифт»).
- Контраст (значения WCAG AA, которыми пользуется Accessibility Inspector): текст до 17 pt — 4.5:1; от 18 pt — 3:1; полужирный любого размера — 3:1 [первоисточник] — [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Журнал изменений страницы Typography: 16.12.2025 — добавлены усиленные веса в таблицы Dynamic Type; 07.03.2025 — расширены рекомендации по Dynamic Type; 10.06.2024; 12.09.2023; 21.06.2023. Записей 2026 года нет [первоисточник] — [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)

### Inferences
- Перевод таблицы в CSS для экрана iPhone (1 pt = 1 CSS px при `width=device-width` — общее правило, в этом исследовании отдельно не подтверждалось): `font-size / line-height` = 34/41, 28/34, 22/28, 20/25, 17/22, 16/21, 15/20, 13/18, 12/16, 11/13 px. Веса в CSS: Regular 400, Medium 500, Semibold 600, Bold 700 (стандартное соответствие, первоисточником не подтверждалось).
- Трекинг по стилям (сведение двух таблиц HIG, только для SF Pro): 34 → +0.012em; 28 → +0.014em; 22 → −0.012em; 20 → −0.023em; 17 → −0.026em; 16 → −0.020em; 15 → −0.016em; 13 → −0.006em; 12 → 0; 11 → +0.006em. На iPhone с системным шрифтом задавать `letter-spacing` **не нужно** — система трекинг применяет сама (утверждение HIG для приложений; для Safari отдельно **НЕ ПРОВЕРЕНО**). К запасным шрифтам на Windows (Segoe UI, Inter) эти значения не переносятся — у них своя разрядка.
- «Число на экране» (суммы денег): отдельного раздела HIG про отображение чисел на странице Typography нет; ближайшее — общие правила иерархии и моноширинные цифры из раздела 3.
- Заголовки капсом (предпочтение владельца проекта) HIG не запрещает и отдельно не регулирует — в прочитанных разделах об этом ничего нет.

### Gaps
- Таблицы для остальных размеров Dynamic Type (xSmall … xxxLarge и AX1–AX5) на странице есть, но здесь не выписаны.
- **НЕ ПРОВЕРЕНО:** применяет ли WebKit таблицу трекинга системного шрифта к веб-тексту автоматически (ожидаемо да, прямого источника нет).
- Рекомендаций HIG именно по отображению денежных сумм и чисел найти не удалось.

---

## 9. Метрики раскладки HIG для имитации в вебе; что изменил Liquid Glass (iOS 26) и что нового в 2026

### Takeaway
HIG сегодня публикует немного чисел: размер элементов управления 44×44 pt (минимум 28×28), отступы около 12 pt вокруг элементов с рамкой и около 24 pt без неё, минимальные кегли и контраст. Высоты панелей, поля 16/20 pt, радиусы и метрики inset grouped в HIG не опубликованы — их дают только UI-киты и измерения сообщества. Liquid Glass (iOS 26) сделал типографику в ключевых местах жирнее и выровнял её по левому краю; в iOS 27 документированных изменений типографики не найдено.

### Cited Findings
- **Размеры элементов управления** [первоисточник] — [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): iOS / iPadOS — по умолчанию 44×44 pt, минимум 28×28 pt (macOS 28×28 / 20×20; watchOS 44×44 / 28×28; visionOS 60×60 / 28×28; tvOS 66×66 / 56×56).
- **Расстояния между элементами:** около 12 pt отступа вокруг элементов с рамкой (bezel) и около 24 pt вокруг видимых краёв элементов без рамки; интервал так же важен, как размер [первоисточник] — [HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- **Безопасные области и направляющие:** safe area — область окна, не перекрытая аппаратными особенностями (Dynamic Island) и панелями (toolbar, tab bar, status bar); её соблюдение обязательно; раскладку определять по size classes, а не по модели устройства или ориентации [первоисточник] — [HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- **Liquid Glass в HIG Layout (с 09.06.2025):** не подкладывать под элементы управления сплошной или полупрозрачный цветной фон — вместо этого scroll edge effect; полноэкранный фон протягивать под боковые панели, тулбары и таб-бары до краёв; при необходимости использовать background extension effect [первоисточник] — [HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- **WWDC25 «Get to know the new design system»** (пересказ) [первоисточник] — [WWDC25, session 356](https://developer.apple.com/videos/play/wwdc2025/356/):
  - Типографика: стала жирнее и выровнена по левому краю ради читаемости в ключевых местах — в алертах и онбординге.
  - Формы: три типа — фиксированный радиус; капсула (радиус = половина высоты контейнера); концентрическая форма (радиус = радиус родителя минус отступ). Для компонентов, которые живут и внутри контейнера, и отдельно, — концентрическая форма с запасным радиусом. На телефоне рекомендована капсула с дополнительным полем у края экрана.
  - Scroll edge effect заменяет жёсткие разделители мягким размытием; стиль soft — по умолчанию для iOS, hard — в основном для macOS; один эффект на вид.
  - Навигация: отдельная вкладка поиска внизу; главное действие (например, «Готово») отделено и окрашено.
  - Конкретных чисел в пунктах (высоты панелей, поля, радиусы) в докладе нет.
- **Числа сообщества, не HIG** [вторичные, слабые]: навигационная панель 44 pt (96 pt с крупным заголовком), таб-бар 49 pt (83 pt с зоной индикатора «Домой»), горизонтальные поля 16 pt — [сторонняя сводка iOS 26](https://skillsmp.com/creators/seunghan91/ios26-design-system/skills-ios26-design); в iOS 26 таб-бар на iPhone — плавающая «пилюля» по центру с отдельным островком поиска справа — [Learn UI Design: iOS design guidelines](https://learnui.design/blog/ios-design-guidelines-templates.html); жалобы разработчиков на высоту панелей в iOS 26 — [Apple Developer Forums, thread 796986](https://developer.apple.com/forums/thread/796986), [thread 787925](https://developer.apple.com/forums/thread/787925)
- **Журнал HIG Layout:** 09.09.2026 — «обновлены рекомендации согласно текущим лучшим практикам»; 09.09.2025 — добавлены спецификации iPhone 17 / Air / 17 Pro / 17 Pro Max; 09.06.2025 — добавлены рекомендации по Liquid Glass [первоисточник] — [HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- **iOS 27 (WWDC 8 июня 2026):** доработки Liquid Glass — системный ползунок прозрачности (от более матового к более прозрачному), многослойные иконки, улучшения автоматически получают уже собранные приложения; про изменения типографики источники не сообщают [вторичные, по сводке поиска] — [MacRumors, 10.06.2026](https://www.macrumors.com/2026/06/10/how-liquid-glass-is-changing-in-ios-27/), [SiliconANGLE, 08.06.2026](https://siliconangle.com/2026/06/08/apple-refines-liquid-glass-design-expands-child-safety-tools-wwdc/)

### Inferences
- Для веб-имитации из подтверждённого HIG следует: кликабельные зоны не меньше 44×44 px (жёсткий минимум 28×28), зазор между соседними элементами 12–24 px, основной текст 17 px, ничего мельче 11 px, контраст 4.5:1 для обычного текста.
- Правило концентричности легко переносится в CSS: `радиус вложенного = радиус контейнера − padding`; кнопки и поля-«пилюли» — `border-radius: 9999px` (радиус = половина высоты).
- «Жирнее и по левому краю» — это про системные алерты и экраны знакомства; из этого не следует, что все заголовки приложения должны стать жирными.
- Пользователь iOS 27 может сам менять прозрачность «стекла», поэтому текст поверх полупрозрачных панелей должен оставаться читаемым при любой прозрачности — в вебе проще использовать достаточно плотную подложку.
- Safe area в вебе задаётся через `viewport-fit=cover` и `env(safe-area-inset-*)` — общеизвестный механизм, в этом исследовании источником не подтверждался.

### Gaps
- **НЕ ПРОВЕРЕНО по первоисточнику:** высота навигационной панели и таб-бара, стандартные поля 16/20 pt, радиусы скруглений карточек и строк, метрики списка inset grouped (высота строки 44 pt, поля, радиус). В HIG этих чисел нет; надёжный источник — официальные UI-киты (раздел 10) или замеры на устройстве.
- В JSON страницы HIG Layout на 11.11.2026 таблица размеров экранов устройств **не нашлась** (в журнале изменений она упоминается). Либо её убрали обновлением 09.09.2026, либо она не попала в прочитанные данные — **НЕ ПРОВЕРЕНО**.
- Страницы HIG про отдельные компоненты (Tab bars, Navigation bars, Lists and tables, Buttons, Color, Materials) не читались.

---

## 10. Apple Design Resources: что предлагается, версии, лицензионные ограничения

### Takeaway
На странице ресурсов лежат UI-киты iOS 27 / iPadOS 27 для Figma и Sketch, шаблоны, шрифты SF и NY, приложение SF Symbols 27, Icon Composer и рамки устройств (включая iPhone 18). Лицензия разрешает всё это только для макетов интерфейсов программ, работающих исключительно на системах Apple; встраивать ресурсы в продукты и использовать для содержимого сайтов нельзя.

### Cited Findings
- **Состав страницы на 11.11.2026** [первоисточник] — [Apple Design Resources](https://developer.apple.com/design/resources/):
  - UI-киты: iOS 27 и iPadOS 27 (Figma, Sketch); macOS 27 (Figma, Sketch); watchOS 26 (Figma, Sketch); visionOS 26 (Figma, Sketch); visionOS 2; tvOS 18 (Sketch).
  - Шаблоны: App Icon Template для iOS / iPadOS / watchOS 27 (Figma, Sketch, Photoshop / Illustrator); шаблоны tvOS 18 и visionOS 2.
  - Технологии: шаблоны App Clips, Apple Pay, Live Activities, Messages, Siri и App Shortcuts, Tap to Pay on iPhone, TipKit, Wallet (Figma, Sketch); кнопки и логотип Sign in with Apple; значки AirPlay, Apple Health, HomeKit, ARKit и др.
  - Шрифты: SF Pro, SF Compact, SF Mono, New York, SF Arabic, SF Armenian, SF Georgian, SF Hebrew.
  - SF Symbols 27: более 7000 символов, девять весов, три масштаба; требуется macOS Sonoma или новее.
  - Icon Composer: многослойные иконки Liquid Glass для iPhone, iPad, Mac, Apple Watch; требуется macOS Sequoia или новее.
  - Рамки устройств (Photoshop, PNG): iPhone 18, iPhone 17, iPhone 16, iPhone Duo, iPad Pro (M5), iPad Air (M4), iPad mini (A20 Pro), iPad (A16), Apple Watch Series 11, Apple Watch Ultra 4 (2026), MacBook Air M5, MacBook Pro M5, MacBook Neo, iMac, Studio Display, Apple TV.
  - Дат выпуска у ресурсов на странице нет. Рядом с рамками — ссылка на Marketing Resources and Identity Guidelines для использования в маркетинговых материалах.
- **Лицензия Apple Design Resources** (код LYL142, дата 06/21/2023; PDF прочитан целиком; пересказ) [первоисточник] — [Apple Design Resources License (PDF)](https://developer.apple.com/support/downloads/terms/apple-design-resources/Apple-Design-Resources-License-20230621-English.pdf):
  - Заголовок и важное примечание: ресурсы — только для макетов интерфейсов программ, которые работают **только** на macOS, iOS, watchOS, tvOS и/или visionOS.
  - §1B: шрифт San Francisco лицензируется отдельным соглашением, которое нужно принять перед установкой.
  - §2A: ограниченная, непередаваемая лицензия при условии соблюдения HIG; разрешено показывать ресурсы на снимках экрана и изображениях таких макетов.
  - §2B: нельзя использовать для макетов программ под не-Apple операционные системы; нельзя встраивать ресурсы в программы и иные продукты; нельзя использовать для создания, показа или распространения документации, иллюстраций, содержимого сайтов; нельзя выкладывать в сеть для одновременного использования несколькими компьютерами; нельзя сдавать, продавать, сублицензировать, распространять.
  - §2C: содержимое шаблонов (интерфейсы, графика, изображения) нельзя извлекать, копировать, изменять, распространять как самостоятельные ассеты; при передаче макета другому лицу нужно сообщить ему об этих ограничениях.
  - §2D: нельзя декомпилировать, изменять, создавать производные работы.
  - §4: при прекращении лицензии все копии нужно уничтожить.
- Википедия (без сноски): SF Symbols разработчики могут использовать только на платформах Apple, часть символов нельзя изменять [вторичный] — [Wikipedia](https://en.wikipedia.org/wiki/San_Francisco_(sans-serif_typeface))

### Inferences
- Веб-приложение, открываемое и на Windows, и на Android, не подпадает под формулировку «программы, работающие только на системах Apple». Значит, вставлять в него графику из UI-китов Apple (иконки, компоненты, рамки устройств) нельзя; макетировать его в официальном ките — тоже вне лицензии. Безопасно — изучать числа (размеры, отступы, радиусы) и воспроизводить их собственным кодом: числовые метрики не являются «Template Content».
- Рамка iPhone для предпросмотра в самом проекте должна быть нарисована самостоятельно (CSS/SVG), а не взята из Product Bezels.
- Символы SF Symbols нельзя переносить в веб-приложение; иконки нужны из открытых наборов (тема другого исследователя).

### Gaps
- **НЕ ПРОВЕРЕНО:** существует ли более новая редакция лицензии Design Resources, чем от 21.06.2023 (на странице ресурсов текст лицензии не показан; найденный PDF датирован 2023 годом).
- Номера версий и даты самих UI-китов (кроме «iOS 27») страница не сообщает; содержимое китов (точные метрики) не открывалось.
- Лицензия SF Symbols по первоисточнику не читалась.

---

## 11. Размер экрана самого большого iPhone (iPhone 18 Pro Max) и вьюпорт 440×956

### Takeaway
iPhone 18 Pro Max выпущен: Apple указывает 6,9 дюйма, 2868×1320 пикселей, 460 ppi, iOS 27 — те же пиксели и плотность, что у iPhone 16 Pro Max и 17 Pro Max, у которых логический размер 440×956 pt при @3x. Значит, вьюпорт 440×956 в симуляторе проекта верен с высокой вероятностью, но сама цифра «440×956 pt» для iPhone 18 Pro Max Apple не опубликована — это вывод делением на 3.

### Cited Findings
- iPhone 18 Pro Max: OLED-дисплей Super Retina XDR 6,9 дюйма по диагонали, 2868×1320 пикселей, 460 ppi, ProMotion до 120 Гц; поставляется с iOS 27. iPhone 18 Pro: 6,3 дюйма, 2622×1206 пикселей, 460 ppi [первоисточник] — [Apple: iPhone 18 Pro — Technical Specifications](https://www.apple.com/uk/iphone-18-pro/specs/); то же на странице поддержки — [Apple Support: iPhone 18 Pro Max](https://support.apple.com/en-gb/148591)
- iPhone 16 Pro Max: 440×956 pt, масштаб 3x, 1320×2868 пикселей, 460 ppi [вторичный] — [Use Your Loaf: iPhone 16 Screen Sizes](https://useyourloaf.com/blog/iphone-16-screen-sizes/)
- Те же 440×956 pt и 1320×2868 px указаны для iPhone 17 Pro Max и 16 Pro Max [вторичный] — [iosref.com: iOS Resolution](https://iosref.com/res)
- В разделе Product Bezels у Apple есть рамка «iPhone 18» [первоисточник] — [Apple Design Resources](https://developer.apple.com/design/resources/)
- Сторонние каталоги дают для iPhone 18 Pro Max другие разрешения (1080×3200, 1800×3200) — они противоречат Apple и ненадёжны [вторичные] — [91mobiles](https://www.91mobiles.com/apple-iphone-18-pro-max-price-in-india?ty=specs)

### Inferences
- 2868 / 3 = 956 и 1320 / 3 = 440, плотность 460 ppi та же → логический размер iPhone 18 Pro Max почти наверняка 440×956 pt @3x, как у двух предыдущих Pro Max. Вьюпорт симулятора 440×956 CSS px менять не нужно.
- Для iPhone 18 Pro тем же делением получается 402×874 pt.
- В Safari видимая высота страницы меньше 956 px из-за панелей браузера; полные 956 px доступны в режиме «на экране Домой» с `viewport-fit=cover`, но часть их занята безопасными зонами (Dynamic Island сверху, индикатор «Домой» снизу) — точные значения отступов для iPhone 18 Pro Max не искались.

### Gaps
- **НЕ ПРОВЕРЕНО:** официальная цифра логического размера (pt) и масштаба для iPhone 18 Pro Max — таблица устройств в HIG Layout в прочитанных данных отсутствует; независимые справочники с iPhone 18 в поиске не попались.
- **НЕ ПРОВЕРЕНО:** значения `safe-area-inset-*` для iPhone 18 Pro Max и дата выхода устройства (на странице характеристик её нет).
