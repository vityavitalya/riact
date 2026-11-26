import { Link } from 'react-router-dom'
import { isAdmin } from '../models/User.js'

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">📚 Книжная полка</Link>

        <nav className="menu">
          <Link to="/">Главная</Link>
          <Link to="/items">Книги</Link>
          <Link to="/about">О сайте</Link>
          <Link to="/contacts">Контакты</Link>

          {user ? (
            <>
              <Link to="/cabinet">Личный кабинет</Link>
              {isAdmin(user) && <Link to="/admin">Админка</Link>}
              <button className="link-button" onClick={onLogout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Войти</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
