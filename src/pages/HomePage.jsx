import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config.js'
import ItemCard from '../components/ItemCard.jsx'

function HomePage({ user }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL + '/items?limit=5', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setItems(data)
        }
      })
      .catch(() => setError('Сервер не отвечает. Запущен ли XAMPP?'))
  }, [])

  return (
    <div>
      <section className="hero">
        <h1>Добро пожаловать на Книжную полку!</h1>
        <p>Здесь читатели делятся любимыми книгами. Зарегистрируйтесь, чтобы собрать свою полку.</p>
        {!user && <Link to="/register" className="button">Создать аккаунт</Link>}
        {user && <Link to="/cabinet/items/create" className="button">Добавить книгу</Link>}
      </section>

      <h2>Новые книги</h2>
      {error && <p className="error">{error}</p>}

      <div className="cards">
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      <p><Link to="/items">Все книги →</Link></p>
    </div>
  )
}

export default HomePage
