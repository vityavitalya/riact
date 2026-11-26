# Книжная полка (React + PHP + MySQL)

Учебный многостраничный SPA-сайт: пользователи ведут свою книжную полку (название, автор, год, описание).

- **Frontend** — React 19 + react-router-dom, собран на Vite (папка `src`).
- **Backend** — PHP + PDO, JSON-API (папка `api`, копируется в `C:\xampp\htdocs\api`).
- **База** — MySQL (XAMPP), скрипт `database.sql`.

## Как запустить

### 1. XAMPP
1. Установить XAMPP с https://www.apachefriends.org (в папку `C:\xampp`).
2. Открыть **XAMPP Control Panel** и нажать **Start** у **Apache** и **MySQL**.

### 2. База данных
1. Открыть http://localhost/phpmyadmin
2. Вкладка **Импорт** (Import) → **Выберите файл** → `database.sql` из этой папки → кнопка **Вперёд** (Go) внизу.
3. Слева появится база `reactbooks` с таблицами `users`, `items`, `contacts`.

Скрипт сам создаёт базу, поэтому выбирать базу перед импортом не нужно. Повторный импорт сбрасывает данные к начальным.

### 3. PHP-API
Скопировать папку `api` в `htdocs` (в PowerShell):

```powershell
Copy-Item -Recurse -Force C:\reactbooks\api C:\xampp\htdocs\
```

Проверка: http://localhost/api/items должен вернуть JSON со списком книг.

После любых изменений в `C:\reactbooks\api` эту команду нужно повторить.

### 4. React
```powershell
cd C:\reactbooks
npm install
npm run dev
```

Открыть **http://localhost:5173** (именно `localhost`, не `127.0.0.1`, иначе браузер не отправит cookie сессии).

## Тестовые аккаунты

| Роль  | Email          | Пароль   |
|-------|----------------|----------|
| Admin | admin@books.ru | admin123 |
| User  | user@books.ru  | user123  |
| User  | anna@books.ru  | anna123  |

У каждого есть свои книги: можно войти под разными аккаунтами и убедиться, что чужие книги в кабинете не видны и не редактируются.

## Как устроен вход (почему PHP-сессии)

1. `POST /api/auth/login` проверяет пароль через `password_verify()` и кладёт `$_SESSION['user_id']`.
2. PHP отдаёт браузеру cookie `PHPSESSID`.
3. Каждый `fetch` во фронтенде идёт с `credentials: 'include'`, поэтому браузер отправляет эту cookie обратно.
4. На сервере `currentUser($pdo)` берёт `user_id` из сессии и достаёт пользователя из таблицы `users` (вместе с ролью).

Фронтенд (порт 5173) и API (порт 80) — разные origin, поэтому в `api/db.php` стоят CORS-заголовки
с конкретным origin `http://localhost:5173` и `Access-Control-Allow-Credentials: true`, а запрос `OPTIONS` (preflight) сразу получает ответ 200.

Сессии выбраны, потому что это встроенный в PHP механизм: не нужны токены и сторонние библиотеки.

## Endpoint'ы API

| Метод  | Адрес                              | Что делает                             | Доступ   |
|--------|------------------------------------|----------------------------------------|----------|
| GET    | /api/items?limit=5                 | последние 5 книг                       | все      |
| GET    | /api/items                         | все книги                              | все      |
| GET    | /api/items/{id}                    | одна книга                             | все      |
| POST   | /api/contact                       | сообщение с формы контактов            | все      |
| POST   | /api/auth/register                 | регистрация                            | все      |
| POST   | /api/auth/login                    | вход                                   | все      |
| POST   | /api/auth/logout                   | выход                                  | все      |
| GET    | /api/auth/me                       | текущий пользователь                   | все      |
| GET    | /api/cabinet/summary               | имя и количество моих книг             | вошедшие |
| GET    | /api/cabinet/items                 | мои книги                              | вошедшие |
| GET    | /api/cabinet/items/{id}            | моя книга (для редактирования)         | вошедшие |
| POST   | /api/cabinet/items                 | добавить книгу                         | вошедшие |
| PUT    | /api/cabinet/items/{id}            | изменить свою книгу                    | вошедшие |
| DELETE | /api/cabinet/items/{id}            | удалить свою книгу                     | вошедшие |
| GET    | /api/cabinet/profile               | профиль                                | вошедшие |
| PUT    | /api/cabinet/profile               | изменить имя и email                   | вошедшие |
| POST   | /api/cabinet/change-password       | смена пароля                           | вошедшие |
| GET    | /api/admin/users                   | все пользователи                       | Admin    |
| DELETE | /api/admin/items/{id}              | удалить любую книгу                    | Admin    |
| GET    | /api/admin/contacts                | сообщения с формы контактов            | Admin    |

Красивые адреса вида `/api/items/5` работают так: `api/.htaccess` (mod_rewrite) отправляет все запросы в `api/index.php`,
он разбивает адрес на части (`['items', '5']`) и подключает нужный файл из `api/routes`.

## Карта «пункт задания → файл»

| Пункт задания | Где сделано |
|---|---|
| SPA на react-router-dom, маршруты | `src/main.jsx` (BrowserRouter), `src/App.jsx` (Routes / Route) |
| Layout, Header, Footer, меню на всех страницах | `src/components/Layout.jsx`, `Header.jsx`, `Footer.jsx` |
| Маршрут `*` → NotFound | `src/App.jsx`, `src/pages/NotFound.jsx` |
| Страницы-компоненты | `src/pages/HomePage.jsx`, `ItemsPage.jsx`, `ItemDetailsPage.jsx`, `AboutPage.jsx`, `ContactsPage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`, `AdminPage.jsx` |
| Личный кабинет | `src/pages/cabinet/*.jsx` |
| Модели User, Item, LoginForm, RegisterForm, ItemForm | `src/models/*.js` (+ ContactForm, ProfileForm, PasswordForm) |
| Контролируемые формы | все формы: `value={form.x}` + `onChange={handleChange}` |
| Валидация на клиенте | функции `validate...` в `src/models/*Form.js` |
| Валидация на сервере | `api/routes/auth.php`, `cabinet.php`, `contact.php` |
| Переиспользуемые компоненты | `src/components/ItemCard.jsx`, `CabinetMenu.jsx`, `FormField.jsx`, `PrivateRoute.jsx` |
| CSS | `src/styles/style.css` |
| Адаптивность от 375px | `src/styles/style.css` (`flex-wrap`, `grid auto-fill`, `@media (max-width: 600px)`) |
| Данные только через fetch | все страницы, адрес API в `src/config.js` |
| `/` → `GET /api/items?limit=5` | `src/pages/HomePage.jsx`, `api/routes/items.php` |
| `/items`, `/items/:id` | `ItemsPage.jsx`, `ItemDetailsPage.jsx`, `api/routes/items.php` |
| `/contacts` → `POST /api/contact` | `ContactsPage.jsx`, `api/routes/contact.php` |
| Регистрация, вход, выход, me | `RegisterPage.jsx`, `LoginPage.jsx`, `App.jsx` (logout, me), `api/routes/auth.php` |
| password_hash / password_verify | `api/routes/auth.php`, `api/routes/cabinet.php` (смена пароля) |
| Уникальный email, пароль ≥ 6, подтверждение | `src/models/RegisterForm.js`, `api/routes/auth.php` |
| Роли User / Admin в таблице users | `database.sql`, `src/models/User.js` (`isAdmin`) |
| Кабинет только для вошедших, иначе `/login` | `src/components/PrivateRoute.jsx`, `requireUser()` в `api/db.php` |
| Admin-проверка на frontend и backend | `PrivateRoute adminOnly` + пункт меню в `Header.jsx`; `requireAdmin()` в `api/db.php`, `api/routes/admin.php` |
| Меню по состоянию пользователя | `src/components/Header.jsx` |
| Подменю кабинета | `src/components/CabinetMenu.jsx` |
| `WHERE id = ? AND user_id = ?` | `api/routes/cabinet.php` (`findMyItem`, UPDATE, DELETE) |
| Профиль, дата регистрации | `src/pages/cabinet/ProfilePage.jsx`, `api/routes/cabinet.php` |
| Смена пароля | `src/pages/cabinet/ChangePasswordPage.jsx`, `api/routes/cabinet.php` |
| PDO, подготовленные запросы, JSON | `api/db.php`, `api/routes/*.php` |
| CORS и OPTIONS | `api/db.php` |
| Красивые URL | `api/.htaccess`, `api/index.php` |
| Таблицы и тестовые данные | `database.sql` |

## Структура

```
reactbooks/
├── api/                  PHP-API (копия для htdocs)
│   ├── .htaccess         все запросы → index.php
│   ├── index.php         роутер
│   ├── db.php            CORS, сессия, PDO, общие функции
│   └── routes/           items, auth, cabinet, contact, admin
├── database.sql          база для импорта в phpMyAdmin
├── src/
│   ├── components/       Layout, Header, Footer, ItemCard, CabinetMenu, FormField, PrivateRoute
│   ├── models/           User, Item, формы и их валидация
│   ├── pages/            страницы сайта
│   │   └── cabinet/      страницы личного кабинета
│   ├── styles/style.css
│   ├── config.js         адрес API
│   ├── App.jsx           маршруты и текущий пользователь
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Выгрузка на GitHub

1. Создать пустой репозиторий на github.com (без README).
2. В PowerShell:

```powershell
cd C:\reactbooks
git add .
git commit -m "Книжная полка: React + PHP + MySQL"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/reactbooks.git
git push -u origin main
```

`node_modules` и `dist` в репозиторий не попадают (см. `.gitignore`). PHP-часть лежит в папке `api`, база — в `database.sql`.
