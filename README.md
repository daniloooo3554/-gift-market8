# GIFT MARKET — Telegram Mini App

## Включено в текущую версию
- Маркет подарков: демонстрационные карточки.
- Покупка (интерфейс-заглушка; реальные сделки выключены).
- Избранное.
- Поиск, фильтр редкости и сортировка.
- Мои подарки (пока экран-заглушка до проверки владения).
- Активность и история (экран-заглушка до интеграции сделок).
- Профиль.
- Подключение TON Wallet через официальный TON Connect UI.

## Исключено по требованиям
- Telegram Stars и Premium.
- Аукционы.

## Запуск
Node.js 20+:
1. `npm install`
2. `npm run dev`
3. `npm run build`
4. `npm run server`

## Подключение
1. Разместить приложение на HTTPS.
2. Указать реальный HTTPS URL и iconUrl в `public/tonconnect-manifest.json`.
3. Создать Telegram-бота через @BotFather.
4. Скопировать `.env.example` в `.env`, задать BOT_TOKEN и MINI_APP_URL.
5. Запустить Node-сервер.

## Важное ограничение
TON Connect — официальный протокол подключения кошелька и запроса подписи транзакций, но он сам по себе не предоставляет каталог Telegram-подарков и не гарантирует передачу подарка покупателю. Для реальной торговли необходимо подключить проверенный marketplace/gift-transfer provider, серверную проверку Telegram initData, проверку владельца и статуса подарка, безопасное расчётное исполнение и аудит. До этого покупки и публикация объявлений отключены. Никогда не запрашивайте seed phrase или приватные ключи.

Документация:
- https://docs.ton.org/applications/ton-connect/overview
- https://core.telegram.org/api/gifts
- https://core.telegram.org/api/gift-marketplaces
- https://core.telegram.org/bots/webapps
