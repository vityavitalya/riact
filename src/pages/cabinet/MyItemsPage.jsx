import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../config.js'
import CabinetMenu from '../../components/CabinetMenu.jsx'
import ItemCard from '../../components/ItemCard.jsx'

function MyItemsPage({ onLogout }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL + '/cabinet/items', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setItems(data)
        }
      })
      .catch(() => setError('Сервер не отвечает'))
  }, [])

  return (
    <div>
      <CabinetMenu onLogout={onLogout} />
      <h1>Мои записи</h1>
      <p><Link to="/cabinet/items/create" className="button">+ Добавить книгу</Link></p>

      {error && <p className="error">{error}</p>}
      {items.length === 0 && !error && <p>У вас пока нет книг.</p>}

      <div className="cards">
        {items.map(item => (
          <ItemCard key={item.id} item={item}>
            <Link to={'/cabinet/items/edit/' + item.id} className="button button-small">Изменить</Link>
            <Link to={'/cabinet/items/delete/' + item.id} className="button button-small button-danger">Удалить</Link>
          </ItemCard>
        ))}
      </div>
    </div>
  )
}

export default MyItemsPage
