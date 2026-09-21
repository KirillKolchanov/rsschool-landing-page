# Coffee House — Landing Page

Учебный проект RS School: адаптивный двухстраничный лендинг кофейни,
свёрстанный по макету [Coffee House](https://www.figma.com/design/yuc5s9NCc4jENkk5LdFfvX/Coffee-House-2026Q3).

## Страницы

- `index.html` — главная: hero, слайдер «Favorite coffee», About, Mobile app, контакты.
- `menu.html` — каталог: категории Coffee / Tea / Dessert и карточки напитков.

## Возможности (Часть 1)

- Семантическая вёрстка на чистых HTML и CSS, без фреймворков.
- Адаптивность от 1440px до 380px, бургер-кнопка на ширине 768px и меньше.
- Светлая и тёмная темы с сохранением выбора в `localStorage`.
- Плавная прокрутка по якорям и hover-состояния у ссылок, кнопок и карточек.

## Структура

```
assets/   изображения и иконки из макета
css/      стили
js/       переключение темы
```

## Локальный запуск

```bash
python3 -m http.server 5500
```

Затем откройте http://localhost:5500/index.html
