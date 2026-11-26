import { NavLink } from 'react-router-dom'

function CabinetMenu({ onLogout }) {
  return (
    <nav className="cabinet-menu">
      <NavLink to="/cabinet" end>Кабинет</NavLink>
      <NavLink to="/cabinet/items">Мои записи</NavLink>
      <NavLink to="/cabinet/profile">Профиль</NavLink>
      <NavLink to="/cabinet/change-password">Смена пароля</NavLink>
      <button className="link-button" onClick={onLogout}>Выйти</button>
    </nav>
  )
}

export default CabinetMenu
