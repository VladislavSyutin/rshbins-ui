# Motion: ролик сценария регистрации ФЛ

Ролик для описания кейса аутентификации: телефон → код из SMS → данные страхователя.
Снимается с реальных компонентов прототипа `Legacy/Prototypes/Authentication` из Storybook.

## Результат

- `out/registration-fl.mp4` — основной файл, H.264, 1920×1080, 60 fps, без звука, ~15 с, зацикленный.
- `out/registration-fl.webm` — запасной вариант (VP9).

```html
<video autoplay muted loop playsinline>
  <source src="registration-fl.webm" type="video/webm">
  <source src="registration-fl.mp4" type="video/mp4">
</video>
```

## Как пересобрать

```bash
npm install                 # в корне проекта
npm run storybook           # Storybook на :6008
cd motion && npm install    # playwright + ffmpeg-static
node record.mjs
```

Нужен установленный Google Chrome (Playwright запускается с `channel: 'chrome'`).
Опция `OUTRO_HOLD=600 node record.mjs` задаёт паузу на чистом градиенте в конце, мс.

## Как устроено

- Страница-обёртка отдаётся с `localhost:6008` (иначе у iframe нет доступа к `localStorage`): градиент в палитре РСХБ, окно браузера с `rshbins.ru/login`, свой курсор с кольцом при клике.
- Кадры снимаются через CDP screencast с таймстемпами, затем собираются ffmpeg.
- Ожидания лоадеров (3 с) вырезаются при сборке, поэтому ролик укладывается в 15 с.
- Смена экранов: снимок старого экрана уезжает влево, новый приезжает справа.
- Курсор на время снимка скрывается, соответствующие кадры вырезаются.
