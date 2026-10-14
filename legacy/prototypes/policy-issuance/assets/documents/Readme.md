# Локальный комплект документов

Копии скачаны 14.10.2026. Порядок: правила → ключевой информационный документ → образец полиса-оферты.

| Файл | Страниц | Источник |
| --- | ---: | --- |
| rules.pdf | 30 | [Правила](https://rshbins.ru/upload/iblock/612/gva4yeqp8pue2b1qc4r56m68na4oz86k/03_17102017.pdf) |
| key-information.pdf | 3 | [КИД](https://rshbins.ru/upload/iblock/9dc/j2gtyy212nw4dzzhheiz8hr6yuksoh6a/KID-001-Zashchita-vas-i-vashikh-blizkikh_Zashchita-vas-i-vashikh-blizkikh-plyus.pdf) |
| policy-offer.pdf | 9 | [Образец полиса-оферты](https://rshbins.ru/upload/iblock/26a/oqvf29qbqjn2gzruq8et9f6e9nv9af7t/Obrazets-Polisa_oferty-Zashchita-Vas-i-Vashikh-blizkikh.pdf) |

Оригинальные PDF сохранены без изменения. WebP-страницы и `pages.json` создаются скриптом `scripts/prepare-policy-documents.py`; `index.js` связывает их для просмотра. Выделяемый текст правил и образца извлечён из PDF, текст КИД распознан macOS Vision, поскольку большая часть исходного текста записана контурами. OCR может ошибаться при копировании текста; видимые страницы сохраняют оригинал.

Для обновления заменить локальные PDF, запустить подготовку, проверить количество страниц, текстовый слой и Storybook. Загрузка из сети во время просмотра не требуется: браузер запрашивает подготовленные изображения из проекта. Новая подготовка требует Poppler, pdfplumber, Pillow, Swift и macOS Vision.
