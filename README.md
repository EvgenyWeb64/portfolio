# Portfolio

Статический сайт-портфолио. Стили собираются из SCSS в `css/main.css`.

## Команды

```bash
npm ci
npm run build
npm run watch
```

## Деплой на GitHub Pages

В репозитории настроен workflow `.github/workflows/deploy.yml`:

- при пуше в ветку `main` выполняется `npm ci` и `npm run build`
- затем сайт деплоится в GitHub Pages через Actions

