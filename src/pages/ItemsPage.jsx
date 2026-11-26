import { useState, useEffect } from 'react'
import { API_URL } from '../config.js'
import ItemCard from '../components/ItemCard.jsx'

function ItemsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL + '/items', { credentials: 'include' })
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
      <h1>Все книги</h1>
      {error && <p className="error">{error}</p>}

      <div className="cards">
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default ItemsPage
